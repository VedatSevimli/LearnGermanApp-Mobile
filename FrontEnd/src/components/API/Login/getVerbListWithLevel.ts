import { Verb } from '../../modules/verbs/verbs.type';

export enum verbLevelE {
    'A1' = 'A1',
    'A2' = 'A2',
    'B1' = 'B1'
}

export const getVerbList = async ({
    level
}: {
    level: verbLevelE;
}): Promise<Verb[]> => {
    const response = await fetch(
        'http://localhost:5000/api/get-verbs-with-level',
        {
            method: 'POST',
            body: JSON.stringify({ level }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        }
    );
    const verbList = await response.json();
    return verbList.data;
};

export const getWord = async ({ word }: { word: string }): Promise<Verb> => {
    const response = await fetch('http://localhost:5000/api/get-verb', {
        method: 'POST',
        body: JSON.stringify({ word }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
    });
    const verb = await response.json();
    return verb.data;
};
