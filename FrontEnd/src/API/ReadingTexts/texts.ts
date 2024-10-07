import { ITextData } from '../../modules/texts/texts.type';
const baseApiPath = process.env.REACT_APP_API_URL;

export const getReadingTexts = async (textId = 'all'): Promise<ITextData[]> => {
    const response = await fetch(
        `${baseApiPath}get-reading-text?textId=${textId}`,
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
