/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GameMode, ScreenState, IncorrectRecord } from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { StoryIntroModal } from './components/StoryIntroModal';
import { BattleScreen } from './components/BattleScreen';
import { ResultScreen } from './components/ResultScreen';
import { AuthModal } from './components/AuthModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AuthProvider } from './context/AuthContext';
import { soundManager } from './utils/sound';

interface CurrentSummary {
  totalTimeSeconds: number;
  totalAnswered: number;
  correctCount: number;
  criticalCount: number;
  maxCombo: number;
  incorrectList: IncorrectRecord[];
}

function MainGame() {
  const [screenState, setScreenState] = useState<ScreenState>('INTRO');
  const [gameMode, setGameMode] = useState<GameMode>('NORMAL');
  const [selectedDan, setSelectedDan] = useState<number | undefined>(7);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  const [lastSummary, setLastSummary] = useState<CurrentSummary>({
    totalTimeSeconds: 0,
    totalAnswered: 0,
    correctCount: 0,
    criticalCount: 0,
    maxCombo: 0,
    incorrectList: []
  });

  const handleToggleMute = () => {
    const updated = soundManager.toggleMute();
    setIsMuted(updated);
  };

  const handleStartGame = (mode: GameMode, dan?: number) => {
    setGameMode(mode);
    setSelectedDan(dan);
    setScreenState('STORY');
  };

  const handleStartAdventure = () => {
    setScreenState('BATTLE');
  };

  const handleGameClear = (summary: CurrentSummary) => {
    setLastSummary(summary);
    setScreenState('GAME_CLEAR');
  };

  const handleGameOver = (summary: CurrentSummary) => {
    setLastSummary(summary);
    setScreenState('GAME_OVER');
  };

  const handleRestart = () => {
    setScreenState('INTRO');
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1117] text-white">
      {screenState === 'INTRO' && (
        <TitleScreen
          onStartGame={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      )}

      {screenState === 'STORY' && (
        <StoryIntroModal
          onStartAdventure={handleStartAdventure}
          selectedDan={selectedDan}
          isHardMode={gameMode === 'HARD'}
        />
      )}

      {screenState === 'BATTLE' && (
        <BattleScreen
          mode={gameMode}
          selectedDan={selectedDan}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onGameClear={handleGameClear}
          onGameOver={handleGameOver}
        />
      )}

      {(screenState === 'GAME_CLEAR' || screenState === 'GAME_OVER') && (
        <ResultScreen
          isClear={screenState === 'GAME_CLEAR'}
          mode={gameMode}
          selectedDan={selectedDan}
          totalTimeSeconds={lastSummary.totalTimeSeconds}
          totalAnswered={lastSummary.totalAnswered}
          correctCount={lastSummary.correctCount}
          criticalCount={lastSummary.criticalCount}
          maxCombo={lastSummary.maxCombo}
          incorrectList={lastSummary.incorrectList}
          onRestart={handleRestart}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      )}

      {/* Auth Modal (Nickname & Password Register/Login) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Leaderboard Modal (Hall of Fame) */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainGame />
    </AuthProvider>
  );
}
