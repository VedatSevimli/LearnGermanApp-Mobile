import React, { useState } from 'react';
import './Listening.scss';
import {
    getYoutubeVideoByQParam,
    videoDataType
} from '../../../API/Listening/fetchYouTubeVideos';
import { VideoPlayerYouTube } from './youtubeVideoPlayer';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
const baseApiPath = process.env.REACT_APP_API_URL;

export const Listening: React.FC = (): JSX.Element => {
    const [responseMessage, setResponseMessage] = useState<string>();
    const [videoData, setVideoData] = useState<videoDataType[]>();
    const [isVideoDataLoading, setIsVideoDataLoading] = useState<boolean>();

    //i need it sometimes. it is better to push images into db instead of using postman
    async function uploadImageUrl() {
        const fileInput = document.getElementById(
            'imageInput2'
        ) as HTMLInputElement;
        const wordInput = document.getElementById('word') as HTMLInputElement;

        const files = fileInput?.files;
        if (!files) {
            return;
        }

        const formData = new FormData();

        formData.append('imageUrl', files[0]);

        try {
            const response = await fetch(
                `${baseApiPath}update-verb-image-url?word=${wordInput?.value}`,
                {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000'
                    },
                    body: formData
                }
            );
            const responseMsg = await response.json();
            setResponseMessage(responseMsg.message as string);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    React.useEffect(() => {
        const videoData = async () => {
            setIsVideoDataLoading(true);
            const query = 'A1 deutsche Geschihte';
            // const currLang = localStorage.getItem('language');
            // if (currLang === 'en') {
            //     query = 'german a1 story';
            // } else if (currLang === 'tr') {
            //     query = 'almanca a1 hikayeler';
            // }
            const videoData = await getYoutubeVideoByQParam(query);
            setVideoData(videoData);
            setIsVideoDataLoading(false);
        };
        void videoData();
    }, []);

    return (
        <div className="listening">
            {isVideoDataLoading ? (
                <LoadingOverlay></LoadingOverlay>
            ) : (
                videoData?.map((data) => (
                    <VideoPlayerYouTube
                        key={data.id.videoId}
                        id={data.id}
                        snippet={data.snippet}
                    ></VideoPlayerYouTube>
                ))
            )}

            {/* Listening page
            <div
                className="upload-image"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <h1>Upload Verb Image</h1>
                <label htmlFor="word">
                    word:
                    <input type="text" id="word" />
                </label>
                <label htmlFor="imageInput2">
                    resim sec
                    <input type="file" id="imageInput2" />
                </label>
                <button
                    className="primaryBtn"
                    style={{ width: '50%' }}
                    onClick={uploadImageUrl}
                >
                    Upload
                </button>
                {responseMessage && <span>{responseMessage}</span>}
            </div> */}
        </div>
    );
};
