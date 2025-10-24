export type Priority = 'baja' | 'moderada' | 'urgente';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: Priority;
  deadline?: {
    value: number;
    unit: 'horas' | 'días' | 'semanas' | 'meses';
  };
}

export interface ShoppingListItem {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

export interface SavedShoppingList {
  id: string;
  date: string;
  items: ShoppingListItem[];
  total: number;
}
