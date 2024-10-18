import * as React from 'react';
import { videoDataType } from '../../../API/Listening/fetchYouTubeVideos';

export const VideoPlayerYouTube: React.FC<videoDataType> = (
    videoData: videoDataType
) => {
    const { videoId } = videoData.id;
    const { title, description, thumbnails } = videoData.snippet;

    return (
        <div className="video-container">
            <h2 title={title}>{title}</h2>
            <div className="iframe-container">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            {/* <p>{description}</p>
            <img src={thumbnails.high.url} alt={title} /> */}
        </div>
    );
};
