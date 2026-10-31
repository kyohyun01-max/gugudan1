import React, { useState } from 'react';
import { GameMode } from '../types/game';
import { HeroSprite } from './PixelSprites';
import { soundManager } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import { Volume2, VolumeX, Shield, Zap, Sparkles, Trophy, User, LogIn, LogOut } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: (mode: GameMode, selectedDan?: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
  onOpenAuth,
  onOpenLeaderboard
}) => {
  const { userProfile, logoutUser } = useAuth();
  const [mode, setMode] = useState<GameMode>('NORMAL');
  const [selectedDan, setSelectedDan] = useState<number>(7); // default 7단

  const handleSelectMode = (newMode: GameMode) => {
    soundManager.playSelect();
    setMode(newMode);
  };

  const handleSelectDan = (dan: number) => {
    soundManager.playSelect();
    setSelectedDan(dan);
  };

  const handleStart = () => {
    soundManager.playSelect();
    onStartGame(mode, mode === 'NORMAL' ? selectedDan : undefined);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col items-center justify-center p-4 scanlines relative select-none">
      {/* Top Utility Bar: User Account, Hall of Fame, Sound */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 flex items-center justify-between z-20">
        {/* Left: User Status / Login Button */}
        <div>
          {userProfile ? (
            <div className="flex items-center gap-2 bg-stone-900/90 border border-amber-500/60 px-3 py-1.5 rounded-md shadow">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">
                {userProfile.nickname} <span className="text-stone-400 text-[10px]">용사</span>
              </span>
              <button
                onClick={logoutUser}
                className="text-stone-400 hover:text-red-400 p-0.5 rounded transition-colors ml-1"
                title="로그아웃"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenAuth();
              }}
              className="retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-1.5 text-xs font-black flex items-center gap-1.5 rounded border-amber-300 shadow-[0_3px_0_#78350f]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>회원가입 / 로그인</span>
            </button>
          )}
        </div>

        {/* Right: Hall of Fame & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playSelect();
              onOpenLeaderboard();
            }}
            className="retro-btn bg-stone-800 hover:bg-amber-950 text-amber-300 px-3 py-1.5 text-xs font-black flex items-center gap-1.5 rounded border-stone-600 shadow-[0_3px_0_#000]"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>명예의 전당</span>
          </button>

          <button
            onClick={onToggleMute}
            className="retro-btn bg-[#1f2937] hover:bg-[#374151] text-amber-300 p-2 text-xs flex items-center rounded border-stone-700 shadow-[0_3px_0_#000]"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-green-400" />}
          </button>
        </div>
      </div>

      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Game Logo & Hero Badge with Tiny Farm Pixel Decorations */}
        <div className="flex flex-col items-center mb-6 relative">
          {/* Flanking Farm Companions */}
          <div className="flex items-center gap-4 mb-2">
            <img
              src="/assets/tiny-farm/Tiles/tile_0120.png"
              alt="Sheep"
              className="w-8 h-8 image-pixelated hidden sm:block"
              style={{ imageRendering: 'pixelated' }}
            />
            <HeroSprite className="w-20 h-20 animate-pulse" />
            <img
              src="/assets/tiny-farm/Tiles/tile_0122.png"
              alt="Chicken"
              className="w-8 h-8 image-pixelated animate-bounce hidden sm:block"
              style={{ imageRendering: 'pixelated', animationDuration: '1.4s' }}
            />
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-wider text-center text-amber-400 drop-shadow-[0_4px_0_#78350f] flex items-center justify-center gap-2">
            <img
              src="/assets/tiny-farm/Tiles/tile_0083.png"
              alt="Sunflower"
              className="w-7 h-7 sm:w-9 sm:h-9 image-pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
            <span>구구단 용사</span>
            <img
              src="/assets/tiny-farm/Tiles/tile_0083.png"
              alt="Sunflower"
              className="w-7 h-7 sm:w-9 sm:h-9 image-pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 tracking-widest uppercase">
            Times Table Hero · 8-Bit Pixel RPG
          </p>
        </div>

        {/* Main Settings Box */}
        <div className="w-full retro-box p-5 sm:p-6 mb-6">
          <h2 className="text-sm font-bold text-amber-300 border-b border-stone-700 pb-2 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>모드 및 난이도 선택</span>
          </h2>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => handleSelectMode('NORMAL')}
              className={`retro-btn py-3 px-3 text-center transition-all ${
                mode === 'NORMAL'
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-[0_4px_0_#92400e]'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border-stone-900'
              }`}
            >
              <div className="text-sm font-bold">일반 모드 (Normal)</div>
              <div className="text-[11px] opacity-80 mt-1">원하는 단수 집중 연습</div>
            </button>

            <button
              onClick={() => handleSelectMode('HARD')}
              className={`retro-btn py-3 px-3 text-center transition-all ${
                mode === 'HARD'
                  ? 'bg-red-600 text-white font-bold border-red-300 shadow-[0_4px_0_#7f1d1d]'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border-stone-900'
              }`}
            >
              <div className="text-sm font-bold flex items-center justify-center gap-1">
                <span>하드 모드 (Hard)</span>
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="text-[11px] opacity-80 mt-1">2~9단 전구간 무작위 출제</div>
            </button>
          </div>

          {/* Dan Selector for Normal Mode */}
          {mode === 'NORMAL' ? (
            <div className="mb-4">
              <label className="text-xs text-stone-400 block mb-2 font-bold">
                연습할 구구단 단수 선택: <span className="text-amber-400 text-sm font-black">{selectedDan}단</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[2, 3, 4, 5, 6, 7, 8, 9].map((dan) => (
                  <button
                    key={dan}
                    onClick={() => handleSelectDan(dan)}
                    className={`retro-btn py-2 text-sm font-bold ${
                      selectedDan === dan
                        ? 'bg-amber-400 text-stone-950 border-amber-200'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border-stone-900'
                    }`}
                  >
                    {dan}단
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200 leading-relaxed">
              <p className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                마왕 토벌 보상 안내
              </p>
              하드 모드에서는 2단부터 9단까지 무작위로 문제가 출제됩니다. 최종 보스 처치 시 특별 영웅 칭호가 수여됩니다!
            </div>
          )}

          {/* Game Tips & Mechanics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>1.5초 내 크리티컬 2배</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>스테이지 간 정비 쉼터</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-300 font-bold font-mono">Space</span>
              <span>전술 일시정지 & 가방</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold font-mono">1~4 / Z~V</span>
              <span>정답 & 아이템 단축키</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-lg sm:text-xl py-4 uppercase tracking-widest border-amber-200 shadow-[0_6px_0_#78350f] active:translate-y-1"
        >
          모험 시작하기 (Game Start)
        </button>

        {/* Footer info */}
        <p className="text-[11px] text-stone-500 mt-5 text-center">
          구구단 용사 (Times Table Hero) · 8비트 레트로 에듀케이션 RPG
        </p>
      </div>
    </div>
  );
};
