import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Response } from '../utils/response.js';
import { authenticateAPIKey } from '../middlewares/auth.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const ai = express.Router();

ai.post('/ai/gemini/chat', authenticateAPIKey, async (req, res) => {
    const { message, history } = req.body;

    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { maxOutputTokens: 1000 }
    });
    const chat = model.startChat({ history });
    let result = await chat.sendMessage(message);
    const data = await result.response.text();
    return new Response(data, 'Data is there').success(res);
});

ai.post('/ai/gemini', authenticateAPIKey, async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const data = await result.response.text();

        return new Response(data, 'Data is there').success(res);
    } catch (error) {
        return new Response(null, 'No data is avaliable!').erro500(res);
    }
});

ai.post('/ai/gpt', async (req, res) => {
    const { message } = req.body;
    console.log(message);
});
