import { getApiBasePath } from '../../utils/util';
import api from '../api';

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};

export const geminiPrompt = async (
    prompt: string
): Promise<{ output: string }> => {
    const response = await api(`${getApiBasePath()}/ai/gemini`, {
        ...options,
        body: JSON.stringify({ prompt })
    });
    return { output: response.data };
};

export const chatGemini = async ({
    history,
    message
}: {
    history: {
        role: string;
        parts: {
            text: string;
        }[];
    }[];
    message: string;
}): Promise<any> => {
    const response = await api(`${getApiBasePath()}/ai/gemini/chat`, {
        ...options,
        body: JSON.stringify({ history, message })
    });
    return response;
}; 