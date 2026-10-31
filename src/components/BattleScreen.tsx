import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameMode,
  QuizQuestion,
  InventoryItem,
  ItemType,
  IncorrectRecord,
  MonsterConfig
} from '../types/game';
import {
  MONSTERS,
  generateQuestion,
  evaluateCounterDamage
} from '../utils/quizGenerator';
import {
  HeroSprite,
  SlimeSprite,
  GoblinSprite,
  GolemSprite,
  SkeletonSprite,
  BossSprite,
  HillaSprite,
  VonLeonSprite,
  ArkariumSprite,
  MagnusSprite,
  BlackMageSprite,
  ItemSprite
} from './PixelSprites';
import { BattleBackground } from './BattleBackground';
import { CampfireModal } from './CampfireModal';
import { soundManager } from '../utils/sound';
import { Shield, Zap, Clock, Heart, Volume2, VolumeX, Pause, Play, AlertOctagon, Flame } from 'lucide-react';

interface BattleScreenProps {
  mode: GameMode;
  selectedDan?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onGameClear: (summary: {
    totalTimeSeconds: number;
    totalAnswered: number;
    correctCount: number;
    criticalCount: number;
    maxCombo: number;
    incorrectList: IncorrectRecord[];
  }) => void;
  onGameOver: (summary: {
    totalTimeSeconds: number;
    totalAnswered: number;
    correctCount: number;
    criticalCount: number;
    maxCombo: number;
    incorrectList: IncorrectRecord[];
  }) => void;
}

interface FloatingText {
  id: string;
  text: string;
  color: string;
  isCrit?: boolean;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  mode,
  selectedDan,
  isMuted,
  onToggleMute,
  onGameClear,
  onGameOver
}) => {
  // Game Stage State
  const [stageIndex, setStageIndex] = useState<number>(0);
  const currentMonster: MonsterConfig = MONSTERS[stageIndex] || MONSTERS[0];

  // Campfire / Rest phase between stages
  const [isCampfireOpen, setIsCampfireOpen] = useState<boolean>(false);
  const [justClearedStage, setJustClearedStage] = useState<number>(1);
  const [droppedItemForCamp, setDroppedItemForCamp] = useState<InventoryItem | null>(null);

  // In-battle Tactical Pause
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Hero State
  const maxHeroHp = 100;
  const [heroHp, setHeroHp] = useState<number>(100);
  const [heroAction, setHeroAction] = useState<'idle' | 'attack' | 'hit'>('idle');

  // Monster State
  const [monsterHp, setMonsterHp] = useState<number>(currentMonster.maxHp);
  const [monsterAction, setMonsterAction] = useState<'idle' | 'attack' | 'hit'>('idle');

  // Buffs / Items Active
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [swordBuffTurns, setSwordBuffTurns] = useState<number>(0);
  const [isHourglassActive, setIsHourglassActive] = useState<boolean>(false);

  // Inventory (Starts completely empty at 0 items; items are earned via victory loot)
  const [inventory, setInventory] = useState<Record<ItemType, InventoryItem>>({
    POTION: { id: 'POTION', name: '체력 포션', description: '용사 HP 30% 즉시 회복', icon: '🧪', count: 0 },
    SWORD: { id: 'SWORD', name: '전설의 검', description: '3턴간 100% 크리티컬 카운터', icon: '⚔️', count: 0 },
    HOURGLASS: { id: 'HOURGLASS', name: '모래시계', description: '스킬 방어 제한시간 2배 연장', icon: '⏱️', count: 0 },
    SHIELD: { id: 'SHIELD', name: '용사의 방패', description: '다음 1회 피격 데미지 100% 무효화', icon: '🛡️', count: 0 }
  });

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(7);
  const [isAnsweringLocked, setIsAnsweringLocked] = useState<boolean>(false);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);

  // Stats for Result Screen
  const startTimeRef = useRef<number>(Date.now());
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [criticalCount, setCriticalCount] = useState<number>(0);
  const incorrectListRef = useRef<IncorrectRecord[]>([]);

  // Visual Effects
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Add floating damage text
  const addFloatingText = (text: string, color: string, isCrit = false) => {
    const id = `f_${Date.now()}_${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, color, isCrit }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  // Trigger screen shake
  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 350);
  };

  // Spawn Question helper bound to current stage & monster skill
  const spawnNextQuestion = useCallback((targetStageIdx = stageIndex, hourglassActive = isHourglassActive) => {
    const timeMultiplier = hourglassActive ? 2.0 : 1.0;
    const q = generateQuestion(mode, selectedDan, timeMultiplier, targetStageIdx);
    setCurrentQuestion(q);
    setTimeLeft(q.timeLimit);
    questionStartTimeRef.current = Date.now();
    setIsAnsweringLocked(false);

    // If Strong or Ultimate skill, trigger warning chime
    if (q.skill.danger === 'ULTIMATE' || q.skill.danger === 'STRONG') {
      soundManager.playWarning();
    }
  }, [isHourglassActive, mode, selectedDan, stageIndex]);

  // Handle Timeout (Monster's skill successfully hits Hero)
  const handleTimeout = useCallback(() => {
    if (isAnsweringLocked || !currentQuestion || isPaused || isCampfireOpen) return;
    setIsAnsweringLocked(true);

    const activeSkill = currentQuestion.skill;

    // Record as incorrect
    incorrectListRef.current.push({
      id: currentQuestion.id,
      dan: currentQuestion.dan,
      multiplier: currentQuestion.multiplier,
      correctAnswer: currentQuestion.correctAnswer,
      isTimeout: true,
      skillName: activeSkill.name
    });

    setTotalAnswered((prev) => prev + 1);
    setCombo(0);

    // Monster strikes hero
    setMonsterAction('attack');
    setTimeout(() => setMonsterAction('idle'), 300);

    if (isShieldActive) {
      soundManager.playBlock();
      setIsShieldActive(false);
      addFloatingText('방패 방어! (DAMAGE BLOCKED)', '#60a5fa');
    } else {
      soundManager.playHurt();
      triggerShake();
      const monsterDmg = activeSkill.damage;
      addFloatingText(`방어 실패! ${activeSkill.name} -${monsterDmg} HP`, '#ef4444');
      setHeroAction('hit');
      setTimeout(() => setHeroAction('idle'), 400);

      const nextHeroHp = Math.max(0, heroHp - monsterDmg);
      setHeroHp(nextHeroHp);

      if (nextHeroHp <= 0) {
        soundManager.playGameOver();
        setTimeout(() => {
          onGameOver({
            totalTimeSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
            totalAnswered: totalAnswered + 1,
            correctCount,
            criticalCount,
            maxCombo,
            incorrectList: incorrectListRef.current
          });
        }, 800);
        return;
      }
    }

    if (isHourglassActive) {
      setIsHourglassActive(false);
    }

    setTimeout(() => {
      spawnNextQuestion();
    }, 1100);
  }, [
    isAnsweringLocked,
    currentQuestion,
    isPaused,
    isCampfireOpen,
    isShieldActive,
    heroHp,
    isHourglassActive,
    totalAnswered,
    correctCount,
    criticalCount,
    maxCombo,
    onGameOver,
    spawnNextQuestion
  ]);

  // Timer Interval
  useEffect(() => {
    if (isAnsweringLocked || isPaused || isCampfireOpen) return;

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerIntervalRef.current!);
          handleTimeout();
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isAnsweringLocked, isPaused, isCampfireOpen, handleTimeout]);

  // Initial Question on Stage Mount
  useEffect(() => {
    spawnNextQuestion(stageIndex);
  }, [stageIndex, spawnNextQuestion]);

  // Handle Item Drop helper
  const rollItemDrop = (): InventoryItem => {
    const itemPool: ItemType[] = ['POTION', 'SWORD', 'HOURGLASS', 'SHIELD'];
    const randomItemType = itemPool[Math.floor(Math.random() * itemPool.length)];
    const item = inventory[randomItemType];

    setInventory((prev) => ({
      ...prev,
      [randomItemType]: {
        ...prev[randomItemType],
        count: prev[randomItemType].count + 1
      }
    }));

    soundManager.playItemDrop();
    return item;
  };

  // Advance to Next Stage with Campfire Break or Game Clear
  const advanceStageOrClear = () => {
    soundManager.playMonsterDefeated();
    const dropped = rollItemDrop();

    const nextIndex = stageIndex + 1;
    if (nextIndex >= MONSTERS.length) {
      soundManager.playVictoryFanfare();
      setTimeout(() => {
        onGameClear({
          totalTimeSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
          totalAnswered: totalAnswered + 1,
          correctCount: correctCount + 1,
          criticalCount,
          maxCombo,
          incorrectList: incorrectListRef.current
        });
      }, 1200);
    } else {
      setTimeout(() => {
        setJustClearedStage(stageIndex + 1);
        setDroppedItemForCamp(dropped);
        setIsCampfireOpen(true);
      }, 700);
    }
  };

  // Callback when player finishes resting at Campfire
  const handleStartNextStageFromCamp = () => {
    const nextIndex = stageIndex + 1;
    setStageIndex(nextIndex);
    setMonsterHp(MONSTERS[nextIndex].maxHp);
    setIsCampfireOpen(false);
    setDroppedItemForCamp(null);
    spawnNextQuestion(nextIndex);
  };

  // Handle User Selecting an Answer (Defending against Monster's Skill)
  const handleAnswer = (selectedOption: number) => {
    if (isAnsweringLocked || !currentQuestion || isPaused || isCampfireOpen) return;
    setIsAnsweringLocked(true);

    const elapsedSeconds = (Date.now() - questionStartTimeRef.current) / 1000;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const activeSkill = currentQuestion.skill;
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      // Defense Success! Counter-attack the Monster!
      const isSwordBuff = swordBuffTurns > 0;
      const evaluation = evaluateCounterDamage(elapsedSeconds, activeSkill.danger, isSwordBuff);

      if (isSwordBuff) {
        setSwordBuffTurns((prev) => Math.max(0, prev - 1));
      }
      if (isHourglassActive) {
        setIsHourglassActive(false);
      }

      // Update Combo
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      setCorrectCount((prev) => prev + 1);

      if (evaluation.rating === 'PERFECT_PARRY') {
        setCriticalCount((prev) => prev + 1);
        soundManager.playParry();
        triggerShake();
        addFloatingText(`⚡ PERFECT PARRY!! -${evaluation.heroDamageDealt} 치명타!`, '#fbbf24', true);
      } else {
        soundManager.playHit();
        addFloatingText(`🛡️ 방어 성공! -${evaluation.heroDamageDealt} 반격!`, '#38bdf8');
      }

      // Hero strikes upward toward the monster
      setHeroAction('attack');
      setMonsterAction('hit');
      setTimeout(() => {
        setHeroAction('idle');
        setMonsterAction('idle');
      }, 350);

      // Monster HP Damage
      const nextMonsterHp = Math.max(0, monsterHp - evaluation.heroDamageDealt);
      setMonsterHp(nextMonsterHp);

      if (nextMonsterHp <= 0) {
        advanceStageOrClear();
      } else {
        setTimeout(() => {
          spawnNextQuestion();
        }, 700);
      }
    } else {
      // Incorrect Answer! Failed to block the monster's skill!
      incorrectListRef.current.push({
        id: currentQuestion.id,
        dan: currentQuestion.dan,
        multiplier: currentQuestion.multiplier,
        correctAnswer: currentQuestion.correctAnswer,
        playerAnswer: selectedOption,
        isTimeout: false,
        skillName: activeSkill.name
      });

      setCombo(0);

      // Monster attacks Hero
      setMonsterAction('attack');
      setTimeout(() => setMonsterAction('idle'), 300);

      if (isShieldActive) {
        soundManager.playBlock();
        setIsShieldActive(false);
        addFloatingText('방패 방어! (DAMAGE BLOCKED)', '#60a5fa');
      } else {
        soundManager.playHurt();
        triggerShake();
        const monsterDmg = activeSkill.damage;
        addFloatingText(`오답! ${activeSkill.name} -${monsterDmg} HP`, '#ef4444');
        setHeroAction('hit');
        setTimeout(() => setHeroAction('idle'), 400);

        const nextHeroHp = Math.max(0, heroHp - monsterDmg);
        setHeroHp(nextHeroHp);

        if (nextHeroHp <= 0) {
          soundManager.playGameOver();
          setTimeout(() => {
            onGameOver({
              totalTimeSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
              totalAnswered: totalAnswered + 1,
              correctCount,
              criticalCount,
              maxCombo,
              incorrectList: incorrectListRef.current
            });
          }, 800);
          return;
        }
      }

      if (isHourglassActive) {
        setIsHourglassActive(false);
      }

      setTimeout(() => {
        spawnNextQuestion();
      }, 900);
    }
  };

  // Keyboard shortcut listener (Keys 1~4, Z/X/C/V, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar for Campfire or Pause Toggle
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (isCampfireOpen) {
          handleStartNextStageFromCamp();
        } else {
          soundManager.playSelect();
          setIsPaused((prev) => !prev);
        }
        return;
      }

      if (isCampfireOpen || isPaused) return;

      // Answer Keys (1, 2, 3, 4)
      const key = e.key;
      let optionIndex = -1;
      if (key === '1' || key === 'q' || key === 'Q') optionIndex = 0;
      if (key === '2' || key === 'w' || key === 'W') optionIndex = 1;
      if (key === '3' || key === 'e' || key === 'E') optionIndex = 2;
      if (key === '4' || key === 'r' || key === 'R') optionIndex = 3;

      if (optionIndex !== -1 && currentQuestion?.options[optionIndex] !== undefined && !isAnsweringLocked) {
        e.preventDefault();
        handleAnswer(currentQuestion.options[optionIndex]);
        return;
      }

      // Quick Item Keys (Z = Potion, X = Sword, C = Hourglass, V = Shield)
      if (key === 'z' || key === 'Z' || key === 'ㅋ') {
        e.preventDefault();
        handleUseItem('POTION');
      } else if (key === 'x' || key === 'X' || key === 'ㅌ') {
        e.preventDefault();
        handleUseItem('SWORD');
      } else if (key === 'c' || key === 'C' || key === 'ㅊ') {
        e.preventDefault();
        handleUseItem('HOURGLASS');
      } else if (key === 'v' || key === 'V' || key === 'ㅍ') {
        e.preventDefault();
        handleUseItem('SHIELD');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Use Item
  const handleUseItem = (type: ItemType) => {
    const item = inventory[type];
    if (item.count <= 0) return;

    soundManager.playItemUse();
    setInventory((prev) => ({
      ...prev,
      [type]: { ...prev[type], count: prev[type].count - 1 }
    }));

    if (type === 'POTION') {
      const healAmount = Math.round(maxHeroHp * 0.3);
      setHeroHp((prev) => Math.min(maxHeroHp, prev + healAmount));
      addFloatingText(`+${healAmount} HP 회복!`, '#4ade80');
    } else if (type === 'SWORD') {
      setSwordBuffTurns((prev) => prev + 3);
      addFloatingText('전설의 검 활성! 3턴간 패링 카운터 100%!', '#fbbf24');
    } else if (type === 'HOURGLASS') {
      setIsHourglassActive(true);
      setTimeLeft((prev) => prev + 6);
      addFloatingText('시간 대폭 연장! (+6초)', '#38bdf8');
    } else if (type === 'SHIELD') {
      setIsShieldActive(true);
      addFloatingText('방패 장착! 다음 1회 피격 100% 방어', '#60a5fa');
    }
  };

  // Render Monster Sprite based on stage
  const renderMonsterSprite = () => {
    const spriteClass = monsterAction === 'attack' ? 'translate-y-8 scale-110' : '';
    switch (currentMonster.spriteId) {
      case 'hilla':
        return <HillaSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-32 h-32 sm:w-36 sm:h-36 transition-transform ${spriteClass}`} />;
      case 'von_leon':
        return <VonLeonSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-34 h-34 sm:w-40 sm:h-40 transition-transform ${spriteClass}`} />;
      case 'arkarium':
        return <ArkariumSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-32 h-32 sm:w-36 sm:h-36 transition-transform ${spriteClass}`} />;
      case 'magnus':
        return <MagnusSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-36 h-36 sm:w-42 sm:h-42 transition-transform ${spriteClass}`} />;
      case 'black_mage':
        return <BlackMageSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-38 h-38 sm:w-48 sm:h-48 transition-transform ${spriteClass}`} />;
      case 'slime':
        return <SlimeSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-28 h-28 sm:w-32 sm:h-32 transition-transform ${spriteClass}`} />;
      case 'goblin':
        return <GoblinSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-28 h-28 sm:w-32 sm:h-32 transition-transform ${spriteClass}`} />;
      case 'golem':
        return <GolemSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-32 h-32 sm:w-36 sm:h-36 transition-transform ${spriteClass}`} />;
      case 'skeleton':
        return <SkeletonSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-30 h-30 sm:w-34 sm:h-34 transition-transform ${spriteClass}`} />;
      case 'boss':
      default:
        return <BlackMageSprite action={monsterAction === 'hit' ? 'hit' : 'idle'} className={`w-38 h-38 sm:w-48 sm:h-48 transition-transform ${spriteClass}`} />;
    }
  };

  const timerRatio = currentQuestion ? Math.max(0, timeLeft / currentQuestion.timeLimit) : 1;
  const activeSkill = currentQuestion?.skill;

  return (
    <div className={`min-h-screen bg-[#0d1117] text-white flex flex-col justify-between p-2 sm:p-4 scanlines select-none relative overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
      {/* Dynamic 8-bit Stage Background */}
      <BattleBackground stage={stageIndex + 1} />

      {/* Campfire Modal between stages */}
      {isCampfireOpen && stageIndex + 1 < MONSTERS.length && (
        <CampfireModal
          clearedStage={justClearedStage}
          nextMonster={MONSTERS[stageIndex + 1]}
          heroHp={heroHp}
          maxHeroHp={maxHeroHp}
          inventory={inventory}
          droppedItem={droppedItemForCamp}
          onUseItem={handleUseItem}
          onStartNextStage={handleStartNextStageFromCamp}
          isShieldActive={isShieldActive}
          swordBuffTurns={swordBuffTurns}
        />
      )}

      {/* Tactical Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-40 bg-black/85 flex items-center justify-center p-4 scanlines">
          <div className="max-w-md w-full retro-box p-6 border-cyan-400 text-center">
            <h2 className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-2 mb-2">
              <Pause className="w-6 h-6 text-cyan-400" />
              <span>전술 일시정지 (PAUSE)</span>
            </h2>
            <p className="text-xs text-stone-300 mb-5">
              전투 타이머가 정지되었습니다. 여유롭게 아이템을 점검하고 사용하세요!
            </p>

            <div className="bg-stone-900 border border-stone-700 p-3 rounded mb-5 text-left">
              <div className="text-[11px] text-amber-300 font-bold mb-2 flex items-center justify-between">
                <span>보유 아이템 (클릭하여 즉시 사용)</span>
                <span className="text-[10px] text-stone-400">HP: {heroHp}/{maxHeroHp}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(inventory) as ItemType[]).map((type) => {
                  const item = inventory[type];
                  return (
                    <button
                      key={type}
                      disabled={item.count <= 0}
                      onClick={() => handleUseItem(type)}
                      className={`p-2 rounded border text-left flex items-center gap-2 transition-colors ${
                        item.count > 0
                          ? 'bg-stone-800 hover:bg-stone-700 border-stone-600 cursor-pointer'
                          : 'bg-stone-950 opacity-40 border-stone-800 cursor-not-allowed'
                      }`}
                    >
                      <ItemSprite type={type} className="w-6 h-6 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{item.name}</span>
                          <span className="text-amber-400 font-mono">x{item.count}</span>
                        </div>
                        <div className="text-[9px] text-stone-400 truncate">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playSelect();
                setIsPaused(false);
              }}
              className="w-full retro-btn bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-black py-3 flex items-center justify-center gap-2 border-cyan-300 shadow-[0_4px_0_#0e7490]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>전투 재개하기 (Resume / Space)</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Stage Info */}
      <header className="relative z-10 flex items-center justify-between bg-stone-950/80 backdrop-blur-sm border border-stone-800 px-3 py-1.5 rounded mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2 py-0.5 bg-amber-500 text-stone-950 rounded">
            STAGE {currentMonster.stage}/5
          </span>
          <span className="text-xs text-amber-300 font-bold hidden sm:inline">
            {currentMonster.title}
          </span>
          <span className="text-[11px] text-stone-400">
            {mode === 'NORMAL' ? `[${selectedDan}단]` : '[전체 랜덤]'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="text-xs font-black text-amber-400 animate-pulse tracking-wide mr-1">
              🔥 {combo} COMBO!
            </div>
          )}

          <button
            onClick={() => {
              soundManager.playSelect();
              setIsPaused((prev) => !prev);
            }}
            className="px-2 py-1 bg-stone-800 hover:bg-cyan-950 hover:text-cyan-300 text-stone-300 rounded border border-stone-700 text-xs font-bold flex items-center gap-1"
            title="일시정지 및 가방 열기 (단축키: Space)"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">일시정지</span>
            <span className="text-[10px] text-stone-400 font-mono">(Space)</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700"
            title="사운드 토글"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>
        </div>
      </header>

      {/* Battle Field (Vertical Pokémon / Dragon Quest perspective: Monster UP, Hero DOWN) */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto flex flex-col justify-between">
        {/* Floating Combat Texts Container */}
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center">
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className={`animate-float-damage font-black text-xl sm:text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,1)] my-1 ${
                ft.isCrit ? 'animate-crit text-2xl sm:text-3xl' : ''
              }`}
              style={{ color: ft.color }}
            >
              {ft.text}
            </div>
          ))}
        </div>

        {/* ================= TOP ZONE: MONSTER & ATTACK FORECAST ================= */}
        <div className="flex flex-col items-center w-full">
          {/* Monster HUD Card */}
          <div className="w-full bg-stone-950/85 border-2 border-stone-700 p-2.5 rounded shadow-lg mb-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-red-400 tracking-wide">
                  {currentMonster.name}
                </span>
                {activeSkill && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-black font-mono flex items-center gap-1 ${
                      activeSkill.danger === 'ULTIMATE'
                        ? 'bg-red-600 text-white animate-pulse'
                        : activeSkill.danger === 'STRONG'
                        ? 'bg-amber-600 text-stone-950'
                        : 'bg-stone-700 text-stone-200'
                    }`}
                  >
                    {activeSkill.danger === 'ULTIMATE' && <Flame className="w-3 h-3 text-yellow-300" />}
                    {activeSkill.danger === 'ULTIMATE' ? '치명적 필살기 ⚠️' : activeSkill.danger === 'STRONG' ? '강공격!' : '일반 공격'}
                  </span>
                )}
              </div>
              <div className="text-xs font-mono font-bold text-stone-300">
                HP {monsterHp}/{currentMonster.maxHp}
              </div>
            </div>

            {/* Monster HP Bar */}
            <div className="w-full bg-stone-900 border border-stone-700 h-2.5 rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-red-600 transition-all duration-200"
                style={{ width: `${(monsterHp / currentMonster.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Monster Sprite in Arena */}
          <div className="h-28 sm:h-36 flex items-center justify-center my-1 relative">
            {renderMonsterSprite()}
          </div>

          {/* Monster Incoming Skill Announcement Banner */}
          {activeSkill && (
            <div
              className={`w-full py-1.5 px-3 rounded border text-center transition-all ${
                activeSkill.danger === 'ULTIMATE'
                  ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                  : activeSkill.danger === 'STRONG'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                  : 'bg-stone-900/90 border-stone-700 text-stone-200'
              }`}
            >
              <div className="text-[11px] font-bold flex items-center justify-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  몬스터가 <span className="text-amber-300 font-black">[{activeSkill.name}]</span>(으)로 공격합니다! (예상 피해: -{activeSkill.damage} HP)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================= CENTER ZONE: QUIZ & FAST TIMER ================= */}
        <div className="retro-box-gold p-3 my-2 w-full flex flex-col items-center bg-stone-950/90 relative">
          <div className="text-stone-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 mb-0.5">
            <span>DEFENSE SPELL · 구구단으로 공격을 막아내라!</span>
          </div>

          {/* Multiplication Formula */}
          <div className="text-3xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_3px_0_#78350f] my-1 font-mono tracking-wider">
            {currentQuestion ? `${currentQuestion.dan} × ${currentQuestion.multiplier} = ?` : '수호진 전개 중...'}
          </div>

          {/* Progressive Speed Timer Bar */}
          <div className="w-full mt-2">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className={timeLeft <= 1.4 ? 'text-amber-400 font-bold animate-pulse' : 'text-stone-300'}>
                {timeLeft <= 1.4 ? '⚡ PERFECT PARRY 영역 (패링 카운터!)' : '🛡️ GUARD 영역 (방어 성공)'}
              </span>
              <span className="text-stone-200 font-bold font-mono text-xs">
                {timeLeft.toFixed(1)}s
              </span>
            </div>

            <div className="w-full bg-stone-950 border-2 border-stone-800 h-3.5 relative overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  timeLeft <= 1.4 ? 'bg-amber-400 animate-pulse' : timeLeft <= 2.5 ? 'bg-cyan-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${timerRatio * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ZONE: HERO & INPUT CONSOLE ================= */}
        <div className="w-full flex flex-col">
          {/* Hero Profile Bar (Hero Facing UP toward the Monster) */}
          <div className="bg-stone-950/85 border-2 border-stone-700 p-2 rounded mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hero Sprite at the Bottom */}
              <div className="relative">
                <HeroSprite action={heroAction} className="w-14 h-14" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-400">구구단 용사</span>
                  <span className="text-[11px] font-mono text-stone-300">
                    HP {heroHp}/{maxHeroHp}
                  </span>
                </div>

                {/* Hero HP Bar */}
                <div className="w-36 sm:w-48 bg-stone-900 border border-stone-700 h-2.5 rounded-none overflow-hidden p-0.5 mt-0.5">
                  <div
                    className={`h-full transition-all duration-200 ${
                      heroHp > 50 ? 'bg-emerald-500' : heroHp > 25 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${(heroHp / maxHeroHp) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Buffs */}
            <div className="flex items-center gap-1 text-[10px]">
              {isShieldActive && (
                <span className="flex items-center gap-0.5 bg-blue-950 text-blue-300 border border-blue-700 px-1.5 py-0.5 rounded font-bold">
                  <Shield className="w-3 h-3" /> 방패
                </span>
              )}
              {swordBuffTurns > 0 && (
                <span className="flex items-center gap-0.5 bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 rounded font-bold animate-pulse">
                  <Zap className="w-3 h-3" /> 패링검({swordBuffTurns})
                </span>
              )}
              {isHourglassActive && (
                <span className="flex items-center gap-0.5 bg-cyan-950 text-cyan-300 border border-cyan-600 px-1.5 py-0.5 rounded font-bold">
                  <Clock className="w-3 h-3" /> 시간연장
                </span>
              )}
            </div>
          </div>

          {/* 4-Choice Answers Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2">
            {currentQuestion?.options.map((option, idx) => (
              <button
                key={`${currentQuestion.id}_opt_${idx}`}
                disabled={isAnsweringLocked || isPaused || isCampfireOpen}
                onClick={() => handleAnswer(option)}
                className={`retro-btn py-3 sm:py-3.5 px-3 text-center font-black text-xl sm:text-2xl transition-all ${
                  isAnsweringLocked || isPaused || isCampfireOpen
                    ? 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed opacity-80'
                    : 'bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 text-white border-stone-600 active:translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-mono bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-center font-mono">{option}</span>
                  <span className="w-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Item Quick Slot Bar */}
          <div className="bg-stone-950/85 border border-stone-800 p-2 rounded">
            <div className="text-[10px] text-amber-300 font-bold mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" /> 긴급 아이템 (클릭 or Z, X, C, V)
              </span>
              <span className="text-stone-400 text-[9px]">Space: 일시정지 & 전술창</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { type: 'POTION' as ItemType, keyHint: 'Z' },
                { type: 'SWORD' as ItemType, keyHint: 'X' },
                { type: 'HOURGLASS' as ItemType, keyHint: 'C' },
                { type: 'SHIELD' as ItemType, keyHint: 'V' }
              ].map(({ type, keyHint }) => {
                const item = inventory[type];
                const isUsable = item.count > 0 && !isAnsweringLocked && !isCampfireOpen;
                return (
                  <button
                    key={type}
                    disabled={!isUsable}
                    onClick={() => handleUseItem(type)}
                    className={`retro-btn p-1.5 flex flex-col items-center justify-center text-center rounded transition-all ${
                      isUsable
                        ? 'bg-stone-900 hover:bg-stone-800 border-stone-700 cursor-pointer active:scale-95'
                        : 'bg-stone-950/60 opacity-40 border-stone-900 cursor-not-allowed'
                    }`}
                    title={`${item.name}: ${item.description} (단축키: ${keyHint})`}
                  >
                    <div className="flex items-center gap-1">
                      <ItemSprite type={type} className="w-5 h-5" />
                      <span className="text-xs font-black text-amber-300 font-mono">
                        x{item.count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full mt-0.5 px-0.5">
                      <span className="text-[9px] font-bold text-stone-300 truncate">
                        {item.name}
                      </span>
                      <span className="text-[8px] font-mono text-cyan-300 bg-cyan-950 px-1 rounded border border-cyan-800">
                        {keyHint}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
