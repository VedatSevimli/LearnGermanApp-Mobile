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

const apiKey = process.env.REACT_APP_API_YOUTUBE_API_KEY;
let _videoData: videoDataType[];

export const getYoutubeVideoByQParam = async (
    query = 'deutsch a1 geschichte',
    maxResult = 12
): Promise<videoDataType[]> => {
    if (!_videoData) {
        const resposne = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&type=video&part=snippet&maxResults=${maxResult}&videoEmbeddable=true&relevanceLanguage=de&videoDuration=medium`
        );
        const videoData = await resposne.json();
        _videoData = videoData.items;
    }
    return _videoData;
};
