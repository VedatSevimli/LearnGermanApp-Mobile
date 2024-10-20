import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Response } from '../utils/response.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const ai = express.Router();

ai.post('/ai/gemini', async (req, res) => {
    const { message, history } = req.body;
    console.log(message);
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { maxOutputTokens: 1000 }
    });
    const chat = model.startChat({ history });
    let result = await chat.sendMessage(message);
    const data = await result.response.text();
    return new Response(data, 'Data is there').success(res);
});

ai.post('/ai/gpt', async (req, res) => {
    const { message } = req.body;
    console.log(message);
});
