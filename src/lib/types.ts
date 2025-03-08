
export interface ScreenTimeEntry {
  id: string;
  date: string;
  minutes: number;
  screenshotUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number; // Target minutes to reduce
  duration: 'daily' | 'weekly';
  completed: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}
