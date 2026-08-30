export type Item = {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  createdAt: string;
};

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

