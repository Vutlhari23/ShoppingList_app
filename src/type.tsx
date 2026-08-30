export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface Item {
  id: string;
  listId: string;
  name: string;
  createdBy: string | null;
  isChecked?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  cellNo?: string;
}