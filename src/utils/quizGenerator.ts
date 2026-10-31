import { QuizQuestion, GameMode, MonsterConfig, MonsterSkill } from '../types/game';

// 5 MapleStory Commanders & Black Mage Stages Configuration
export const MONSTERS: MonsterConfig[] = [
  {
    stage: 1,
    name: '군단장 힐라 (Hilla)',
    title: 'Stage 1: 아스완의 고대 지하 도시',
    maxHp: 80,
    baseAttack: 16,
    spriteId: 'hilla',
    color: '#e11d48',
    dialogueOnAppear: '오호호, 풋내기 용사여! 네 영혼을 내게 바칠 준비는 되었겠지?',
    skills: [
      {
        id: 'hilla_soul',
        name: '사령 소환 강타',
        danger: 'NORMAL',
        timeLimit: 6.5,
        damage: 16,
        description: '아스완의 망령들을 불러내 돌진시킵니다!',
        particleColor: '#f43f5e'
      },
      {
        id: 'hilla_drain',
        name: '흡혈의 붉은 결계',
        danger: 'STRONG',
        timeLimit: 4.5,
        damage: 24,
        description: '붉은 마법진으로 용사의 생명력을 흡수합니다!',
        particleColor: '#be123c'
      }
    ]
  },
  {
    stage: 2,
    name: '사자왕 반 레온 (Von Leon)',
    title: 'Stage 2: 눈보라 치는 사자왕의 성',
    maxHp: 120,
    baseAttack: 22,
    spriteId: 'von_leon',
    color: '#0284c7',
    dialogueOnAppear: '내 슬픔과 분노가 담긴 얼어붙은 대검을 받아보아라...!',
    skills: [
      {
        id: 'leon_claw',
        name: '사자왕의 발톱',
        danger: 'NORMAL',
        timeLimit: 5.5,
        damage: 22,
        description: '냉기를 두른 거대한 사자 발톱으로 찢어발깁니다!',
        particleColor: '#38bdf8'
      },
      {
        id: 'leon_blizzard',
        name: '엘나스의 극한 눈보라',
        danger: 'STRONG',
        timeLimit: 3.8,
        damage: 30,
        description: '모든 것을 얼려버리는 혹한의 빙결 폭풍!',
        particleColor: '#0284c7'
      },
      {
        id: 'leon_cleave',
        name: '사자왕의 단죄참',
        danger: 'ULTIMATE',
        timeLimit: 2.8,
        damage: 40,
        description: '왕의 거대한 대검으로 대지를 양단하는 참격!',
        particleColor: '#0369a1'
      }
    ]
  },
  {
    stage: 3,
    name: '군단장 아카이럼 (Arkarium)',
    title: 'Stage 3: 왜곡된 시간의 신전',
    maxHp: 170,
    baseAttack: 26,
    spriteId: 'arkarium',
    color: '#9333ea',
    dialogueOnAppear: '크큭... 시간의 섭리를 거스르는 자는 영원히 소멸할 뿐이다!',
    skills: [
      {
        id: 'ark_stone',
        name: '석화의 저주 마안',
        danger: 'NORMAL',
        timeLimit: 5.0,
        damage: 26,
        description: '사악한 지팡이의 빛으로 용사를 굳혀버립니다!',
        particleColor: '#a855f7'
      },
      {
        id: 'ark_snake',
        name: '맹독 독사 소환',
        danger: 'STRONG',
        timeLimit: 3.5,
        damage: 35,
        description: '왜곡된 시간에서 독사들을 풀어 맹공을 가합니다!',
        particleColor: '#7e22ce'
      },
      {
        id: 'ark_screen_break',
        name: '모니터 브레이크 파멸진',
        danger: 'ULTIMATE',
        timeLimit: 2.5,
        damage: 48,
        description: '시간 공간을 산산조각 내는 즉사급 파멸 마법!',
        particleColor: '#581c87'
      }
    ]
  },
  {
    stage: 4,
    name: '폭군 매그너스 (Magnus)',
    title: 'Stage 4: 헬리시움 폭군의 제단',
    maxHp: 220,
    baseAttack: 32,
    spriteId: 'magnus',
    color: '#15803d',
    dialogueOnAppear: '강한 자만이 살아남는 법! 내 검 끝에서 사라져라!',
    skills: [
      {
        id: 'mag_whirlwind',
        name: '폭군의 칼바람 휠윈드',
        danger: 'NORMAL',
        timeLimit: 4.5,
        damage: 32,
        description: '회전하며 용사에게 무자비한 검격을 퍼붓습니다!',
        particleColor: '#22c55e'
      },
      {
        id: 'mag_meteor',
        name: '분쇄 초록 운석 강타',
        danger: 'STRONG',
        timeLimit: 3.2,
        damage: 42,
        description: '하늘에서 맹렬한 녹색 운석들을 낙하시킵니다!',
        particleColor: '#16a34a'
      },
      {
        id: 'mag_execute',
        name: '헬리시움 멸살의 칼날',
        danger: 'ULTIMATE',
        timeLimit: 2.3,
        damage: 58,
        description: '피할 수 없는 폭군의 잔혹한 일격필살!',
        particleColor: '#14532d'
      }
    ]
  },
  {
    stage: 5,
    name: '검은 마법사 (The Black Mage)',
    title: 'Final Stage: 리멘 어둠의 옥좌',
    maxHp: 340,
    baseAttack: 40,
    spriteId: 'black_mage',
    color: '#000000',
    dialogueOnAppear: '필멸자여... 마침내 여기까지 도달했군. 창조와 파괴의 순리를 보여주마!',
    skills: [
      {
        id: 'bm_chain',
        name: '창조와 파괴의 사슬',
        danger: 'NORMAL',
        timeLimit: 4.0,
        damage: 38,
        description: '허공에서 검은 사슬을 소환하여 영혼을 옭아맵니다!',
        particleColor: '#ef4444'
      },
      {
        id: 'bm_laser',
        name: '사선 권능 파멸광선',
        danger: 'STRONG',
        timeLimit: 2.8,
        damage: 50,
        description: '세계를 가르는 파괴의 붉은 레이저가 쏟아집니다!',
        particleColor: '#dc2626'
      },
      {
        id: 'bm_morningstar',
        name: '모닝스타 폴 묵시록',
        danger: 'ULTIMATE',
        timeLimit: 2.0,
        damage: 75,
        description: '모든 존재를 무(無)로 되돌리는 초월자의 궁극 권능!',
        particleColor: '#7f1d1d'
      }
    ]
  }
];

// Pick a skill intelligently (weighted random, boss occasionally unleashes ultimate)
function pickMonsterSkill(monster: MonsterConfig): MonsterSkill {
  const skills = monster.skills;
  if (skills.length === 1) return skills[0];

  const rand = Math.random();
  if (skills.length === 2) {
    return rand < 0.6 ? skills[0] : skills[1];
  }

  const isBoss = monster.stage === 5;
  if (isBoss) {
    if (rand < 0.4) return skills[0];
    if (rand < 0.75) return skills[1];
    return skills[2];
  } else {
    if (rand < 0.5) return skills[0];
    if (rand < 0.82) return skills[1];
    return skills[2];
  }
}

// Generate intelligent 4-choice question bound to monster's active skill
export function generateQuestion(
  mode: GameMode,
  selectedDan: number | undefined,
  timeMultiplier: number = 1.0,
  stageIndex: number = 0
): QuizQuestion {
  let dan: number;
  if (mode === 'NORMAL' && selectedDan && selectedDan >= 2 && selectedDan <= 9) {
    dan = selectedDan;
  } else {
    dan = Math.floor(Math.random() * 8) + 2;
  }

  const multiplier = Math.floor(Math.random() * 9) + 1;
  const correctAnswer = dan * multiplier;

  const currentMonster = MONSTERS[Math.min(stageIndex, MONSTERS.length - 1)];
  const skill = pickMonsterSkill(currentMonster);

  const distractors = new Set<number>();
  const candidates: number[] = [
    dan * (multiplier - 1),
    dan * (multiplier + 1),
    (dan + 1) * multiplier,
    (dan - 1) * multiplier,
    correctAnswer + 10,
    correctAnswer - 10,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 4,
    correctAnswer - 4,
    correctAnswer >= 12 && correctAnswer <= 98 ? parseInt(correctAnswer.toString().split('').reverse().join(''), 10) : correctAnswer + 6,
  ];

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (const cand of candidates) {
    if (cand > 0 && cand !== correctAnswer && !distractors.has(cand)) {
      distractors.add(cand);
    }
    if (distractors.size >= 3) break;
  }

  let offset = 1;
  while (distractors.size < 3) {
    const fallbackVal = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    if (fallbackVal > 0 && fallbackVal !== correctAnswer && !distractors.has(fallbackVal)) {
      distractors.add(fallbackVal);
    }
    offset++;
  }

  const options = Array.from(distractors).slice(0, 3);
  options.push(correctAnswer);

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const timeLimit = Math.max(1.8, skill.timeLimit * timeMultiplier);

  return {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dan,
    multiplier,
    correctAnswer,
    options,
    timeLimit,
    skill
  };
}

export interface CounterEvaluation {
  rating: 'PERFECT_PARRY' | 'GUARD_COUNTER';
  heroDamageDealt: number;
  feedbackText: string;
}

export function evaluateCounterDamage(
  elapsedSeconds: number,
  skillDanger: 'NORMAL' | 'STRONG' | 'ULTIMATE',
  isGuaranteedCritical: boolean = false
): CounterEvaluation {
  const baseHeroAttack = 35;
  const isPerfect = isGuaranteedCritical || elapsedSeconds <= 1.4;

  if (isPerfect) {
    const bonus = skillDanger === 'ULTIMATE' ? 2.5 : skillDanger === 'STRONG' ? 2.2 : 2.0;
    const heroDamageDealt = Math.round(baseHeroAttack * bonus);
    return {
      rating: 'PERFECT_PARRY',
      heroDamageDealt,
      feedbackText: '⚡ PERFECT PARRY!! 완벽한 쳐내기 후 치명적 카운터!'
    };
  } else {
    const heroDamageDealt = Math.round(baseHeroAttack * 1.2);
    return {
      rating: 'GUARD_COUNTER',
      heroDamageDealt,
      feedbackText: '🛡️ GUARD SUCCESS! 공격 방어 성공 및 반격!'
    };
  }
}
