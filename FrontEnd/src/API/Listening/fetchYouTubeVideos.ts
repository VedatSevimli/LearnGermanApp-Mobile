import { getCustomConfig } from '../../App';
import { defaultConfig } from '../../config/defaultConfig';
import { getApiBasePath } from '../../utils/util';
import api from '../api';

export type videoDataType = {
    kind?: string;
    etag?: string;
    id: {
        kind: string;
        videoId: string;
    };
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: {
                url: string;
                width: number;
                height: number;
            };
            medium: {
                url: string;
                width: number;
                height: number;
            };
            high: {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        liveBroadcastContent: string;
        publishTime: string;
    };
};

//https://developers.google.com/youtube/v3/docs/search/list
let _query = '';
let _videoData: videoDataType[];
export const getYoutubeVideoByQParam = async (
    query = 'deutsche geschichten A1',
    maxResult = defaultConfig().youTubeVideoCount
): Promise<videoDataType[]> => {
    if (_query !== query) {
        _query = query;
        const resposne = await api(
            `${getApiBasePath()}youTube/video-info?query=${query}&maxResult=${maxResult}`
        );

        _videoData = resposne.data;
        return _videoData;
    }
    return _videoData;
};

export type YoutubeVideoTranscript = {
    text: string;
    duration: number;
    offset: number;
    lang: string;
};

/**
 *
 * @param videoId
 * @returns YoutubeVideoTranscript[]
 */
export const getVideoTranscript = async (
    videoId: string,
    lang = 'de'
): Promise<YoutubeVideoTranscript[]> => {
    const resposne = await api(
        `${getApiBasePath()}youTube/transcript/?videoId=${videoId}&lang=${lang}`
    );

    return resposne.data;
};
