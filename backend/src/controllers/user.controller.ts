import type { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type { CreateUserRequest, UserResponse } from '../types/user.types';

export const createUser = async (req: CreateUserRequest, res: Response) => {
    try {
        const { username, email, latitude, longitude } = req.body;
        const user: UserResponse = await prisma.user.create({
            data: { username, email, latitude, longitude },
        })

        const apiResponse = new ApiResponse(201, user, 'User created successfully');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};