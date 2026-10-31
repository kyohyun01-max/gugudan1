import React, { useEffect, useState } from 'react';
import { KingSprite, HeroSprite } from './PixelSprites';
import { soundManager } from '../utils/sound';
import { ChevronRight } from 'lucide-react';

interface StoryIntroModalProps {
  onStartAdventure: () => void;
  selectedDan?: number;
  isHardMode: boolean;
}

export const StoryIntroModal: React.FC<StoryIntroModalProps> = ({
  onStartAdventure,
  selectedDan,
  isHardMode
}) => {
  const fullText = isHardMode
    ? '오오! 용감한 구구단 용사여! 검은 마법사와 4대 군단장(힐라, 반 레온, 아카이럼, 매그너스)이 세계를 침략했소! 2단부터 9단까지 모든 연산의 힘을 총동원하여 군단장들을 물리치고 검은 마법사를 저지해 주시오!'
    : `용감한 구구단 용사여! 군단장들이 왕국의 ${selectedDan}단 결계를 파괴하고 침략했소! 그대가 갈고닦은 ${selectedDan}단의 힘으로 군단장과 검은 마법사를 물리쳐 평화를 되찾아주시오!`;

  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [fullText]);

  const handleSkipOrProceed = () => {
    if (displayedText.length < fullText.length) {
      setDisplayedText(fullText);
    } else {
      soundManager.playSelect();
      onStartAdventure();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 scanlines select-none">
      <div className="max-w-xl w-full retro-box-gold p-6 relative">
        {/* Header */}
        <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-between border-b border-amber-800/60 pb-2">
          <span>왕궁 알현실 · 국왕의 긴급 칙령</span>
          <span className="text-stone-400">STAGE 1 ~ 5</span>
        </div>

        {/* Characters Presentation */}
        <div className="flex items-end justify-around my-6 py-4 bg-stone-950/60 border border-stone-800 rounded">
          <div className="flex flex-col items-center">
            <KingSprite className="w-20 h-20" />
            <span className="text-xs font-bold text-amber-300 mt-2">국왕 아서</span>
          </div>

          <div className="text-stone-500 font-bold text-sm tracking-widest pb-6">
            VS
          </div>

          <div className="flex flex-col items-center">
            <HeroSprite className="w-20 h-20" />
            <span className="text-xs font-bold text-blue-400 mt-2">구구단 용사</span>
          </div>
        </div>

        {/* Dialogue Box */}
        <div
          onClick={handleSkipOrProceed}
          className="bg-stone-900 border-2 border-stone-700 p-4 rounded min-h-[90px] cursor-pointer mb-6"
        >
          <div className="text-amber-400 text-xs font-bold mb-1">국왕의 목소리:</div>
          <p className="text-stone-100 text-sm leading-relaxed font-medium">
            "{displayedText}"
            {displayedText.length < fullText.length && (
              <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse align-middle" />
            )}
          </p>
          <div className="text-right text-[10px] text-stone-500 mt-2">
            {displayedText.length < fullText.length ? '클릭하여 전체 보기' : '준비 완료'}
          </div>
        </div>

        {/* Start Adventure Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onStartAdventure();
          }}
          className="w-full retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-base sm:text-lg py-3 flex items-center justify-center gap-2 border-amber-300 shadow-[0_4px_0_#78350f]"
        >
          <span>모험 떠나기 (Start Adventure)</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
