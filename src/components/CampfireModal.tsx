import React from 'react';
import { MonsterConfig, InventoryItem, ItemType } from '../types/game';
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
  ItemSprite,
  TreasureChestSprite
} from './PixelSprites';
import { soundManager } from '../utils/sound';
import { Heart, Sparkles, ChevronRight, Shield, Zap } from 'lucide-react';

interface CampfireModalProps {
  clearedStage: number;
  nextMonster: MonsterConfig;
  heroHp: number;
  maxHeroHp: number;
  inventory: Record<ItemType, InventoryItem>;
  droppedItem: InventoryItem | null;
  onUseItem: (type: ItemType) => void;
  onStartNextStage: () => void;
  isShieldActive: boolean;
  swordBuffTurns: number;
}

export const CampfireModal: React.FC<CampfireModalProps> = ({
  clearedStage,
  nextMonster,
  heroHp,
  maxHeroHp,
  inventory,
  droppedItem,
  onUseItem,
  onStartNextStage,
  isShieldActive,
  swordBuffTurns
}) => {
  const renderNextMonsterSprite = () => {
    switch (nextMonster.spriteId) {
      case 'hilla':
        return <HillaSprite className="w-18 h-18" />;
      case 'von_leon':
        return <VonLeonSprite className="w-20 h-20" />;
      case 'arkarium':
        return <ArkariumSprite className="w-18 h-18" />;
      case 'magnus':
        return <MagnusSprite className="w-20 h-20" />;
      case 'black_mage':
        return <BlackMageSprite className="w-22 h-22 animate-pulse" />;
      case 'slime':
        return <SlimeSprite className="w-16 h-16" />;
      case 'goblin':
        return <GoblinSprite className="w-16 h-16" />;
      case 'golem':
        return <GolemSprite className="w-16 h-16" />;
      case 'skeleton':
        return <SkeletonSprite className="w-16 h-16" />;
      case 'boss':
      default:
        return <BlackMageSprite className="w-22 h-22 animate-pulse" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 scanlines select-none">
      <div className="max-w-xl w-full retro-box p-5 relative border-amber-400">
        {/* Stage Cleared Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 bg-amber-500 text-stone-950 rounded">
              STAGE {clearedStage} 격파 완료!
            </span>
            <span className="text-stone-300 text-xs font-bold">평화로운 왕국 쉼터</span>
          </div>
          <span className="text-[11px] text-amber-400/90 font-mono">정비 & 준비 시간</span>
        </div>

        {/* Tiny Farm Pastoral Scenery Banner */}
        <div className="mb-3 p-2.5 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border border-emerald-600/50 rounded flex items-center justify-between overflow-hidden relative">
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded border border-emerald-700/50">
              <img
                src="/assets/tiny-farm/Tiles/tile_0122.png"
                alt="Chicken"
                className="w-6 h-6 animate-bounce"
                style={{ imageRendering: 'pixelated' }}
              />
              <img
                src="/assets/tiny-farm/Tiles/tile_0120.png"
                alt="Sheep"
                className="w-6 h-6"
                style={{ imageRendering: 'pixelated' }}
              />
              <img
                src="/assets/tiny-farm/Tiles/tile_0121.png"
                alt="Cow"
                className="w-7 h-7"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-300">목장 친구들의 응원</div>
              <div className="text-[10px] text-stone-300">
                "신선한 기운을 받아 체력을 채우고 다음 전투를 준비하세요!"
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 opacity-90">
            <img src="/assets/tiny-farm/Tiles/tile_0083.png" alt="Sunflower" className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
            <img src="/assets/tiny-farm/Tiles/tile_0096.png" alt="Hay" className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
            <img src="/assets/tiny-farm/Tiles/tile_0085.png" alt="Barrel" className="w-6 h-6" style={{ imageRendering: 'pixelated' }} />
          </div>
        </div>

        {/* Dropped Loot Box */}
        {droppedItem && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-500/60 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TreasureChestSprite className="w-10 h-10 shrink-0" />
              <div>
                <div className="text-[11px] text-amber-300 font-bold">전리품 상자 획득!</div>
                <div className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                  <ItemSprite type={droppedItem.id} className="w-5 h-5" />
                  <span>{droppedItem.name} +1개 추가</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-900/50 px-2 py-1 rounded border border-amber-700">
              가방에 보관됨
            </span>
          </div>
        )}

        {/* Camp Area: Hero Status & Preparation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Hero Condition Box */}
          <div className="bg-stone-900/90 border border-stone-700 p-3 rounded flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-400 flex items-center justify-between mb-1">
                <span>용사의 현재 상태</span>
                <span className="text-stone-300 font-mono text-[11px]">HP {heroHp}/{maxHeroHp}</span>
              </div>

              {/* HP Bar */}
              <div className="w-full bg-stone-950 border border-stone-700 h-2.5 rounded overflow-hidden p-0.5 mb-2">
                <div
                  className={`h-full transition-all duration-200 ${
                    heroHp > 50 ? 'bg-emerald-500' : heroHp > 25 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${(heroHp / maxHeroHp) * 100}%` }}
                />
              </div>

              {/* Active Buffs */}
              <div className="flex items-center gap-1 text-[10px] min-h-[18px]">
                {isShieldActive && (
                  <span className="text-blue-300 flex items-center gap-0.5 bg-blue-950 px-1 py-0.5 rounded border border-blue-800">
                    <Shield className="w-2.5 h-2.5" /> 방패 장착중
                  </span>
                )}
                {swordBuffTurns > 0 && (
                  <span className="text-amber-300 flex items-center gap-0.5 bg-amber-950 px-1 py-0.5 rounded border border-amber-800">
                    <Zap className="w-2.5 h-2.5" /> 크리티컬({swordBuffTurns})
                  </span>
                )}
                {!isShieldActive && swordBuffTurns === 0 && (
                  <span className="text-stone-500">적용 중인 추가 버프 없음</span>
                )}
              </div>
            </div>

            <div className="flex justify-center my-1">
              <HeroSprite className="w-16 h-16" />
            </div>
          </div>

          {/* Next Monster Scouting Box */}
          <div className="bg-stone-900/90 border border-stone-700 p-3 rounded flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-red-400 flex items-center justify-between mb-1">
                <span>다음 목표 몬스터</span>
                <span className="text-amber-400 text-[10px] font-bold">STAGE {nextMonster.stage}</span>
              </div>
              <div className="text-sm font-black text-white">{nextMonster.name}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">
                체력: <span className="text-stone-200 font-mono font-bold">{nextMonster.maxHp} HP</span> · 기본 공격력: <span className="text-red-400 font-mono font-bold">{nextMonster.baseAttack}</span>
              </div>
              <div className="text-[10px] text-amber-200/80 italic mt-0.5 line-clamp-1">
                "{nextMonster.dialogueOnAppear}"
              </div>
              {/* Skills preview */}
              <div className="mt-1.5 pt-1.5 border-t border-stone-800">
                <div className="text-[9px] text-amber-400 font-bold mb-1">보유 스킬 예고:</div>
                <div className="flex flex-wrap gap-1">
                  {nextMonster.skills.map((sk) => (
                    <span
                      key={sk.id}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        sk.danger === 'ULTIMATE'
                          ? 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
                          : sk.danger === 'STRONG'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}
                    >
                      {sk.name} ({sk.timeLimit}s)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center my-1">
              {renderNextMonsterSprite()}
            </div>
          </div>
        </div>

        {/* Campfire Inventory & Strategic Use */}
        <div className="bg-stone-900/90 border border-stone-700 p-3 rounded mb-4">
          <div className="text-[11px] text-amber-300 font-bold mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-400" /> 전투 전 가방 열기 (클릭하여 미리 사용)
            </span>
            <span className="text-[10px] text-stone-400">포션으로 체력을 채우고 다음 방에 입장하세요!</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(inventory) as ItemType[]).map((type) => {
              const item = inventory[type];
              const isUsable = item.count > 0;
              return (
                <button
                  key={type}
                  disabled={!isUsable}
                  onClick={() => onUseItem(type)}
                  className={`retro-btn p-2 flex flex-col items-center justify-center text-center rounded transition-all ${
                    isUsable
                      ? 'bg-stone-800 hover:bg-stone-700 border-stone-600 active:scale-95'
                      : 'bg-stone-950/50 opacity-40 border-stone-800 cursor-not-allowed'
                  }`}
                  title={`${item.name}: ${item.description}`}
                >
                  <div className="flex items-center gap-1">
                    <ItemSprite type={type} className="w-5 h-5" />
                    <span className="text-xs font-black text-amber-300 font-mono">x{item.count}</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-200 mt-1 truncate w-full text-center">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-medium">
                    {type === 'POTION' ? '사용하기' : '장착하기'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Next Stage Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onStartNextStage();
          }}
          className="w-full retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-base sm:text-lg py-3.5 flex items-center justify-center gap-2 border-amber-300 shadow-[0_4px_0_#78350f]"
        >
          <Sparkles className="w-5 h-5 text-stone-950" />
          <span>다음 몬스터에게 돌격! (전투 시작)</span>
          <ChevronRight className="w-5 h-5 text-stone-950" />
        </button>

        <p className="text-center text-[10px] text-stone-400 mt-2 font-mono">
          [Spacebar] 키를 눌러도 다음 스테이지를 시작할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
