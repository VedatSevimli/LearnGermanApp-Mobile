const baseApiPath = 'http://localhost:5000/api/ai/gemini';
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
    const response = await fetch(`${baseApiPath}/chat`, {
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
    const defaultPrompt =
        // eslint-disable-next-line quotes
        "i will give you a text and you have to read the text and create questions from this text. at least 5 questions you have to generate. The questions should be simple sentences. Dont put any thing before the response. it should look like  this example for you: [{ 'id': 0, 'question': 'Ich habe einen Kuchen gemacht', 'options': [ {'text': 'Onlar bir kek yapiyorlar', 'isCorrect': false }, { text': 'Bir kek yaptım.','isCorrect': true   },  { 'text': 'Dün akşam ev ödevi yaptım.','isCorrect': false},{'text': 'Siz bir hata yaptınız.','isCorrect': false}]},{...},{...}, ...], here is the text: " +
        prompt;
    const response = await fetch(`${baseApiPath}`, {
        ...options,
        body: JSON.stringify({ prompt: defaultPrompt })
    });
    const output = await response.json();
    return { output: output.data };
};
