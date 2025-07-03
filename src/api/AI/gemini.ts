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