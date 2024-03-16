import { ITextData } from '../../modules/texts/texts.type';

export const getReadingTexts = async (
    textId: string = 'all'
): Promise<ITextData[]> => {
    const response = await fetch(
        `http://localhost:5000/api/get-reading-text?textId=${textId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        }
    );

    const res = await response.json();
    return res.data;
};
