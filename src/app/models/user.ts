export interface User {
  id: string;
  username: string;
  hashed_password?: string;
  role: 'admin' | 'user';
  created_at: Date;
}