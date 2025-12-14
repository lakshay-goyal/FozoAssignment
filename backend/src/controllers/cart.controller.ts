import type { Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type {
  AddToCartRequest,
  UpdateCartRequest,
  RemoveFromCartRequest,
  GetCartRequest,
  CartItem,
} from '../types/cart.types';

export const addToCart = async (req: AddToCartRequest, res: Response) => {
  try {
    const { username, menuId, quantity } = req.body;

    if (!username || !menuId || !quantity) {
      const apiError = new ApiError(400, 'Missing required fields: username, menuId, and quantity are required', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    if (quantity < 1) {
      const apiError = new ApiError(400, 'Quantity must be at least 1', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const apiError = new ApiError(404, 'User not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) {
      const apiError = new ApiError(404, 'Menu item not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_menuId: {
          userId: user.id,
          menuId: menuId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          menu: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cart.create({
        data: {
          userId: user.id,
          menuId: menuId,
          quantity: quantity,
        },
        include: {
          menu: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    }

    const cartItemResponse: CartItem = {
      id: cartItem.id,
      menuId: cartItem.menuId,
      quantity: cartItem.quantity,
      menu: {
        id: cartItem.menu.id,
        item_name: cartItem.menu.item_name,
        price: cartItem.menu.price,
        imageUrl: cartItem.menu.imageUrl,
        description: cartItem.menu.description,
        isVeg: cartItem.menu.isVeg,
        restaurantId: cartItem.menu.restaurantId,
        restaurant: {
          id: cartItem.menu.restaurant.id,
          name: cartItem.menu.restaurant.name,
          imageUrl: cartItem.menu.restaurant.imageUrl,
        },
      },
      createdAt: cartItem.createdAt.toISOString(),
      updatedAt: cartItem.updatedAt.toISOString(),
    };

    const apiResponse = new ApiResponse(201, cartItemResponse, 'Item added to cart successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error adding to cart:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const getCart = async (req: GetCartRequest, res: Response) => {
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

    const cartItems = await prisma.cart.findMany({
      where: { userId: user.id },
      include: {
        menu: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const cartItemsResponse: CartItem[] = cartItems.map((item) => ({
      id: item.id,
      menuId: item.menuId,
      quantity: item.quantity,
      menu: {
        id: item.menu.id,
        item_name: item.menu.item_name,
        price: item.menu.price,
        imageUrl: item.menu.imageUrl,
        description: item.menu.description,
        isVeg: item.menu.isVeg,
        restaurantId: item.menu.restaurantId,
        restaurant: {
          id: item.menu.restaurant.id,
          name: item.menu.restaurant.name,
          imageUrl: item.menu.restaurant.imageUrl,
        },
      },
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    const apiResponse = new ApiResponse(200, cartItemsResponse, 'Cart fetched successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error fetching cart:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const updateCart = async (req: UpdateCartRequest, res: Response) => {
  try {
    const { username, cartId, quantity } = req.body;

    if (!username || !cartId || quantity === undefined) {
      const apiError = new ApiError(400, 'Missing required fields: username, cartId, and quantity are required', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    if (quantity < 1) {
      const apiError = new ApiError(400, 'Quantity must be at least 1', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const apiError = new ApiError(404, 'User not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const cartItem = await prisma.cart.findFirst({
      where: { id: cartId, userId: user.id },
    });

    if (!cartItem) {
      const apiError = new ApiError(404, 'Cart item not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const updatedCartItem = await prisma.cart.update({
      where: { id: cartId },
      data: { quantity },
      include: {
        menu: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const cartItemResponse: CartItem = {
      id: updatedCartItem.id,
      menuId: updatedCartItem.menuId,
      quantity: updatedCartItem.quantity,
      menu: {
        id: updatedCartItem.menu.id,
        item_name: updatedCartItem.menu.item_name,
        price: updatedCartItem.menu.price,
        imageUrl: updatedCartItem.menu.imageUrl,
        description: updatedCartItem.menu.description,
        isVeg: updatedCartItem.menu.isVeg,
        restaurantId: updatedCartItem.menu.restaurantId,
        restaurant: {
          id: updatedCartItem.menu.restaurant.id,
          name: updatedCartItem.menu.restaurant.name,
          imageUrl: updatedCartItem.menu.restaurant.imageUrl,
        },
      },
      createdAt: updatedCartItem.createdAt.toISOString(),
      updatedAt: updatedCartItem.updatedAt.toISOString(),
    };

    const apiResponse = new ApiResponse(200, cartItemResponse, 'Cart updated successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error updating cart:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const removeFromCart = async (req: RemoveFromCartRequest, res: Response) => {
  try {
    const { username, cartId } = req.body;

    if (!username || !cartId) {
      const apiError = new ApiError(400, 'Missing required fields: username and cartId are required', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      const apiError = new ApiError(404, 'User not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    const cartItem = await prisma.cart.findFirst({
      where: { id: cartId, userId: user.id },
    });

    if (!cartItem) {
      const apiError = new ApiError(404, 'Cart item not found', []);
      return res.status(apiError.statusCode).json(apiError);
    }

    await prisma.cart.delete({
      where: { id: cartId },
    });

    const apiResponse = new ApiResponse(200, null, 'Item removed from cart successfully');
    return res.status(apiResponse.statusCode).json(apiResponse);
  } catch (err: any) {
    console.error('Error removing from cart:', err);
    const apiError = new ApiError(500, 'Internal server error', []);
    return res.status(apiError.statusCode).json(apiError);
  }
};

