 export interface Item {
  id: string;
  listId: string;
  createdAt: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
}