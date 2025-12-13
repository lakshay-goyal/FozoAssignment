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

export interface RestaurantWithDistance {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    tags: string[];
    latitude: number;
    longitude: number;
    distance: number;
    createdAt: Date;
    updatedAt: Date;
}