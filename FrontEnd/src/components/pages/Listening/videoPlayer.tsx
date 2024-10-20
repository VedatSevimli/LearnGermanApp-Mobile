import React from 'react';
import { videoDataType } from '../../../API/Listening/fetchYouTubeVideos';

type VideoPlayerP = {
    videoData: videoDataType;
};
const VideoPlayer: React.FC<VideoPlayerP> = ({ videoData }) => {
    const { videoId } = videoData.id;
    const { title, description, thumbnails } = videoData.snippet;

    return (
        <div className="video-container">
            <h2>{title}</h2>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            {/* <p>{description}</p>
      <img src={thumbnails.high.url} alt={title} /> */}
        </div>
    );
};

export default VideoPlayer;
