import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../utils/firebase';

export interface UserProfile {
  uid: string;
  nickname: string;
  bestScore?: number;
  clearedStages?: number;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  registerUser: (nickname: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  loginUser: (nickname: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;
  updateBestScore: (newScore: number, clearedStage: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate deterministic safe internal email from nickname
function nicknameToEmail(nickname: string): string {
  const clean = encodeURIComponent(nickname.trim().toLowerCase());
  return `${clean}@timestablehero.app`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Firestore profile
  const fetchProfile = async (uid: string, fallbackNickname?: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserProfile({
          uid,
          nickname: data.nickname || fallbackNickname || '용사',
          bestScore: data.bestScore || 0,
          clearedStages: data.clearedStages || 0
        });
      } else if (fallbackNickname) {
        // Create initial profile if missing
        await setDoc(docRef, {
          uid,
          nickname: fallbackNickname,
          createdAt: serverTimestamp(),
          bestScore: 0,
          clearedStages: 0
        });
        setUserProfile({
          uid,
          nickname: fallbackNickname,
          bestScore: 0,
          clearedStages: 0
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user.uid, user.displayName || undefined);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerUser = async (nickname: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedNick = nickname.trim();
    if (trimmedNick.length < 2 || trimmedNick.length > 20) {
      return { success: false, error: '닉네임은 2글자 이상 20글자 이하로 입력해주세요.' };
    }
    if (pin.length < 6) {
      return { success: false, error: '비밀번호는 최소 6자리 이상이어야 합니다.' };
    }

    try {
      const email = nicknameToEmail(trimmedNick);
      const cred = await createUserWithEmailAndPassword(auth, email, pin);

      await updateProfile(cred.user, { displayName: trimmedNick });

      // Save initial profile to Firestore
      const userRef = doc(db, 'users', cred.user.uid);
      try {
        await setDoc(userRef, {
          uid: cred.user.uid,
          nickname: trimmedNick,
          createdAt: serverTimestamp(),
          bestScore: 0,
          clearedStages: 0
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
      }

      setUserProfile({
        uid: cred.user.uid,
        nickname: trimmedNick,
        bestScore: 0,
        clearedStages: 0
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('email-already-in-use')) {
        return { success: false, error: '이미 사용 중인 닉네임입니다. 다른 닉네임을 사용하거나 로그인해 주세요.' };
      }
      if (msg.includes('weak-password')) {
        return { success: false, error: '비밀번호 보안 수준이 낮습니다. 6자리 이상 영문/숫자를 사용하세요.' };
      }
      if (msg.includes('operation-not-allowed') || msg.includes('OPERATION_NOT_ALLOWED')) {
        return {
          success: false,
          error: 'Firebase 콘솔의 [Authentication > Sign-in method]에서 "이메일/비밀번호" 로그인을 사용 설정(활성화)해주세요.'
        };
      }
      return { success: false, error: `회원가입 실패: ${msg}` };
    }
  };

  const loginUser = async (nickname: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedNick = nickname.trim();
    if (!trimmedNick) return { success: false, error: '닉네임을 입력해 주세요.' };
    if (!pin) return { success: false, error: '비밀번호를 입력해 주세요.' };

    try {
      const email = nicknameToEmail(trimmedNick);
      const cred = await signInWithEmailAndPassword(auth, email, pin);
      await fetchProfile(cred.user.uid, trimmedNick);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('user-not-found') || msg.includes('invalid-credential') || msg.includes('wrong-password')) {
        return { success: false, error: '닉네임 또는 비밀번호가 일치하지 않습니다.' };
      }
      if (msg.includes('operation-not-allowed') || msg.includes('OPERATION_NOT_ALLOWED')) {
        return {
          success: false,
          error: 'Firebase 콘솔의 [Authentication > Sign-in method]에서 "이메일/비밀번호" 로그인을 활성화해주세요.'
        };
      }
      return { success: false, error: `로그인 실패: ${msg}` };
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateBestScore = async (newScore: number, clearedStage: number) => {
    if (!currentUser) return;
    try {
      const currentBest = userProfile?.bestScore || 0;
      const currentStages = userProfile?.clearedStages || 0;

      if (newScore > currentBest || clearedStage > currentStages) {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, {
          bestScore: Math.max(currentBest, newScore),
          clearedStages: Math.max(currentStages, clearedStage)
        }, { merge: true });

        setUserProfile((prev) => prev ? {
          ...prev,
          bestScore: Math.max(currentBest, newScore),
          clearedStages: Math.max(currentStages, clearedStage)
        } : null);
      }
    } catch (err) {
      console.error('Error updating best score:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        updateBestScore
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
