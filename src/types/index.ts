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
  level: string;
  fileUrl?: string;
  status: AwardStatus;
  score: number;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: Array<{
    from: AwardStatus;
    to: AwardStatus;
    by: string;
    at: string;
    reason?: string;
  }>;
}

export interface AuthState {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
