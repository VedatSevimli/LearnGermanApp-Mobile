import express from 'express';
import { Response } from '../utils/response.js';
import { YoutubeTranscript } from 'youtube-transcript';
import {} from '../middlewares/auth.js';

export const mix = express.Router();

mix.get('/youTube/transcript', async (req, res) => {
    const { videoId, lang } = req.query;
    try {
        const data = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: lang ?? 'de'
        });
        if (data && data.length) {
            return new Response(data, 'Data is sended succesfully').success(
                res
            );
        } else {
            return new Response([], 'No data is avaliable').success(res);
        }
    } catch (err) {
        console.log(err);
        return new Response(null, 'No data is avaliable!').erro500(res);
    }
});

const apiKey = process.env.YOUTUBE_API_KEY ?? '';
mix.get('/youTube/video-info', async (req, res) => {
    const { query, maxResult } = req.query;
    console.log(query, maxResult, apiKey);
    try {
        const resposne = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&type=video&part=snippet&maxResults=${maxResult}&videoEmbeddable=true&relevanceLanguage=de&videoDuration=long&relevanceLanguage=de&order=viewCount`
        );
        const videoData = await resposne.json();

        if (videoData.items) {
            return new Response(
                videoData.items,
                'Data is sended succesfully'
            ).success(res);
        }
    } catch (error) {
        console.log(error);
        return new Response(null, 'No data is avaliable!').erro500(res);
    }
});
