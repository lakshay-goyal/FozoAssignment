import type { Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type {
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
  GetWishlistRequest,
  WishlistItem,
} from '../types/wishlist.types';

export const addToWishlist = async (req: AddToWishlistRequest, res: Response) => {
  try {
    const { username, restaurantId } = req.body;

    if (!username || !restaurantId) {
      const apiError = new ApiError(400, 'Missing required fields: username and restaurantId are required', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const apiError = new ApiError(404, 'User not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) {
      const apiError = new ApiError(404, 'Restaurant not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    // Check if already in wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId: restaurantId,
        },
      },
    });

    if (existingWishlistItem) {
      const apiError = new ApiError(400, 'Restaurant already in wishlist', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        restaurantId: restaurantId,
      },
      include: {
        restaurant: true,
      },
    });

    const wishlistItemResponse: WishlistItem = {
      id: wishlistItem.id,
      restaurantId: wishlistItem.restaurantId,
      restaurant: {
        id: wishlistItem.restaurant.id,
        name: wishlistItem.restaurant.name,
        description: wishlistItem.restaurant.description,
        imageUrl: wishlistItem.restaurant.imageUrl,
        tags: wishlistItem.restaurant.tags,
        latitude: wishlistItem.restaurant.latitude,
        longitude: wishlistItem.restaurant.longitude,
      },
      createdAt: wishlistItem.createdAt.toISOString(),
      updatedAt: wishlistItem.updatedAt.toISOString(),
    };

    const apiResponse = new ApiResponse(201, wishlistItemResponse, 'Restaurant added to wishlist successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error adding to wishlist:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const removeFromWishlist = async (req: RemoveFromWishlistRequest, res: Response) => {
  try {
    const { username, restaurantId } = req.body;

    if (!username || !restaurantId) {
      const apiError = new ApiError(400, 'Missing required fields: username and restaurantId are required', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const apiError = new ApiError(404, 'User not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId: restaurantId,
        },
      },
    });

    if (!wishlistItem) {
      const apiError = new ApiError(404, 'Restaurant not found in wishlist', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    await prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    const apiResponse = new ApiResponse(200, null, 'Restaurant removed from wishlist successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error removing from wishlist:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const getWishlist = async (req: GetWishlistRequest, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) {
      const apiError = new ApiError(400, 'Username is required', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const apiError = new ApiError(404, 'User not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const wishlistItemsResponse: WishlistItem[] = wishlistItems.map((item) => ({
      id: item.id,
      restaurantId: item.restaurantId,
      restaurant: {
        id: item.restaurant.id,
        name: item.restaurant.name,
        description: item.restaurant.description,
        imageUrl: item.restaurant.imageUrl,
        tags: item.restaurant.tags,
        latitude: item.restaurant.latitude,
        longitude: item.restaurant.longitude,
      },
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    const apiResponse = new ApiResponse(200, wishlistItemsResponse, 'Wishlist fetched successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error fetching wishlist:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

