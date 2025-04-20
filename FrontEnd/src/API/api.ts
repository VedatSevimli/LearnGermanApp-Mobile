const API_KEY = process.env.REACT_APP_API_KEY as string;
const allowedOrigins = process.env.REACT_APP_API_ALLOWED_ORIGINS as string;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const api = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<{ data: any; success: boolean; message: string }> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Access-Control-Allow-Origin': allowedOrigins,
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
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Network or API Error:', (error as Error).message);
        throw error;
    }
};

export default api;
