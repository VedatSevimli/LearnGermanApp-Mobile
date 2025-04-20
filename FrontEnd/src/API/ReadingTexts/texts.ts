import { ITextData } from '../../modules/texts/texts.type';
import api from '../api';
const baseApiPath = process.env.REACT_APP_API_URL;

export const getReadingTexts = async (textId = 'all'): Promise<ITextData[]> => {
    const response = await api(
        `${baseApiPath}get-reading-text?textId=${textId}`
    );

    return response.data;
};
