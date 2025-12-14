import type { Request } from 'express';

export interface AddToCartRequest extends Request {
  body: {
    username: string;
    menuId: number;
    quantity: number;
  };
}

export interface UpdateCartRequest extends Request {
  body: {
    username: string;
    cartId: number;
    quantity: number;
  };
}

export interface RemoveFromCartRequest extends Request {
  body: {
    username: string;
    cartId: number;
  };
}

export interface GetCartRequest extends Request {
  body: {
    username: string;
  };
}

export interface CartItem {
  id: number;
  menuId: number;
  quantity: number;
  menu: {
    id: number;
    item_name: string;
    price: number;
    imageUrl: string | null;
    description: string | null;
    isVeg: boolean;
    restaurantId: number;
    restaurant: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  };
  createdAt: string;
  updatedAt: string;
}

