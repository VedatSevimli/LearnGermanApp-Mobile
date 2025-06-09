import { getCustomConfig } from '../App';
import { getApiKey } from '../utils/util';

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const api = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<{ data: any; success: boolean; message: string }> => {
    const { allowedOrigin } = getCustomConfig();
    const apiKey = getApiKey();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Access-Control-Allow-Origin': allowedOrigin,
        ...options.headers
    };

    try {
        const response = await fetch(endpoint, {
            ...options,
            headers
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized! Invalid API Key.');
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Network or API Error:', (error as Error).message);
        return { data: null, success: false, message: '' };
    }
};

export default api;
