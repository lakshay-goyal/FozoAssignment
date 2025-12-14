import type { Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { calculateHaversineDistance } from '../utils/distance';
import type {
    CreateAddressRequest,
    GetAddressesRequest,
    UpdateAddressRequest,
    DeleteAddressRequest,
    AddressResponse,
} from '../types/address.types';

export const createAddress = async (req: CreateAddressRequest, res: Response) => {
    try {
        const { username, label, address, phoneNumber, latitude, longitude, isDefault } = req.body;

        if (!username || !label || !address || latitude === undefined || longitude === undefined) {
            const apiError = new ApiError(
                400,
                'Missing required fields: username, label, address, latitude, and longitude are required',
                []
            );
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!user) {
            const apiError = new ApiError(404, 'User not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // If this is set as default, unset all other default addresses
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: user.id,
                label,
                address,
                phoneNumber: phoneNumber || null,
                latitude,
                longitude,
                isDefault: isDefault || false,
            },
        });

        const addressResponse: AddressResponse = {
            id: newAddress.id,
            userId: newAddress.userId,
            label: newAddress.label,
            address: newAddress.address,
            phoneNumber: newAddress.phoneNumber,
            latitude: newAddress.latitude,
            longitude: newAddress.longitude,
            isDefault: newAddress.isDefault,
            createdAt: newAddress.createdAt,
            updatedAt: newAddress.updatedAt,
        };

        const apiResponse = new ApiResponse(201, addressResponse, 'Address created successfully');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        console.error('Error creating address:', err);
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};

export const getAddresses = async (req: GetAddressesRequest, res: Response) => {
    try {
        const { username, currentLatitude, currentLongitude } = req.body;

        if (!username) {
            const apiError = new ApiError(400, 'Username is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!user) {
            const apiError = new ApiError(404, 'User not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch all addresses for the user
        const addresses = await prisma.address.findMany({
            where: { userId: user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        // Calculate distances if current location is provided
        const addressesResponse: AddressResponse[] = addresses.map((addr) => {
            const addressResponse: AddressResponse = {
                id: addr.id,
                userId: addr.userId,
                label: addr.label,
                address: addr.address,
                phoneNumber: addr.phoneNumber,
                latitude: addr.latitude,
                longitude: addr.longitude,
                isDefault: addr.isDefault,
                createdAt: addr.createdAt,
                updatedAt: addr.updatedAt,
            };

            // Calculate distance if current location is provided
            if (currentLatitude !== undefined && currentLongitude !== undefined) {
                const distanceKm = calculateHaversineDistance(
                    currentLatitude,
                    currentLongitude,
                    addr.latitude,
                    addr.longitude
                );
                addressResponse.distance = Math.round(distanceKm * 1000); // Convert to meters
            }

            return addressResponse;
        });

        const apiResponse = new ApiResponse(200, addressesResponse, 'Addresses fetched successfully');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        console.error('Error fetching addresses:', err);
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};

export const updateAddress = async (req: UpdateAddressRequest, res: Response) => {
    try {
        const { addressId } = req.params;
        const { username, label, address, phoneNumber, latitude, longitude, isDefault } = req.body;

        if (!username) {
            const apiError = new ApiError(400, 'Username is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const addressIdNum = parseInt(addressId, 10);
        if (isNaN(addressIdNum)) {
            const apiError = new ApiError(400, 'Invalid address ID', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!user) {
            const apiError = new ApiError(404, 'User not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Check if address exists and belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: { id: addressIdNum, userId: user.id },
        });

        if (!existingAddress) {
            const apiError = new ApiError(404, 'Address not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // If this is set as default, unset all other default addresses
        if (isDefault === true) {
            await prisma.address.updateMany({
                where: { userId: user.id, isDefault: true, id: { not: addressIdNum } },
                data: { isDefault: false },
            });
        }

        // Update address
        const updateData: any = {};
        if (label !== undefined) updateData.label = label;
        if (address !== undefined) updateData.address = address;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;
        if (isDefault !== undefined) updateData.isDefault = isDefault;

        const updatedAddress = await prisma.address.update({
            where: { id: addressIdNum },
            data: updateData,
        });

        const addressResponse: AddressResponse = {
            id: updatedAddress.id,
            userId: updatedAddress.userId,
            label: updatedAddress.label,
            address: updatedAddress.address,
            phoneNumber: updatedAddress.phoneNumber,
            latitude: updatedAddress.latitude,
            longitude: updatedAddress.longitude,
            isDefault: updatedAddress.isDefault,
            createdAt: updatedAddress.createdAt,
            updatedAt: updatedAddress.updatedAt,
        };

        const apiResponse = new ApiResponse(200, addressResponse, 'Address updated successfully');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        console.error('Error updating address:', err);
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};

export const deleteAddress = async (req: DeleteAddressRequest, res: Response) => {
    try {
        const { addressId } = req.params;
        const { username } = req.body;

        if (!username) {
            const apiError = new ApiError(400, 'Username is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const addressIdNum = parseInt(addressId, 10);
        if (isNaN(addressIdNum)) {
            const apiError = new ApiError(400, 'Invalid address ID', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Fetch user by username
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!user) {
            const apiError = new ApiError(404, 'User not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Check if address exists and belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: { id: addressIdNum, userId: user.id },
        });

        if (!existingAddress) {
            const apiError = new ApiError(404, 'Address not found', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Delete address
        await prisma.address.delete({
            where: { id: addressIdNum },
        });

        const apiResponse = new ApiResponse(200, null, 'Address deleted successfully');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        console.error('Error deleting address:', err);
        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};