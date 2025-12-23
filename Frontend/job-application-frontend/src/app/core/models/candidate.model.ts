export interface Candidate {
  id?: number;
  name: string;
  email: string;
  phone: string;
  position_applied: string;
  status: CandidateStatus;
  created_at?: string;
  updated_at?: string;
}

export type CandidateStatus = 'Applied' | 'Interview' | 'Selected' | 'Rejected';

export interface CandidateResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Candidate[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: any;
}