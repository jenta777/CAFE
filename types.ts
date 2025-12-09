export enum Category {
  HOT_COFFEE = 'Hot Coffee',
  ICED_COFFEE = 'Iced Coffee',
  TEA = 'Tea',
  BAKERY = 'Bakery',
  SANDWICHES = 'Sandwiches'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  calories?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  timestamp: number;
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Cash';
}

export interface SalesData {
  name: string;
  sales: number;
}