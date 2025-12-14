import type { Response } from 'express';
import axios from 'axios';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type {
    AutocompleteRequest,
    ReverseGeocodeRequest,
    AutocompleteResponse,
    ReverseGeocodeResponse,
} from '../types/location.types';
import { getDebouncedCache, setDebouncedCache } from '../utils/debounce';

const API_BASE_URL = 'https://api.olamaps.io/places/v1';
const API_KEY = process.env.OLA_API_KEY!;

export const getLocationSuggestions = async (req: AutocompleteRequest, res: Response) => {
    try {
        const { input } = req.query;

        if (!input || typeof input !== 'string' || input.trim().length === 0) {
            const apiError = new ApiError(400, 'Search input is required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const trimmedInput = input.trim().toLowerCase();
        const cacheKey = `autocomplete:${trimmedInput}`;
        
        // Check debounce cache
        const cachedResult = getDebouncedCache(cacheKey);
        if (cachedResult) {
            const apiResponse = new ApiResponse(200, cachedResult, 'Location suggestions fetched successfully');
            return res.status(apiResponse.statusCode).json(apiResponse);
        }

        const apiUrl = `${API_BASE_URL}/autocomplete`;
        const apiParams = {
            input: trimmedInput,
            radius: 1000,
            strictbounds: true,
            api_key: API_KEY,
        };
        
        // Make API call to OLA Maps
        const response = await axios.get<AutocompleteResponse>(apiUrl, {
            params: apiParams,
            timeout: 5000, // 5 second timeout
        });

        // Handle case-insensitive status check
        const apiStatus = response.data?.status;
        const statusUpper = typeof apiStatus === 'string' ? apiStatus.toUpperCase() : '';
        
        if (statusUpper !== 'OK' && statusUpper !== 'ZERO_RESULTS') {
            const apiError = new ApiError(500, `Failed to fetch location suggestions: ${apiStatus || 'Unknown status'}`, []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const suggestions = response.data.predictions || [];
        
        // Cache the result
        setDebouncedCache(cacheKey, suggestions);

        const apiResponse = new ApiResponse(200, suggestions, 'Location suggestions fetched successfully');
        
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            if (err.code === 'ECONNABORTED') {
                const apiError = new ApiError(504, 'Request timeout. Please try again.', []);
                return res.status(apiError.statusCode).json(apiError);
            }
            if (err.response) {
                const apiError = new ApiError(
                    err.response.status || 500,
                    err.response.data?.error_message || err.response.data?.message || 'Failed to fetch location suggestions',
                    []
                );
                return res.status(apiError.statusCode).json(apiError);
            }
        }

        const apiError = new ApiError(500, `Internal server error: ${err?.message || 'Unknown error'}`, []);
        return res.status(apiError.statusCode).json(apiError);
    }
};

export const reverseGeocodeLocation = async (req: ReverseGeocodeRequest, res: Response) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            const apiError = new ApiError(400, 'Latitude and longitude are required', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            const apiError = new ApiError(400, 'Invalid latitude or longitude', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        // Check cache
        const cacheKey = `reverse:${latitude.toFixed(4)}:${longitude.toFixed(4)}`;
        const cachedResult = getDebouncedCache(cacheKey);
        if (cachedResult) {
            const apiResponse = new ApiResponse(200, cachedResult, 'Reverse geocode successful');
            return res.status(apiResponse.statusCode).json(apiResponse);
        }

        // Make API call to OLA Maps
        const response = await axios.get(`${API_BASE_URL}/reverse-geocode`, {
            params: {
                latlng: `${latitude},${longitude}`,
                api_key: API_KEY,
            },
            timeout: 5000,
        });

        // Try different response structures
        let result = response.data?.results?.[0];
        if (!result && response.data?.result) {
            result = response.data.result;
        }
        if (!result && Array.isArray(response.data) && response.data.length > 0) {
            result = response.data[0];
        }
        if (!result && response.data) {
            result = response.data;
        }

        if (!result) {
            const apiError = new ApiError(404, 'No address found for the given coordinates', []);
            return res.status(apiError.statusCode).json(apiError);
        }

        const addressComponents = result.address_components || [];
        const city = addressComponents[4]?.long_name || 
                    addressComponents.find((ac: any) => ac.types?.includes('locality'))?.long_name || 
                    result.city ||
                    'Unknown City';
        const state = addressComponents[1]?.long_name || 
                     addressComponents.find((ac: any) => ac.types?.includes('administrative_area_level_1'))?.long_name || 
                     result.state ||
                     'Unknown State';
        const address = result.formatted_address || 
                       result.address || 
                       `${city}, ${state}` ||
                       `${latitude}, ${longitude}`;

        const reverseGeocodeResponse: ReverseGeocodeResponse = {
            address,
            city,
            state,
            latitude,
            longitude,
        };

        // Cache the result
        setDebouncedCache(cacheKey, reverseGeocodeResponse);

        const apiResponse = new ApiResponse(200, reverseGeocodeResponse, 'Reverse geocode successful');
        return res.status(apiResponse.statusCode).json(apiResponse);
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            if (err.code === 'ECONNABORTED') {
                const apiError = new ApiError(504, 'Request timeout. Please try again.', []);
                return res.status(apiError.statusCode).json(apiError);
            }
            if (err.response) {
                const apiError = new ApiError(
                    err.response.status || 500,
                    err.response.data?.error_message || 'Failed to reverse geocode',
                    []
                );
                return res.status(apiError.statusCode).json(apiError);
            }
        }

        const apiError = new ApiError(500, 'Internal server error', []);
        return res.status(apiError.statusCode).json(apiError);
    }
};