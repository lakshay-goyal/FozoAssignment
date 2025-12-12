import type { Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type { GetRestaurantsRequest, GetRestaurantByIdRequest, RestaurantWithDistance } from '../types/restaurant.types';
import { calculateHaversineDistance } from '../utils/distance';

export const getRestaurants = async (req: GetRestaurantsRequest, res: Response) => {
    try {
        const { username } = req.body;

        if (!username) {
            const apiError = new ApiError(400, 'Username is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                latitude: true,
                longitude: true,
            },
        });

        if (!user) {
            const apiError = new ApiError(404, 'User not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch all restaurants
        const restaurants = await prisma.restaurant.findMany();

        // Calculate distance for each restaurant and return the restaurants with the distance
        const restaurantsWithDistance: RestaurantWithDistance[] = restaurants.map((restaurant) => {
            const distance = calculateHaversineDistance(
                user.latitude,
                user.longitude,
                restaurant.latitude,
                restaurant.longitude
            );

            return {
                ...restaurant,
                distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
            };
        });

        // Sort restaurants by distance
        restaurantsWithDistance.sort((a, b) => a.distance - b.distance);

        const apiResponse = new ApiResponse(
            200,
            restaurantsWithDistance,
            'Restaurants fetched and sorted by distance successfully'
        );
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};

export const getRestaurantById = async (req: GetRestaurantByIdRequest, res: Response) => {
    try {
        const { username } = req.body;
        const { restaurantId } = req.params;

        if (!username) {
            const apiError = new ApiError(400, 'Username is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        if (!restaurantId) {
            const apiError = new ApiError(400, 'Restaurant ID is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const restaurantIdNum = parseInt(restaurantId, 10);
        if (isNaN(restaurantIdNum)) {
            const apiError = new ApiError(400, 'Invalid restaurant ID', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                latitude: true,
                longitude: true,
            },
        });

        if (!user) {
            const apiError = new ApiError(404, 'User not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch restaurant by ID
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantIdNum },
        });

        if (!restaurant) {
            const apiError = new ApiError(404, 'Restaurant not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Calculate distance between user and restaurant
        const distance = calculateHaversineDistance(
            user.latitude,
            user.longitude,
            restaurant.latitude,
            restaurant.longitude
        );

        // Return restaurant data with distance
        const restaurantWithDistance: RestaurantWithDistance = {
            ...restaurant,
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        };

        const apiResponse = new ApiResponse(
            200,
            restaurantWithDistance,
            'Restaurant fetched successfully'
        );
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};