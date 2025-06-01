import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Response } from '../utils/response.js';
import { authenticateAPIKey } from '../middlewares/auth.js';
import { APIError } from '../utils/error.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEEPSEEK_API_KEY2 = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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

ai.post('/ai/deepseek', async (req, res) => {
    const { prompt, temperature, max_tokens, response_format, system_message } =
        req.body;

    if (!prompt) {
        return new Response(null, 'Prompt is required!').err400(res);
    }

    try {
        const aiResponse = await queryDeepSeek({
            prompt,
            temperature,
            max_tokens,
            response_format,
            system_message
        });
        return new Response(aiResponse, 'Data is there').success(res);
    } catch (error) {
        return new Response(null, 'No data is avaliable!').err400(res);
    }
});

const queryDeepSeek = async ({
    prompt,
    temperature,
    max_tokens,
    response_format,
    system_message
}) => {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${DEEPSEEK_API_KEY2}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature,
                max_tokens,
                response_format,
                system_message
            })
        });

        if (!response.ok) {
            return new APIError('something went wrong');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('DeepSeek API Error:', error.message);
    }
};
