import React from 'react';

// Hero Sprite
export const HeroSprite: React.FC<{
  action?: 'idle' | 'attack' | 'hit';
  className?: string;
}> = ({ action = 'idle', className = 'w-24 h-24' }) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'attack' ? 'translate-x-6 scale-110' : ''} ${action === 'hit' ? 'opacity-60 -translate-x-4 brightness-150' : ''} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Shadow */}
        <ellipse cx="16" cy="30" rx="9" ry="2" fill="#000000" opacity="0.4" />
        
        {/* Cape */}
        <rect x="7" y="14" width="4" height="12" fill="#dc2626" />
        <rect x="6" y="16" width="3" height="9" fill="#991b1b" />

        {/* Boots */}
        <rect x="11" y="26" width="4" height="4" fill="#78350f" />
        <rect x="17" y="26" width="4" height="4" fill="#78350f" />

        {/* Legs */}
        <rect x="12" y="23" width="3" height="3" fill="#1e3a8a" />
        <rect x="17" y="23" width="3" height="3" fill="#1e3a8a" />

        {/* Body / Tunic */}
        <rect x="11" y="14" width="10" height="9" fill="#2563eb" />
        {/* Belt */}
        <rect x="11" y="19" width="10" height="2" fill="#451a03" />
        <rect x="15" y="19" width="2" height="2" fill="#fbbf24" />

        {/* Head */}
        <rect x="12" y="6" width="8" height="8" fill="#fed7aa" />
        {/* Eyes */}
        <rect x="17" y="9" width="2" height="2" fill="#0f172a" />
        
        {/* Golden Hair */}
        <rect x="11" y="4" width="10" height="4" fill="#f59e0b" />
        <rect x="10" y="6" width="3" height="5" fill="#f59e0b" />
        <rect x="13" y="3" width="6" height="2" fill="#fbbf24" />
        <rect x="20" y="6" width="2" height="3" fill="#d97706" />

        {/* Shield (Left arm) */}
        <rect x="8" y="14" width="4" height="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.5" />
        <rect x="9" y="16" width="2" height="4" fill="#fbbf24" />

        {/* Sword (Right hand) */}
        <g className={action === 'attack' ? 'origin-bottom -rotate-45' : ''}>
          <rect x="21" y="16" width="3" height="3" fill="#fed7aa" />
          <rect x="23" y="17" width="2" height="1" fill="#78350f" />
          <rect x="22" y="15" width="4" height="2" fill="#d4af37" />
          <rect x="23" y="6" width="2" height="9" fill="#e2e8f0" />
          <rect x="24" y="5" width="1" height="2" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};

// King Sprite (Story intro)
export const KingSprite: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        {/* Shadow */}
        <ellipse cx="16" cy="30" rx="10" ry="2" fill="#000000" opacity="0.4" />
        
        {/* Royal Robe */}
        <rect x="9" y="13" width="14" height="16" fill="#7c2d12" />
        <rect x="13" y="13" width="6" height="16" fill="#fef08a" />
        <rect x="8" y="15" width="3" height="14" fill="#991b1b" />
        <rect x="21" y="15" width="3" height="14" fill="#991b1b" />
        
        {/* Ermine Collar */}
        <rect x="9" y="12" width="14" height="3" fill="#f8fafc" />
        <rect x="11" y="13" width="1" height="1" fill="#0f172a" />
        <rect x="15" y="13" width="1" height="1" fill="#0f172a" />
        <rect x="19" y="13" width="1" height="1" fill="#0f172a" />

        {/* Head */}
        <rect x="12" y="6" width="8" height="7" fill="#fcd34d" />
        {/* Beard */}
        <rect x="11" y="10" width="10" height="5" fill="#f8fafc" />
        <rect x="13" y="15" width="6" height="3" fill="#e2e8f0" />
        {/* Eyes */}
        <rect x="14" y="8" width="1" height="2" fill="#0f172a" />
        <rect x="17" y="8" width="1" height="2" fill="#0f172a" />

        {/* Golden Crown */}
        <rect x="11" y="3" width="10" height="4" fill="#fbbf24" />
        <polygon points="11,3 13,0 15,3 16,0 17,3 19,0 21,3" fill="#f59e0b" />
        <rect x="13" y="4" width="2" height="1" fill="#ef4444" />
        <rect x="17" y="4" width="2" height="1" fill="#3b82f6" />

        {/* Scepter */}
        <rect x="23" y="10" width="2" height="18" fill="#d97706" />
        <circle cx="24" cy="9" r="2.5" fill="#38bdf8" />
      </svg>
    </div>
  );
};

// Slime Sprite (Stage 1)
export const SlimeSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-24 h-24'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 scale-90' : 'animate-bounce'} ${className}`} style={{ animationDuration: '1.4s' }}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="29" rx="10" ry="2" fill="#000" opacity="0.3" />
        {/* Gelatin body */}
        <rect x="10" y="14" width="12" height="14" fill="#22c55e" rx="4" />
        <rect x="8" y="18" width="16" height="10" fill="#16a34a" />
        <rect x="12" y="10" width="8" height="6" fill="#4ade80" />
        <rect x="15" y="8" width="2" height="3" fill="#86efac" />
        {/* Eyes */}
        <rect x="11" y="18" width="3" height="3" fill="#0f172a" />
        <rect x="18" y="18" width="3" height="3" fill="#0f172a" />
        <rect x="12" y="18" width="1" height="1" fill="#ffffff" />
        <rect x="19" y="18" width="1" height="1" fill="#ffffff" />
        {/* Cute blush */}
        <rect x="9" y="22" width="2" height="1" fill="#f43f5e" />
        <rect x="21" y="22" width="2" height="1" fill="#f43f5e" />
      </svg>
    </div>
  );
};

// Goblin Sprite (Stage 2)
export const GoblinSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-24 h-24'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 -translate-x-2' : ''} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="29" rx="8" ry="2" fill="#000" opacity="0.3" />
        {/* Body */}
        <rect x="12" y="16" width="8" height="9" fill="#84cc16" />
        {/* Loincloth */}
        <rect x="11" y="21" width="10" height="5" fill="#713f12" />
        {/* Legs */}
        <rect x="12" y="25" width="3" height="4" fill="#65a30d" />
        <rect x="17" y="25" width="3" height="4" fill="#65a30d" />
        {/* Head */}
        <rect x="11" y="8" width="10" height="8" fill="#84cc16" />
        {/* Pointy Ears */}
        <polygon points="11,10 6,8 11,13" fill="#65a30d" />
        <polygon points="21,10 26,8 21,13" fill="#65a30d" />
        {/* Eyes (red glowing sly eyes) */}
        <rect x="13" y="11" width="2" height="2" fill="#dc2626" />
        <rect x="17" y="11" width="2" height="2" fill="#dc2626" />
        {/* Fangs */}
        <rect x="14" y="14" width="1" height="2" fill="#f8fafc" />
        <rect x="17" y="14" width="1" height="2" fill="#f8fafc" />
        {/* Club weapon */}
        <rect x="22" y="11" width="3" height="12" fill="#92400e" rx="1" />
        <circle cx="23.5" cy="11.5" r="3" fill="#78350f" />
      </svg>
    </div>
  );
};

// Rock Golem Sprite (Stage 3)
export const GolemSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-24 h-24'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 scale-95' : ''} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="11" ry="2" fill="#000" opacity="0.4" />
        {/* Stone Body */}
        <rect x="9" y="12" width="14" height="12" fill="#78716c" />
        <rect x="8" y="14" width="16" height="8" fill="#57534e" />
        {/* Moss patches */}
        <rect x="10" y="13" width="3" height="2" fill="#65a30d" />
        <rect x="18" y="17" width="2" height="3" fill="#65a30d" />
        {/* Massive Arms */}
        <rect x="4" y="14" width="5" height="11" fill="#44403c" />
        <rect x="23" y="14" width="5" height="11" fill="#44403c" />
        {/* Legs */}
        <rect x="10" y="24" width="5" height="6" fill="#44403c" />
        <rect x="17" y="24" width="5" height="6" fill="#44403c" />
        {/* Head */}
        <rect x="11" y="6" width="10" height="7" fill="#78716c" />
        <rect x="12" y="5" width="8" height="2" fill="#a8a29e" />
        {/* Glowing Blue Core Eyes */}
        <rect x="13" y="9" width="2" height="2" fill="#38bdf8" />
        <rect x="17" y="9" width="2" height="2" fill="#38bdf8" />
      </svg>
    </div>
  );
};

// Skeleton Knight Sprite (Stage 4)
export const SkeletonSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-24 h-24'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 -translate-x-3' : ''} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="29" rx="9" ry="2" fill="#000" opacity="0.3" />
        {/* Dark Armor */}
        <rect x="11" y="13" width="10" height="9" fill="#334155" />
        {/* Ribs / Bone */}
        <rect x="13" y="15" width="6" height="2" fill="#e2e8f0" />
        <rect x="14" y="18" width="4" height="2" fill="#e2e8f0" />
        {/* Legs */}
        <rect x="12" y="22" width="2" height="7" fill="#cbd5e1" />
        <rect x="18" y="22" width="2" height="7" fill="#cbd5e1" />
        {/* Skull Head */}
        <rect x="12" y="6" width="8" height="7" fill="#f8fafc" />
        {/* Dark Eye sockets */}
        <rect x="13" y="8" width="2" height="2" fill="#475569" />
        <rect x="17" y="8" width="2" height="2" fill="#475569" />
        {/* Teeth */}
        <rect x="14" y="11" width="1" height="2" fill="#0f172a" />
        <rect x="16" y="11" width="1" height="2" fill="#0f172a" />
        {/* Dark Knight Helmet Crest */}
        <polygon points="12,6 16,1 20,6" fill="#1e293b" />
        {/* Purple cursed blade */}
        <rect x="23" y="8" width="2" height="15" fill="#a855f7" />
        <rect x="22" y="21" width="4" height="2" fill="#64748b" />
      </svg>
    </div>
  );
};

// Demon King Boss Sprite (Stage 5 fallback)
export const BossSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-28 h-28'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-200 scale-90' : 'animate-pulse'} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="13" ry="2" fill="#000" opacity="0.5" />
        <polygon points="10,12 1,4 4,18 10,20" fill="#991b1b" />
        <polygon points="22,12 31,4 28,18 22,20" fill="#991b1b" />
        <rect x="9" y="13" width="14" height="12" fill="#1e1b4b" />
        <rect x="11" y="15" width="10" height="9" fill="#312e81" />
        <rect x="14" y="17" width="4" height="4" fill="#ef4444" />
        <rect x="10" y="25" width="4" height="5" fill="#18181b" />
        <rect x="18" y="25" width="4" height="5" fill="#18181b" />
        <rect x="11" y="6" width="10" height="8" fill="#450a0a" />
        <polygon points="10,8 7,1 11,5" fill="#f59e0b" />
        <polygon points="22,8 25,1 21,5" fill="#f59e0b" />
        <rect x="13" y="8" width="2" height="2" fill="#fbbf24" />
        <rect x="17" y="8" width="2" height="2" fill="#fbbf24" />
        <polygon points="12,4 16,1 20,4 16,6" fill="#7f1d1d" />
        <rect x="23" y="12" width="3" height="16" fill="#ef4444" />
        <rect x="24" y="8" width="1" height="5" fill="#fef08a" />
      </svg>
    </div>
  );
};

// ================= MAPLESTORY COMMANDERS & BLACK MAGE SPRITES =================

// 1. 군단장 힐라 (Hilla) - 아스완의 무녀, 붉은 드레스, 백발, 사령의 붉은 지팡이
export const HillaSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-28 h-28'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 -translate-x-2' : 'animate-pulse'} ${className}`} style={{ animationDuration: '2s' }}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="9" ry="2" fill="#000" opacity="0.4" />
        {/* Red Gothic Robe / Dress */}
        <polygon points="11,14 7,29 25,29 21,14" fill="#9f1239" />
        <polygon points="13,14 10,29 22,29 19,14" fill="#e11d48" />
        <rect x="13" y="14" width="6" height="8" fill="#4c0519" />
        <rect x="15" y="15" width="2" height="6" fill="#f43f5e" />

        {/* Silver / White Long Flowing Hair */}
        <rect x="10" y="4" width="12" height="10" fill="#f1f5f9" />
        <rect x="8" y="7" width="3" height="16" fill="#e2e8f0" />
        <rect x="21" y="7" width="3" height="16" fill="#e2e8f0" />

        {/* Face */}
        <rect x="12" y="7" width="8" height="6" fill="#ffe4e6" />
        {/* Crimson Eyes & Seductive Makeup */}
        <rect x="13" y="9" width="2" height="1.5" fill="#be123c" />
        <rect x="17" y="9" width="2" height="1.5" fill="#be123c" />
        <rect x="15" y="11" width="2" height="1" fill="#e11d48" />

        {/* Golden Tiara / Crown */}
        <polygon points="11,4 16,1 21,4" fill="#fbbf24" />
        <circle cx="16" cy="3" r="1" fill="#ef4444" />

        {/* Necromancy Staff with Red Soul Gem */}
        <rect x="24" y="6" width="1.5" height="23" fill="#881337" />
        <circle cx="24.5" cy="5" r="3" fill="#f43f5e" className="animate-ping" style={{ animationDuration: '1.5s' }} />
        <circle cx="24.5" cy="5" r="2.5" fill="#fda4af" />
        <rect x="23.5" y="4" width="2" height="2" fill="#fff" />
      </svg>
    </div>
  );
};

// 2. 사자왕 반 레온 (Von Leon) - 설원의 사자왕, 푸른 왕관, 거대한 대검
export const VonLeonSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-32 h-32'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 scale-95' : ''} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="12" ry="2" fill="#000" opacity="0.4" />
        {/* Blue King Mantle & Fur Trim */}
        <polygon points="8,12 4,29 28,29 24,12" fill="#0c4a6e" />
        <rect x="6" y="11" width="20" height="4" fill="#e2e8f0" />
        <rect x="11" y="15" width="10" height="12" fill="#075985" />

        {/* Massive White/Grey Lion Mane */}
        <rect x="8" y="5" width="16" height="12" fill="#cbd5e1" rx="2" />
        <rect x="6" y="7" width="20" height="8" fill="#e2e8f0" />

        {/* Lion Face & Golden Eyes */}
        <rect x="12" y="8" width="8" height="7" fill="#94a3b8" />
        <rect x="13" y="10" width="2" height="2" fill="#fbbf24" />
        <rect x="17" y="10" width="2" height="2" fill="#fbbf24" />
        <polygon points="16,12 15,14 17,14" fill="#0f172a" />
        {/* Fangs */}
        <rect x="14" y="14" width="1" height="2" fill="#fff" />
        <rect x="17" y="14" width="1" height="2" fill="#fff" />

        {/* Frost Crown */}
        <polygon points="10,5 12,1 14,4 16,0 18,4 20,1 22,5" fill="#38bdf8" />
        <rect x="11" y="4" width="10" height="2" fill="#0284c7" />

        {/* Giant Greatsword */}
        <rect x="25" y="5" width="3" height="24" fill="#94a3b8" />
        <rect x="26" y="6" width="1" height="22" fill="#e0f2fe" />
        <rect x="23" y="18" width="7" height="2" fill="#0284c7" />
      </svg>
    </div>
  );
};

// 3. 군단장 아카이럼 (Arkarium) - 시간의 신관, 보라빛 로브, 뱀 지팡이
export const ArkariumSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-28 h-28'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 -translate-x-2' : ''} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="9" ry="2" fill="#000" opacity="0.4" />
        {/* Dark Purple Robe */}
        <polygon points="10,13 6,29 26,29 22,13" fill="#3b0764" />
        <polygon points="12,13 8,29 24,29 20,13" fill="#581c87" />
        <rect x="13" y="14" width="6" height="15" fill="#a855f7" />

        {/* Priest Hood & Shadowed Face */}
        <polygon points="10,6 16,1 22,6 21,13 11,13" fill="#2e1065" />
        <rect x="12" y="7" width="8" height="6" fill="#1e1b4b" />
        {/* Evil Glowing Yellow Eyes */}
        <rect x="13" y="9" width="2" height="1.5" fill="#facc15" />
        <rect x="17" y="9" width="2" height="1.5" fill="#facc15" />

        {/* Braided White Priest Beard */}
        <polygon points="13,12 16,21 19,12" fill="#f8fafc" />
        <rect x="15" y="18" width="2" height="2" fill="#c084fc" />

        {/* Serpent Caduceus Staff */}
        <rect x="24" y="4" width="2" height="25" fill="#ca8a04" />
        <polygon points="21,3 27,3 25,8 23,8" fill="#15803d" />
        <circle cx="25" cy="5" r="2.5" fill="#a855f7" />
      </svg>
    </div>
  );
};

// 4. 폭군 매그너스 (Magnus) - 노바의 배신자, 검은 날개, 붉은 뿔, 쌍검
export const MagnusSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-32 h-32'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-150 scale-95' : 'animate-pulse'} ${className}`} style={{ animationDuration: '2.5s' }}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="11" ry="2" fill="#000" opacity="0.4" />
        {/* Nova Dragon Wings */}
        <polygon points="10,12 1,5 3,20 9,18" fill="#14532d" />
        <polygon points="22,12 31,5 29,20 23,18" fill="#14532d" />
        <polygon points="9,13 3,8 5,18" fill="#22c55e" />
        <polygon points="23,13 29,8 27,18" fill="#22c55e" />

        {/* Armored Dragon Body */}
        <rect x="10" y="13" width="12" height="12" fill="#1e293b" />
        <rect x="11" y="15" width="10" height="8" fill="#334155" />
        {/* Chest Scar */}
        <line x1="13" y1="16" x2="19" y2="21" stroke="#ef4444" strokeWidth="1" />

        {/* Legs & Tail */}
        <rect x="11" y="25" width="4" height="5" fill="#0f172a" />
        <rect x="17" y="25" width="4" height="5" fill="#0f172a" />
        <polygon points="9,26 4,28 8,30" fill="#166534" />

        {/* Head & Fierce Nova Horns */}
        <rect x="12" y="7" width="8" height="6" fill="#fca5a5" />
        <polygon points="11,8 6,1 12,4" fill="#b91c1c" />
        <polygon points="21,8 26,1 20,4" fill="#b91c1c" />

        {/* Fierce Eyes */}
        <rect x="13" y="9" width="2" height="1.5" fill="#22c55e" />
        <rect x="17" y="9" width="2" height="1.5" fill="#22c55e" />

        {/* Dual Tyrant Blades */}
        <rect x="4" y="9" width="2" height="15" fill="#22c55e" />
        <rect x="26" y="9" width="2" height="15" fill="#22c55e" />
      </svg>
    </div>
  );
};

// 5. 검은 마법사 (The Black Mage) - 세계의 초월자, 사슬, 창조/파괴의 구체
export const BlackMageSprite: React.FC<{ action?: 'idle' | 'hit'; className?: string }> = ({
  action = 'idle',
  className = 'w-36 h-36'
}) => {
  return (
    <div className={`relative inline-block transition-transform duration-100 ${action === 'hit' ? 'brightness-200 scale-95' : 'animate-pulse'} ${className}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="16" cy="30" rx="14" ry="2.5" fill="#000" opacity="0.6" />
        {/* Transcendent Dark Aura & Chains */}
        <path d="M 4 20 Q 8 10 16 12 Q 24 10 28 20" stroke="#7f1d1d" strokeWidth="1" fill="none" className="animate-pulse" />
        <line x1="6" y1="28" x2="12" y2="16" stroke="#991b1b" strokeWidth="0.8" />
        <line x1="26" y1="28" x2="20" y2="16" stroke="#991b1b" strokeWidth="0.8" />

        {/* Majestic Pure Obsidian Robe */}
        <polygon points="9,12 2,30 30,30 23,12" fill="#000000" />
        <polygon points="11,13 5,29 27,29 21,13" fill="#18181b" />
        <rect x="13" y="14" width="6" height="15" fill="#27272a" />
        {/* Red Rune Embroidery */}
        <line x1="16" y1="15" x2="16" y2="27" stroke="#dc2626" strokeWidth="1" />

        {/* Deep Black Hood */}
        <polygon points="9,6 16,0 23,6 22,13 10,13" fill="#09090b" />
        {/* Pitch Black Void Face */}
        <rect x="11" y="6" width="10" height="7" fill="#000000" />
        {/* Terrifying Glowing Crimson Eyes of the Transcendent */}
        <rect x="13" y="8" width="2.5" height="1.5" fill="#ef4444" />
        <rect x="17" y="8" width="2.5" height="1.5" fill="#ef4444" />
        <circle cx="14" cy="8.5" r="0.8" fill="#fef08a" />
        <circle cx="18" cy="8.5" r="0.8" fill="#fef08a" />

        {/* Creation Orb (Left hand, Pure White / Cyan Light) */}
        <circle cx="4" cy="14" r="3" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '2s' }} />
        <circle cx="4" cy="14" r="2.5" fill="#ffffff" />
        <circle cx="4" cy="14" r="1.5" fill="#bae6fd" />

        {/* Destruction Orb (Right hand, Blood Red / Dark Matter) */}
        <circle cx="28" cy="14" r="3" fill="#ef4444" className="animate-ping" style={{ animationDuration: '1.8s' }} />
        <circle cx="28" cy="14" r="2.5" fill="#7f1d1d" />
        <circle cx="28" cy="14" r="1.5" fill="#dc2626" />
      </svg>
    </div>
  );
};

// Item Icons
export const ItemSprite: React.FC<{
  type: 'POTION' | 'SWORD' | 'HOURGLASS' | 'SHIELD';
  className?: string;
}> = ({ type, className = 'w-8 h-8' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {type === 'POTION' && (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="7" y="2" width="2" height="2" fill="#d97706" />
          <rect x="6" y="4" width="4" height="2" fill="#94a3b8" />
          <rect x="5" y="6" width="6" height="7" fill="#ef4444" rx="1" />
          <rect x="6" y="7" width="2" height="2" fill="#fca5a5" />
          <rect x="5" y="11" width="6" height="2" fill="#b91c1c" />
        </svg>
      )}

      {type === 'SWORD' && (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="11" y="2" width="2" height="2" fill="#ffffff" />
          <rect x="8" y="4" width="4" height="4" fill="#fbbf24" />
          <rect x="5" y="7" width="4" height="4" fill="#f59e0b" />
          <rect x="3" y="9" width="6" height="2" fill="#78350f" />
          <rect x="3" y="11" width="2" height="3" fill="#451a03" />
        </svg>
      )}

      {type === 'HOURGLASS' && (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="4" y="2" width="8" height="2" fill="#d4af37" />
          <rect x="5" y="4" width="6" height="3" fill="#38bdf8" />
          <rect x="7" y="7" width="2" height="2" fill="#0284c7" />
          <rect x="5" y="9" width="6" height="3" fill="#38bdf8" />
          <rect x="6" y="10" width="4" height="2" fill="#bae6fd" />
          <rect x="4" y="12" width="8" height="2" fill="#d4af37" />
        </svg>
      )}

      {type === 'SHIELD' && (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="4" y="3" width="8" height="3" fill="#3b82f6" />
          <rect x="3" y="4" width="10" height="6" fill="#2563eb" />
          <polygon points="3,10 8,14 13,10" fill="#1d4ed8" />
          <rect x="7" y="5" width="2" height="6" fill="#fbbf24" />
          <rect x="5" y="7" width="6" height="2" fill="#fbbf24" />
        </svg>
      )}
    </div>
  );
};

// Treasure Chest Sprite (Item drop animation)
export const TreasureChestSprite: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <div className={`relative inline-block animate-bounce ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
        <ellipse cx="12" cy="22" rx="7" ry="1.5" fill="#000" opacity="0.3" />
        {/* Chest Box */}
        <rect x="4" y="10" width="16" height="10" fill="#92400e" stroke="#000" strokeWidth="1" />
        <rect x="3" y="6" width="18" height="5" fill="#b45309" stroke="#000" strokeWidth="1" />
        {/* Golden Straps */}
        <rect x="7" y="6" width="2" height="14" fill="#fbbf24" />
        <rect x="15" y="6" width="2" height="14" fill="#fbbf24" />
        {/* Keyhole */}
        <rect x="11" y="9" width="2" height="3" fill="#fef08a" />
        <rect x="11.5" y="10" width="1" height="1" fill="#000" />
      </svg>
    </div>
  );
};
