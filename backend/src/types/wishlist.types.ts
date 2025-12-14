import type { Request } from 'express';

export interface AddToWishlistRequest extends Request {
  body: {
    username: string;
    restaurantId: number;
  };
}

export interface RemoveFromWishlistRequest extends Request {
  body: {
    username: string;
    restaurantId: number;
  };
}

export interface GetWishlistRequest extends Request {
  body: {
    username: string;
  };
}

export interface WishlistItem {
  id: number;
  restaurantId: number;
  restaurant: {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    tags: string[];
    latitude: number;
    longitude: number;
    distance?: number;
  };
  createdAt: string;
  updatedAt: string;
}

