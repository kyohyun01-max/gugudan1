import React from 'react';

interface BattleBackgroundProps {
  stage: number;
}

export const BattleBackground: React.FC<BattleBackgroundProps> = ({ stage }) => {
  switch (stage) {
    case 1:
      // Stage 1: Ancient Aswan (군단장 힐라 - 붉은 사막과 아스완 궁전)
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Crimson Sunset Desert Sky */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#881337] via-[#be123c] to-[#fb7185]">
            <div className="absolute top-4 right-10 w-16 h-16 bg-[#ffe4e6] rounded-full opacity-60 shadow-[0_0_25px_#f43f5e]" />
            <div className="absolute top-12 left-10 w-24 h-5 bg-white/40" />
            <div className="absolute top-16 right-1/4 w-32 h-6 bg-white/30" />
          </div>

          {/* Distant Aswan Palace Pillars & Desert Dunes */}
          <div className="absolute inset-x-0 top-[38%] flex items-end justify-around px-4 opacity-90">
            {[...Array(6)].map((_, i) => (
              <div key={`pillar_${i}`} className="w-8 h-20 bg-[#9f1239] border-t-2 border-[#f43f5e] relative">
                <div className="absolute -top-2 -inset-x-1 h-2 bg-[#fbbf24]" />
              </div>
            ))}
          </div>

          {/* Golden Red Sand Arena Ground with Kenney Tiles */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#fbbf24] border-t-4 border-[#d97706]">
            {/* Sand Path */}
            <div className="absolute top-4 inset-x-0 h-8 flex items-center justify-around opacity-90">
              {[...Array(12)].map((_, i) => (
                <img
                  key={`sand_tile_${i}`}
                  src="/assets/tiny-farm/Tiles/tile_0000.png"
                  alt=""
                  className="w-10 h-10 image-pixelated shrink-0 sepia"
                  style={{ imageRendering: 'pixelated' }}
                />
              ))}
            </div>

            {/* Aswan Desert Props: Kenney Stones & Pots */}
            <div className="absolute top-2 left-6 flex items-center gap-2">
              <img
                src="/assets/tiny-farm/Tiles/tile_0089.png"
                alt="Stone"
                className="w-6 h-6 image-pixelated"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="absolute top-10 right-8 flex items-center gap-2">
              <img
                src="/assets/tiny-farm/Tiles/tile_0085.png"
                alt="Pot"
                className="w-6 h-6 image-pixelated"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      );

    case 2:
      // Stage 2: Von Leon's Castle (사자왕 반 레온 - 혹한의 엘나스 눈보라)
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Freezing Blizzard Sky */}
          <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#082f49] via-[#0369a1] to-[#38bdf8]">
            {/* Blizzard snowflakes */}
            <div className="absolute top-6 left-12 w-2 h-2 bg-white animate-ping" />
            <div className="absolute top-16 left-1/3 w-3 h-3 bg-white/80 animate-pulse" />
            <div className="absolute top-10 right-20 w-2 h-2 bg-white animate-ping" />
            <div className="absolute top-24 right-1/3 w-2.5 h-2.5 bg-white/90 animate-pulse" />

            {/* Distant Castle Spires in Blizzard */}
            <div className="absolute bottom-0 left-6 w-14 h-36 bg-[#0f172a] border-t-2 border-[#38bdf8]" />
            <div className="absolute bottom-0 right-10 w-16 h-44 bg-[#0f172a] border-t-2 border-[#38bdf8]" />
          </div>

          {/* Frozen Ice Castle Floor */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[#0f172a] border-t-4 border-[#38bdf8]">
            <div className="absolute top-2 inset-x-6 h-1 bg-[#38bdf8]/40 shadow-[0_0_8px_#38bdf8]" />
            <div className="absolute top-8 inset-x-6 h-1 bg-[#38bdf8]/30" />
            <div className="absolute top-4 left-10">
              <img
                src="/assets/tiny-farm/Tiles/tile_0089.png"
                alt="Ice stone"
                className="w-7 h-7 image-pixelated brightness-150 hue-rotate-180"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      );

    case 3:
      // Stage 3: Temple of Time (군단장 아카이럼 - 왜곡된 시간의 신전)
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Time Warp Violet Sky */}
          <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#1e1b4b] via-[#3b0764] to-[#581c87]">
            {/* Time Distortion Hourglass Particles */}
            <div className="absolute top-6 left-1/4 w-3 h-3 bg-[#e879f9] animate-ping" />
            <div className="absolute top-14 right-1/4 w-2 h-2 bg-[#c084fc] animate-pulse" />

            {/* Ancient Temple Marble Columns */}
            <div className="absolute bottom-0 left-8 w-10 h-36 bg-[#2e1065] border-t border-[#a855f7]" />
            <div className="absolute bottom-0 right-8 w-10 h-36 bg-[#2e1065] border-t border-[#a855f7]" />
          </div>

          {/* Temple of Time Floor */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[#2e1065] border-t-4 border-[#a855f7]">
            <div className="absolute top-3 inset-x-6 h-1 bg-[#c084fc]/50 shadow-[0_0_10px_#a855f7]" />
            <div className="absolute top-10 inset-x-6 h-1 bg-[#c084fc]/30" />
          </div>
        </div>
      );

    case 4:
      // Stage 4: Heliseum Altar (폭군 매그너스 - 헬리시움 폭군의 제단)
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Green Poisonous Tyrant Zone Sky */}
          <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#052e16] via-[#14532d] to-[#15803d]">
            {/* Magnus Green Meteor Streaks */}
            <div className="absolute top-4 left-1/4 w-2 h-14 bg-[#4ade80] -rotate-45 shadow-[0_0_12px_#22c55e] animate-pulse" />
            <div className="absolute top-8 right-1/4 w-2.5 h-16 bg-[#86efac] -rotate-45 shadow-[0_0_12px_#22c55e] animate-pulse" />

            {/* Tyrant Altar Spires */}
            <div className="absolute bottom-0 left-6 w-12 h-32 bg-[#022c22] border-t-2 border-[#22c55e]" />
            <div className="absolute bottom-0 right-6 w-12 h-32 bg-[#022c22] border-t-2 border-[#22c55e]" />
          </div>

          {/* Magnus Zone Altar Ground */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[#022c22] border-t-4 border-[#22c55e]">
            {/* Blue and Green Barrier Lines */}
            <div className="absolute top-2 inset-x-4 h-1 bg-[#22c55e] shadow-[0_0_10px_#22c55e]" />
            <div className="absolute top-8 inset-x-4 h-1 bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />
          </div>
        </div>
      );

    case 5:
    default:
      // Stage 5: Limen Dark Throne (검은 마법사 - 리멘 어둠의 옥좌)
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Apocalyptic Red & Black Void */}
          <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#000000] via-[#18181b] to-[#450a0a]">
            {/* The Giant Eye of the Black Mage / Eclipse */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-black border-4 border-red-600 shadow-[0_0_40px_rgba(239,68,68,0.9)] animate-pulse" />
            
            {/* Red Lightning Spikes */}
            <div className="absolute top-6 left-8 w-1 h-20 bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping" />
            <div className="absolute top-10 right-10 w-1.5 h-24 bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping" />

            {/* Dark Chains hanging from the void */}
            <div className="absolute top-0 left-16 w-1 h-36 bg-red-950 border-r border-red-700" />
            <div className="absolute top-0 right-16 w-1 h-36 bg-red-950 border-l border-red-700" />
          </div>

          {/* Limen Abyss Floor */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[#09090b] border-t-4 border-[#dc2626]">
            {/* Red Energy Runes */}
            <div className="absolute top-3 left-10 w-32 h-2 bg-[#ef4444] shadow-[0_0_12px_#ef4444] animate-pulse" />
            <div className="absolute top-8 right-12 w-40 h-2 bg-[#b91c1c] shadow-[0_0_12px_#ef4444] animate-pulse" />
          </div>
        </div>
      );
  }
};
