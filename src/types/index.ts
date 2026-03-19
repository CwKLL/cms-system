export type Role = 'admin' | 'user' | 'guest';
export type AwardStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  school: string;
  avatarInitials: string;
}

export interface Award {
  id: string;
  userId: string;
  userName: string;
  school: string;
  title: string;
  description: string;
  category: string;
  level: string; // e.g. "International", "National", "Regional", "School"
  fileUrl?: string; // mock URL, no real file yet
  status: AwardStatus;
  score: number; // assigned by admin on approval
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  school: string;
  totalScore: number;
  approvedAwards: number;
}

export interface AuthState {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
