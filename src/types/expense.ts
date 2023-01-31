export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  tagIds: string[];
  description?: string;
  amount: number;
  date: string;
}
