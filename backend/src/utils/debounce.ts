const debounceCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000;

export function getDebouncedCache(key: string): any | null {
    const cached = debounceCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
        debounceCache.delete(key);
        return null;
    }

    return cached.data;
}

export function setDebouncedCache(key: string, data: any): void {
    debounceCache.set(key, { data, timestamp: Date.now() });
}

export function clearDebounceCache(): void {
    debounceCache.clear();
}