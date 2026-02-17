
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  size: string;
  gender: 'Men' | 'Women';
  condition: 'Excellent' | 'Good' | 'Fair';
  originalImageUrl: string;
  aiImageUrl?: string;
}

export interface UserClone {
  front: string | null;
  back: string | null;
  threeQuarter: string | null;
  gender: 'Men' | 'Women';
  analysis?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  userId?: string; // Linked user
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  userClone: UserClone;
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
  };
  trackingNumber?: string;
}
