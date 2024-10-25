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

const baseApiPath = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_YOUTUBE_API_KEY;

//https://developers.google.com/youtube/v3/docs/search/list
let _query = '';
let _videoData: videoDataType[];
export const getYoutubeVideoByQParam = async (
    query = 'deutsche geschichten A1',
    maxResult = 2
): Promise<videoDataType[]> => {
    if (_query !== query) {
        _query = query;
        const resposne = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&type=video&part=snippet&maxResults=${maxResult}&videoEmbeddable=true&relevanceLanguage=de&videoDuration=long&relevanceLanguage=de&order=viewCount`
        );
        const videoData = await resposne.json();
        _videoData = videoData.items;
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
    const resposne = await fetch(
        `${baseApiPath}/youTube/transcript/?videoId=${videoId}&lang=${lang}`
    );
    const videoData = await resposne.json();
    return videoData.data;
};
