
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

export interface CartItem extends Product {
  quantity: number;
}
