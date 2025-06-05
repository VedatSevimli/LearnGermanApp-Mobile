import { getCustomConfig } from '../../App';
import { getApiBasePath } from '../../utils/util';
import api from '../api';

/**
 /* @temprature Low (0.1 - 0.3)	Outputs more deterministic, focused, and conservative answers.	Factual Q&A, code generation, precision.
/* Medium (0.5 - 0.7)	Balances creativity and coherence (default in many APIs).	Chatbots, general-purpose use.
/* High (0.8 - 1.2)	Increases randomness for creative/divergent ideas (may hallucinate).	Poetry, storytelling, brainstorming.
*/

interface DeepSeekOptions {
    temperature?: number; // 0.1 (strict) to 1.0 (creative)
    max_tokens?: number; // Response length limit
    response_format?: {
        // For structured output (if supported)
        type: 'text' | 'json_object';
    };
    system_message?: string; // Behavior guidance
}

interface DeepSeekResponse {
    response: string | object; // Text or JSON
    error?: string;
}

/**
 * Calls your backend API which interfaces with DeepSeek
 * @param prompt User's input/question
 * @param options Optional parameters like temperature, format, etc.
 * @returns Promise<DeepSeekResponse>
 */
export async function callDeepSeekAPI(
    prompt: string,
    options: DeepSeekOptions = {}
): Promise<DeepSeekResponse> {
    const {
        temperature = 0.7,
        max_tokens = 1000,
        response_format = undefined,
        system_message = 'You are a helpful assistant.'
    } = options;

    try {
        const response = await api(`${getApiBasePath()}ai/deepseek`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                temperature,
                max_tokens,
                response_format,
                system_message
            })
        });

        if (!response.success) {
            throw new Error(`HTTP error! Status: ${response.message}`);
        }

        return { response: response.data };
    } catch (error) {
        console.error('DeepSeek API call failed:', error);
        return {
            response: '',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
