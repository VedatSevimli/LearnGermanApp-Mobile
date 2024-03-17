import { Verb } from '../../modules/verbs/verbs.type';

export enum verbLevelE {
    'A1' = 'A1',
    'A2' = 'A2',
    'B1' = 'B1'
}
const baseAPiPath = 'http://localhost:5000/api/';
const allowedOrigins = ['http://localhost:3000'];
export const getVerbList = async ({
    level
}: {
    level: verbLevelE;
}): Promise<Verb[]> => {
    const response = await fetch(
        `${baseAPiPath}get-verbs-with-level?level=${level}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': allowedOrigins.join('')
            }
        }
    );
    const verbList = await response.json();
    return verbList.data;
};

export const getWord = async ({ word }: { word: string }): Promise<Verb> => {
    const response = await fetch(`${baseAPiPath}get-verb?word=${word}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.join('')
        }
    });
    const verb = await response.json();
    return verb.data;
};

export const getWords = async ({
    words
}: {
    words: string[];
}): Promise<Verb[]> => {
    const response = await fetch('http://localhost:5000/api/get-verbs', {
        method: 'POST',
        body: JSON.stringify({ words }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigins.join('')
        }
    });
    const verb = await response.json();
    return verb.data;
};
