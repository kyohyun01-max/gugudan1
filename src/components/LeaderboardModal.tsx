import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, submitScore, LeaderboardEntry } from '../utils/leaderboard';
import { soundManager } from '../utils/sound';
import { Trophy, Medal, X, RefreshCw, Flame, Clock, Target, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'ALL' | 'HARD' | 'NORMAL'>('ALL');
  const [testSending, setTestSending] = useState<boolean>(false);
  const [testStatusMsg, setTestStatusMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLeaderboard();
    setEntries(data);
    setLoading(false);
  };

  const handleSendTestScore = async () => {
    setTestSending(true);
    setTestStatusMsg(null);
    try {
      const dummyNick = `테스트용사${Math.floor(100 + Math.random() * 900)}`;
      await submitScore({
        nickname: dummyNick,
        score: Math.floor(1200 + Math.random() * 800),
        mode: filterMode === 'HARD' ? 'HARD' : 'NORMAL',
        stageReached: 3,
        accuracy: 94,
        clearTimeSeconds: 45,
        maxCombo: 7,
        title: '구구단 정복자',
        isClear: false
      });
      soundManager.playVictoryFanfare();
      setTestStatusMsg(`[${dummyNick}]의 점수가 Firestore 'scores' 컬렉션에 등록되었습니다!`);
      await loadData();
    } catch (err) {
      console.error(err);
      setTestStatusMsg('점수 등록 중 오류가 발생했습니다.');
    } finally {
      setTestSending(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = entries.filter((e) => {
    if (filterMode === 'ALL') return true;
    return e.mode === filterMode;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 scanlines select-none">
      <div className="max-w-2xl w-full retro-box p-4 sm:p-6 border-amber-400 relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
                구구단 용사 명예의 전당
              </h2>
              <p className="text-[11px] text-stone-300">
                실시간 학습자 연산 랭킹 · Firebase 연동
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playSelect();
              loadData();
            }}
            disabled={loading}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 flex items-center gap-1 text-xs"
            title="새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 mb-3 bg-stone-900 p-1 rounded border border-stone-800">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
              filterMode === 'ALL'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            전체 랭킹 ({entries.length})
          </button>
          <button
            onClick={() => setFilterMode('HARD')}
            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
              filterMode === 'HARD'
                ? 'bg-red-600 text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            하드 모드 ({entries.filter((e) => e.mode === 'HARD').length})
          </button>
          <button
            onClick={() => setFilterMode('NORMAL')}
            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
              filterMode === 'NORMAL'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            일반 모드 ({entries.filter((e) => e.mode === 'NORMAL').length})
          </button>
        </div>

        {/* Rankings Table Content */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mb-2" />
              <span>명예의 전당 기록을 불러오는 중...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400 text-center p-4">
              <Medal className="w-10 h-10 text-stone-600 mb-2" />
              <p className="text-sm font-bold text-stone-300">아직 등록된 랭킹 기록이 없습니다.</p>
              <p className="text-xs text-stone-500 mt-1 mb-3">지금 게임을 플레이하거나 아래 버튼으로 Firestore 연동을 테스트해보세요.</p>
              <button
                onClick={handleSendTestScore}
                disabled={testSending}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{testSending ? 'Firestore에 전송 중...' : 'DB 연동 테스트 점수 1건 등록하기'}</span>
              </button>
            </div>
          ) : (
            filtered.map((entry, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              return (
                <div
                  key={entry.id}
                  className={`p-3 rounded border flex items-center justify-between transition-all ${
                    rank === 1
                      ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                      : rank === 2
                      ? 'bg-slate-900/60 border-slate-400'
                      : rank === 3
                      ? 'bg-amber-950/20 border-amber-700'
                      : 'bg-stone-900/60 border-stone-800'
                  }`}
                >
                  {/* Left: Rank & Nickname */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex items-center justify-center font-black font-mono text-base">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-stone-400">#{rank}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-white">
                          {entry.nickname}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            entry.mode === 'HARD'
                              ? 'bg-red-950 text-red-300 border border-red-700'
                              : 'bg-stone-800 text-amber-300 border border-stone-700'
                          }`}
                        >
                          {entry.mode === 'HARD' ? '하드' : '일반'}
                        </span>
                        {entry.isClear && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1 py-0.5 rounded font-bold flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> 클리어
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-amber-300/90 truncate max-w-[200px] sm:max-w-xs mt-0.5 font-medium">
                        {entry.title}
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Score */}
                  <div className="text-right">
                    <div className="text-base sm:text-xl font-black font-mono text-amber-400">
                      {entry.score.toLocaleString()} <span className="text-xs text-stone-400">점</span>
                    </div>

                    <div className="text-[10px] text-stone-400 font-mono flex items-center justify-end gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Target className="w-3 h-3 text-emerald-400" />
                        {entry.accuracy}%
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {entry.maxCombo}연타
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {entry.clearTimeSeconds}s
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Test Notification Banner */}
        {testStatusMsg && (
          <div className="my-2 p-2 bg-emerald-950/80 border border-emerald-500 rounded text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{testStatusMsg}</span>
          </div>
        )}

        {/* Footer info & DB verification bar */}
        <div className="mt-3 pt-2.5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span>점수 산정: 정답 + 크리티컬 + 콤보 + 속도</span>
            <button
              onClick={handleSendTestScore}
              disabled={testSending}
              className="text-amber-400 hover:text-amber-300 underline font-mono text-[10px] flex items-center gap-1"
              title="Firestore scores 컬렉션에 테스트 데이터 전송"
            >
              <Database className="w-3 h-3" />
              <span>{testSending ? '전송 중...' : 'DB 테스트 점수 전송'}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-bold w-full sm:w-auto text-center"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
