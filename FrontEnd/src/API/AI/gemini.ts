const baseApiPath = process.env.REACT_APP_API_URL;
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    }
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
    const response = await fetch(`${baseApiPath}ai/gemini/chat`, {
        ...options,
        body: JSON.stringify({ history, message })
    });
    const res = await response.json();
    return res;
};

/**
 *
 * @param propmt
 * @returns output string
 */
export const geminiPrompt = async (
    prompt: string
): Promise<{ output: string }> => {
    const response = await fetch(`${baseApiPath}ai/gemini`, {
        ...options,
        body: JSON.stringify({ prompt })
    });
    const output = await response.json();
    return { output: output.data };
};
