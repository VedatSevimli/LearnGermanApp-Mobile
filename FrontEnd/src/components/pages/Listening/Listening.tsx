import React, { useState } from 'react';
import './Listening.scss';
import {
    getYoutubeVideoByQParam,
    videoDataType
} from '../../../API/Listening/fetchYouTubeVideos';
import { VideoPlayerYouTube } from './youtubeVideoPlayer';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { Verb } from '../../../modules/verbs/verbs.type';
import { useUser } from '../../../context/userContext/userContext';

export const Listening: React.FC<{ verbList: Verb[] }> = (props: {
    verbList: Verb[];
}): JSX.Element => {
    const { userData } = useUser();

    const [videoData, setVideoData] = useState<videoDataType[]>();
    const [isVideoDataLoading, setIsVideoDataLoading] = useState<boolean>();

    //i need it sometimes. it is better to push images into db instead of using postman

    React.useEffect(() => {
        const videoData = async () => {
            setIsVideoDataLoading(true);
            const query = 'A1 deutsche Geschihte';
            const videoData = await getYoutubeVideoByQParam(query);
            setVideoData(videoData);
            setIsVideoDataLoading(false);
        };
        void videoData();
    }, []);

    const learnedWords = userData?.progress.map((p) => p.word);

    return (
        <div className="listening">
            {isVideoDataLoading ? (
                <LoadingOverlay></LoadingOverlay>
            ) : (
                videoData?.map((data) => (
                    <VideoPlayerYouTube
                        key={data.id.videoId}
                        videoData={data}
                        verbList={props.verbList}
                        learnedWords={learnedWords}
                    ></VideoPlayerYouTube>
                ))
            )}
        </div>
    );
};
