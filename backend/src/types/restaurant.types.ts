import type { Request } from 'express';

export interface GetRestaurantsRequest extends Request {
    body: {
        username: string;
    };
}

export interface RestaurantWithDistance {
    id: number;
    name: string;
    description: string | null;
    tags: string[];
    latitude: number;
    longitude: number;
    distance: number; // in kilometers
    createdAt: Date;
    updatedAt: Date;
}