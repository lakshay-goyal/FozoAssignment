import type { Request } from 'express';

export interface CreateUserRequest extends Request {
    body: {
        username: string;
        email: string;
        latitude: number;
        longitude: number;
    };
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}

