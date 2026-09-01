export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export type Item = {
  id: string;
  shoppingListId: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  createdAt: string;
  createdBy: string;                           
};

export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  cellNo?: string;
}