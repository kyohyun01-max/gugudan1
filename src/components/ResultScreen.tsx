import React, { useState, useEffect, useRef } from 'react';
import { GameMode, IncorrectRecord } from '../types/game';
import { HeroSprite, BlackMageSprite } from './PixelSprites';
import { soundManager } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import { calculateGameScore, submitScore } from '../utils/leaderboard';
import { Trophy, RefreshCw, Flame, Clock, Target, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface ResultScreenProps {
  isClear: boolean;
  mode: GameMode;
  selectedDan?: number;
  totalTimeSeconds: number;
  totalAnswered: number;
  correctCount: number;
  criticalCount: number;
  maxCombo: number;
  incorrectList: IncorrectRecord[];
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  isClear,
  mode,
  selectedDan,
  totalTimeSeconds,
  totalAnswered,
  correctCount,
  criticalCount,
  maxCombo,
  incorrectList,
  onRestart,
  onOpenLeaderboard
}) => {
  const { userProfile, updateBestScore } = useAuth();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [guestNickname, setGuestNickname] = useState<string>('');
  const hasAutoSubmittedRef = useRef<boolean>(false);

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const score = calculateGameScore(correctCount, criticalCount, maxCombo, isClear, totalTimeSeconds, mode);

  let awardedTitle = '수련하는 구구단 전사';
  if (isClear) {
    if (mode === 'HARD') {
      if (accuracy >= 90) {
        awardedTitle = '👑 [신화] 검은 마법사를 봉인한 전설의 대마도사';
      } else {
        awardedTitle = '⚔️ [영웅] 세계를 구원한 빛의 기사단장';
      }
    } else {
      awardedTitle = `🎖️ [마스터] ${selectedDan}단의 수호기사`;
    }
  } else {
    awardedTitle = `🛡️ [도전자] 군단장에 맞선 용사`;
  }

  // Auto-submit score for logged-in users once
  useEffect(() => {
    if (userProfile && !hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      setSubmitting(true);
      submitScore({
        userId: userProfile.uid,
        nickname: userProfile.nickname,
        score,
        mode,
        stageReached: isClear ? 5 : Math.max(1, 5 - Math.ceil(incorrectList.length / 2)),
        accuracy,
        clearTimeSeconds: totalTimeSeconds,
        maxCombo,
        title: awardedTitle,
        isClear
      }).then(() => {
        setSubmitting(false);
        setSubmitted(true);
        updateBestScore(score, isClear ? 5 : 1);
      });
    }
  }, [userProfile, score, mode, isClear, incorrectList.length, accuracy, totalTimeSeconds, maxCombo, awardedTitle, updateBestScore]);

  // Guest manual submit
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nick = guestNickname.trim();
    if (!nick || nick.length < 2) return;

    setSubmitting(true);
    await submitScore({
      nickname: nick,
      score,
      mode,
      stageReached: isClear ? 5 : 1,
      accuracy,
      clearTimeSeconds: totalTimeSeconds,
      maxCombo,
      title: awardedTitle,
      isClear
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleRestart = () => {
    soundManager.playSelect();
    onRestart();
  };

  return (
    <div className="min-h-screen bg-[#090d13] text-white flex flex-col items-center justify-center p-4 scanlines select-none">
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Banner Card */}
        <div className={`w-full retro-box p-5 sm:p-6 mb-4 text-center ${isClear ? 'border-amber-400' : 'border-red-600'}`}>
          {isClear ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <HeroSprite className="w-24 h-24" />
                <Trophy className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-amber-400 drop-shadow-[0_3px_0_#78350f]">
                GAME CLEAR!
              </h1>
              <p className="text-sm text-amber-200 mt-1 font-bold">
                검은 마법사를 봉인하고 세계에 평화를 되찾았습니다!
              </p>

              {/* Awarded Hero Title */}
              <div className="mt-4 px-4 py-2 bg-amber-500/10 border-2 border-amber-400/80 rounded-md">
                <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                  용사 칭호 수여
                </div>
                <div className="text-base sm:text-lg font-black text-amber-300 mt-0.5">
                  {awardedTitle}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-3">
                <BlackMageSprite className="w-24 h-24 opacity-80" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-red-500 drop-shadow-[0_3px_0_#7f1d1d]">
                GAME OVER
              </h1>
              <p className="text-sm text-stone-300 mt-1">
                용사의 체력이 다했습니다... 구구단 연산력을 다시 정비하세요!
              </p>
            </div>
          )}

          {/* Final Calculated Score Banner */}
          <div className="mt-5 p-3 bg-stone-900 border border-stone-700 rounded flex items-center justify-between">
            <span className="text-xs text-amber-300 font-bold">최종 획득 연산 점수</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              {score.toLocaleString()} <span className="text-sm text-stone-400 font-normal">점</span>
            </span>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-left">
            <div className="bg-stone-900/80 border border-stone-700 p-2.5 rounded">
              <div className="text-[10px] text-stone-400 flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3 text-cyan-400" /> 총 소요 시간
              </div>
              <div className="text-lg font-black font-mono text-cyan-300 mt-0.5">
                {totalTimeSeconds}초
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-700 p-2.5 rounded">
              <div className="text-[10px] text-stone-400 flex items-center gap-1 font-bold">
                <Target className="w-3 h-3 text-emerald-400" /> 정답률
              </div>
              <div className="text-lg font-black font-mono text-emerald-300 mt-0.5">
                {accuracy}%
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-700 p-2.5 rounded">
              <div className="text-[10px] text-stone-400 flex items-center gap-1 font-bold">
                <Flame className="w-3 h-3 text-amber-400" /> 최대 콤보
              </div>
              <div className="text-lg font-black font-mono text-amber-300 mt-0.5">
                {maxCombo} 연타
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-700 p-2.5 rounded">
              <div className="text-[10px] text-stone-400 flex items-center gap-1 font-bold">
                ⚡ 크리티컬
              </div>
              <div className="text-lg font-black font-mono text-purple-300 mt-0.5">
                {criticalCount}회
              </div>
            </div>
          </div>
        </div>

        {/* Hall of Fame Submission Status or Guest Submit Box */}
        <div className="w-full retro-box p-3 mb-4 border-amber-500/70 bg-stone-950">
          {submitted ? (
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold p-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>명예의 전당 랭킹에 기록이 등록되었습니다!</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playSelect();
                  onOpenLeaderboard();
                }}
                className="text-amber-400 underline hover:text-amber-300 font-mono text-[11px]"
              >
                순위 확인하기 →
              </button>
            </div>
          ) : userProfile ? (
            <div className="text-xs text-stone-300 flex items-center justify-between p-1">
              <span>{userProfile.nickname} 용사님의 점수를 등록하는 중...</span>
              <span className="animate-spin text-amber-400">⏳</span>
            </div>
          ) : (
            <form onSubmit={handleGuestSubmit} className="flex items-center gap-2">
              <input
                type="text"
                required
                maxLength={20}
                placeholder="닉네임 입력 (명예의 전당 등록)"
                value={guestNickname}
                onChange={(e) => setGuestNickname(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-700 px-3 py-1.5 rounded text-xs text-white outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                disabled={submitting}
                className="retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-3 py-1.5 text-xs rounded flex items-center gap-1 border-amber-300 shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? '등록중...' : '랭킹 등록'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Incorrect Problems Review (Crucial for Learning & Game Over) */}
        {incorrectList.length > 0 && (
          <div className="w-full retro-box p-4 mb-4 border-stone-700">
            <h2 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>오답 복습 노트 ({incorrectList.length}문제)</span>
            </h2>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {incorrectList.map((rec, idx) => (
                <div
                  key={`${rec.id}_${idx}`}
                  className="bg-stone-900/90 border border-stone-800 p-2.5 rounded flex items-center justify-between text-xs"
                >
                  <div className="font-mono text-sm font-bold text-stone-200">
                    {rec.dan} × {rec.multiplier} = <span className="text-emerald-400">{rec.correctAnswer}</span>
                  </div>

                  <div className="text-[11px] font-mono flex items-center gap-2">
                    {rec.skillName && (
                      <span className="text-[10px] text-amber-300 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800">
                        {rec.skillName}
                      </span>
                    )}
                    {rec.isTimeout ? (
                      <span className="text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                        시간 초과
                      </span>
                    ) : (
                      <span className="text-stone-400">
                        입력 오답: <span className="text-red-400 line-through">{rec.playerAnswer}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons: Leaderboard & Play Again */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundManager.playSelect();
              onOpenLeaderboard();
            }}
            className="retro-btn bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-base py-3.5 flex items-center justify-center gap-2 border-stone-600 shadow-[0_4px_0_#000]"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>명예의 전당 순위 보기</span>
          </button>

          <button
            onClick={handleRestart}
            className="retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-base py-3.5 flex items-center justify-center gap-2 border-amber-300 shadow-[0_4px_0_#78350f] active:translate-y-1"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{isClear ? '새로운 모험 시작' : '다시 도전하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
