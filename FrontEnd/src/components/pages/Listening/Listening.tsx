import React, { useState, useEffect } from 'react';
import './Listening.scss';
import {
    getYoutubeVideoByQParam,
    videoDataType
} from '../../../API/Listening/fetchYouTubeVideos';
import VideoPlayer from './videoPlayer';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
const baseApiPath = process.env.REACT_APP_API_URL;

export const Listening: React.FC = (): JSX.Element => {
    const [responseMessage, setResponseMessage] = useState<string>();
    const [videoData, setVideoData] = useState<videoDataType[]>([]);

    useEffect(() => {
        const fetchVideo = async () => {
            const response = await getYoutubeVideoByQParam();
            setVideoData(response);
        };

        void fetchVideo();
    }, []);

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

    if (!videoData.length) {
        <LoadingOverlay />;
    }

    return (
        <div className="listening">
            {videoData.map((vData, i) => (
                <VideoPlayer key={i} videoData={vData} />
            ))}

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
