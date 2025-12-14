import type { Request } from 'express';

export interface CreateAddressRequest extends Request {
    body: {
        username: string;
        label: string;
        address: string;
        phoneNumber?: string;
        latitude: number;
        longitude: number;
        isDefault?: boolean;
    };
}

export interface GetAddressesRequest extends Request {
    body: {
        username: string;
        currentLatitude?: number;
        currentLongitude?: number;
    };
}

export interface UpdateAddressRequest extends Request {
    params: {
        addressId: string;
    };
    body: {
        username: string;
        label?: string;
        address?: string;
        phoneNumber?: string;
        latitude?: number;
        longitude?: number;
        isDefault?: boolean;
    };
}

export interface DeleteAddressRequest extends Request {
    params: {
        addressId: string;
    };
    body: {
        username: string;
    };
}

export interface AddressResponse {
    id: number;
    userId: number;
    label: string;
    address: string;
    phoneNumber: string | null;
    latitude: number;
    longitude: number;
    isDefault: boolean;
    distance?: number;
    createdAt: Date;
    updatedAt: Date;
}