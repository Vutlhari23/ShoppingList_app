 export interface Item {
  id: string;
  listId: string;
  createdAt: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
}
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

