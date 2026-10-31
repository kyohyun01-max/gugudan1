export type GameMode = 'NORMAL' | 'HARD';

export type ScreenState = 'INTRO' | 'STORY' | 'BATTLE' | 'GAME_CLEAR' | 'GAME_OVER';

export type HitRating = 'PERFECT_PARRY' | 'GUARD_COUNTER' | 'MISS' | 'BLOCKED';

export type SkillDanger = 'NORMAL' | 'STRONG' | 'ULTIMATE';

export interface MonsterSkill {
  id: string;
  name: string;
  danger: SkillDanger;
  timeLimit: number; // in seconds, shorter for stronger skills & higher stages
  damage: number;
  description: string;
  particleColor: string;
}

export interface QuizQuestion {
  id: string;
  dan: number;
  multiplier: number;
  correctAnswer: number;
  options: number[]; // 4 options
  timeLimit: number; // dynamically bound to the current monster skill
  skill: MonsterSkill;
}

export type ItemType = 'POTION' | 'SWORD' | 'HOURGLASS' | 'SHIELD';

export interface InventoryItem {
  id: ItemType;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface MonsterConfig {
  stage: number;
  name: string;
  title: string;
  maxHp: number;
  baseAttack: number;
  spriteId: 'slime' | 'goblin' | 'golem' | 'skeleton' | 'boss' | 'hilla' | 'von_leon' | 'arkarium' | 'magnus' | 'black_mage';
  color: string;
  dialogueOnAppear: string;
  skills: MonsterSkill[];
}

export interface IncorrectRecord {
  id: string;
  dan: number;
  multiplier: number;
  correctAnswer: number;
  playerAnswer?: number;
  isTimeout: boolean;
  skillName?: string;
}

export interface GameSummary {
  mode: GameMode;
  selectedDan?: number;
  totalTimeSeconds: number;
  totalAnswered: number;
  correctCount: number;
  criticalCount: number;
  maxCombo: number;
  titleAwarded?: string;
  incorrectList: IncorrectRecord[];
}
