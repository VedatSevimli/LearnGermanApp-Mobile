import { ITextData } from '../../modules/texts/texts.type';
import { getApiBasePath } from '../../utils/util';
import api from '../api';

export const getReadingTexts = async (textId = 'all'): Promise<ITextData[]> => {
    const response = await api(
        `${getApiBasePath()}get-reading-text?textId=${textId}`
    );

    return response.data;
};
