import type { Request } from 'express';

export interface GetRestaurantsRequest extends Request {
    body: {
        username: string;
    };
}

export interface GetRestaurantByIdRequest extends Request {
    params: {
        restaurantId: string;
    };
    body: {
        username: string;
    };
}

export interface MenuItem {
    id: number;
    item_name: string;
    price: number;
    imageUrl: string | null;
    description: string | null;
    isVeg: boolean;
    restaurantId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface RestaurantWithDistance {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    tags: string[];
    latitude: number;
    longitude: number;
    distance: number;
    menu?: MenuItem[];
    createdAt: Date;
    updatedAt: Date;
}