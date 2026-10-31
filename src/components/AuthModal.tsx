import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundManager } from '../utils/sound';
import { User, Lock, X, Sparkles, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import { HeroSprite } from './PixelSprites';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'register'
}) => {
  const { loginUser, registerUser } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultMode);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (tab === 'register') {
      const res = await registerUser(nickname, password);
      setLoading(false);
      if (res.success) {
        soundManager.playVictoryFanfare();
        setSuccessMsg(`환영합니다, ${nickname} 용사님! 회원가입이 완료되었습니다.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        soundManager.playHurt();
        setErrorMsg(res.error || '회원가입에 실패했습니다.');
      }
    } else {
      const res = await loginUser(nickname, password);
      setLoading(false);
      if (res.success) {
        soundManager.playSelect();
        setSuccessMsg(`반갑습니다, ${nickname} 용사님! 로그인되었습니다.`);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        soundManager.playHurt();
        setErrorMsg(res.error || '로그인에 실패했습니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 scanlines select-none">
      <div className="max-w-md w-full retro-box p-6 border-amber-400 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <HeroSprite className="w-16 h-16 mb-2" />
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
            용사의 길드 등록소
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            닉네임과 비밀번호로 간편하게 가입하고 명예의 전당에 이름을 새기세요!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-stone-900 p-1 rounded border border-stone-700">
          <button
            type="button"
            onClick={() => {
              soundManager.playSelect();
              setTab('register');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
              tab === 'register'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>회원가입</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playSelect();
              setTab('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
              tab === 'login'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>로그인</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs text-stone-300 font-bold block mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>학습자 닉네임 (2~20자)</span>
            </label>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="예: 빛의마법사, 연산용사"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-stone-900 border-2 border-stone-700 focus:border-amber-400 px-3 py-2.5 rounded text-white text-sm outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-stone-300 font-bold block mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>비밀번호 (6자리 이상)</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-900 border-2 border-stone-700 focus:border-amber-400 px-3 py-2.5 rounded text-white text-sm outline-none font-mono"
            />
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-2.5 bg-red-950/70 border border-red-700 rounded text-xs text-red-200">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-950/70 border border-emerald-700 rounded text-xs text-emerald-300 flex items-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full retro-btn bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 rounded text-sm sm:text-base border-amber-300 shadow-[0_4px_0_#78350f] mt-4 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>{loading ? '처리 중...' : tab === 'register' ? '회원가입 완료하고 모험 준비' : '로그인'}</span>
          </button>
        </form>

        <p className="text-[11px] text-stone-400 text-center mt-4">
          이메일 입력 없이 닉네임과 비밀번호만으로 간편하게 기록을 저장할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
