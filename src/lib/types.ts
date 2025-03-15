
export interface ScreenTimeEntry {
  id: string;
  date: string;
  minutes: number;
  screenshotUrl?: string;
  user_id?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number; // Target minutes to reduce
  duration: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  pointsAwarded: number;
  totalPoints: number;
  active?: boolean;
  progress?: number;
  completedBy?: string[]; // Array of user IDs who completed the challenge
  completionDate?: string; // Date when the challenge was completed
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  progress?: number; // Percentage progress towards unlocking the reward
  requiredScreenshots?: number; // Number of screenshots needed to unlock
}

export interface UserPoints {
  current: number;
  target: number;
}
