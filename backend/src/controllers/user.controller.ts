import type { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type { CreateUserRequest, UserResponse } from '../types/user.types';

export const createUser = async (req: CreateUserRequest, res: Response) => {
    try {
        const { username, email, latitude, longitude } = req.body;
        console.log(username, email, latitude, longitude);
        if (!username || !email || latitude === undefined || longitude === undefined) {
            const apiError = new ApiError(400, 'Missing required fields: username, email, latitude, and longitude are required', []);
            return res.status(apiError.statusCode).json(apiError);
        }
        if (await prisma.user.findUnique({ where: { username } })) {
            const apiError = new ApiError(400, 'Username already exists', []);
            return res.status(apiError.statusCode).json(apiError);
        }
        if (await prisma.user.findUnique({ where: { email } })) {
            const apiError = new ApiError(400, 'Email already exists', []);
            return res.status(apiError.statusCode).json(apiError);
        }
        const user: UserResponse = await prisma.user.create({
            data: { username, email, latitude, longitude },
        })
        console.log(user);
        const apiResponse = new ApiResponse(201, user, 'User created successfully');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};