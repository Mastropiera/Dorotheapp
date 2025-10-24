export interface MemoEntry {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    category?: string;
    tags?: string[];
    color?: string;
  }