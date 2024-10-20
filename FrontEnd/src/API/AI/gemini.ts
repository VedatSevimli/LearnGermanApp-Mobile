const baseApiPath = 'http://localhost:5000/api/ai/gemini';

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
    const response = await fetch(`${baseApiPath}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ history, message })
    });
    const res = await response.json();
    return res;
};
