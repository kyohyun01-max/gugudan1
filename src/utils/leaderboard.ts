import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { GameMode } from '../types/game';

export interface LeaderboardEntry {
  id: string;
  userId?: string;
  nickname: string;
  score: number;
  mode: GameMode;
  stageReached: number;
  accuracy: number;
  clearTimeSeconds: number;
  maxCombo: number;
  title: string;
  isClear: boolean;
  createdAt?: string | Date;
}

export function calculateGameScore(
  correctCount: number,
  criticalCount: number,
  maxCombo: number,
  isClear: boolean,
  clearTimeSeconds: number,
  mode: GameMode
): number {
  const base = correctCount * 120;
  const critBonus = criticalCount * 60;
  const comboBonus = maxCombo * 40;
  const clearBonus = isClear ? (mode === 'HARD' ? 1800 : 1000) : 0;
  const timePenalty = Math.min(300, clearTimeSeconds * 2);
  const modeMultiplier = mode === 'HARD' ? 1.4 : 1.0;

  const rawScore = Math.round(((base + critBonus + comboBonus + clearBonus) - timePenalty) * modeMultiplier);
  return Math.max(10, rawScore);
}

export async function submitScore(record: {
  userId?: string;
  nickname: string;
  score: number;
  mode: GameMode;
  stageReached: number;
  accuracy: number;
  clearTimeSeconds: number;
  maxCombo: number;
  title: string;
  isClear: boolean;
}): Promise<string | null> {
  const path = 'scores';
  try {
    const payload: Record<string, unknown> = {
      nickname: record.nickname.trim(),
      score: Math.max(0, record.score),
      mode: record.mode,
      stageReached: Math.min(5, Math.max(1, record.stageReached)),
      accuracy: Math.min(100, Math.max(0, record.accuracy)),
      clearTimeSeconds: Math.max(0, record.clearTimeSeconds),
      maxCombo: Math.max(0, record.maxCombo),
      title: record.title || '구구단 용사',
      isClear: Boolean(record.isClear),
      createdAt: serverTimestamp()
    };
    if (record.userId) {
      payload.userId = record.userId;
    }

    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const path = 'scores';
  try {
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        id: docSnap.id,
        userId: data.userId,
        nickname: data.nickname || '용사',
        score: data.score || 0,
        mode: data.mode || 'NORMAL',
        stageReached: data.stageReached || 1,
        accuracy: data.accuracy || 0,
        clearTimeSeconds: data.clearTimeSeconds || 0,
        maxCombo: data.maxCombo || 0,
        title: data.title || '구구단 용사',
        isClear: Boolean(data.isClear),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined
      });
    });

    return entries;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}
