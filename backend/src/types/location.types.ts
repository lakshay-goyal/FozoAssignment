import type { Request } from 'express';

export interface AutocompleteRequest extends Request {
    query: {
        input: string;
    };
}

export interface ReverseGeocodeRequest extends Request {
    query: {
        lat: string;
        lng: string;
    };
}

export interface LocationSuggestion {
    place_id: string;
    description: string;
    structured_formatting?: {
        main_text: string;
        secondary_text: string;
    };
    geometry?: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

export interface AutocompleteResponse {
    predictions: LocationSuggestion[];
    status: string;
}

export interface ReverseGeocodeResponse {
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}