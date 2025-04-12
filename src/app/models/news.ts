export interface News {
  id: string;
  title: string;
  author: string;
  content: string;
  created_at: string;
  updated_at?: string;
  image?: string;
  category?: string;
  tags?: string[];
}