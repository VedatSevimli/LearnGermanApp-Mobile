import { Verb } from '../../modules/verbs/verbs.type';
import { getApiBasePath } from '../../utils/util';
import api from '../api';

export enum verbLevelE {
    'A1' = 'A1',
    'A2' = 'A2',
    'B1' = 'B1'
}

let _level = '';
let _verbList: Verb[];
export const getVerbList = async ({
    level
}: {
    level: verbLevelE;
}): Promise<Verb[]> => {
    if (_level !== level) {
        _level = level;
        const response = await api(
            `${getApiBasePath()}get-verbs-with-level?level=${level}`,
            {
                method: 'GET'
            }
        );

        _verbList = response.data;
        return _verbList;
    }
    return _verbList;
};

export const getWord = async ({ word }: { word: string }): Promise<Verb> => {
    const response = await api(`${getApiBasePath()}get-verb?word=${word}`, {
        method: 'GET'
    });

    return response.data;
};

export const getWords = async ({
    words
}: {
    words: string[];
}): Promise<Verb[]> => {
    const response = await api(`${getApiBasePath()}get-verbs`, {
        method: 'POST',
        body: JSON.stringify({ words })
    });

    return response.data;
};
