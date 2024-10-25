import express from 'express';
import { Response } from '../utils/response.js';
import { YoutubeTranscript } from 'youtube-transcript';

export const mix = express.Router();

mix.get('/youTube/transcript', async (req, res) => {
    const { videoId, lang } = req.query;
    try {
        const data = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: lang ?? 'de'
        });
        if (data) {
            return new Response(data, 'Data is sended succesfully').success(
                res
            );
        }
    } catch (err) {
        return new Response(null, 'No data is avaliable!').erro500(res);
    }
});
