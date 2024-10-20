import React, { useState } from 'react';
import './chatBot.scss';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
    MessageModel,
    Avatar,
    ConversationHeader,
    VoiceCallButton,
    InfoButton,
    VideoCallButton
} from '@chatscope/chat-ui-kit-react';
import { chatGemini } from '../../API/AI/gemini';
import { defaultConfig } from '../../config/defaultConfig';
import {
    bot_with_bard,
    chatBot,
    kid_bot,
    teeneger_bot,
    times,
    woman_bot_1
} from '../../images/image';
import { getDefConv } from './chatBotUtils';

type ChatBotP = {
    setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
};

export const ChatBot: React.FC<ChatBotP> = (props: ChatBotP) => {
    const { learnedVerbsExample } = defaultConfig();
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState<MessageModel[]>([
        {
            message:
                'Hallo ich bin dein Sprachpartner/in, was möchtest du lernen.',
            sender: 'Bot',
            direction: 'incoming',
            position: 'last'
        }
    ]);
    const [chatHistory, setChatHistory] = useState<
        {
            role: string;
            parts: {
                text: string;
            }[];
        }[]
    >(getDefConv(learnedVerbsExample));
    const [avatar] = useState<string>(
        () =>
            [chatBot, bot_with_bard, kid_bot, woman_bot_1, teeneger_bot][
                Math.round(Math.random() * 4)
            ]
    );

    const handleSend = (message: string): void => {
        //handle message
        const newMessage: MessageModel = {
            message,
            sender: 'User',
            direction: 'outgoing',
            position: 'first'
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);

        setTyping(true);
        void sendToGemini(message);
    };

    const sendToGemini = async (message: string) => {
        try {
            const response = await chatGemini({
                history: chatHistory,
                message
            });

            setChatHistory((oldChatHist) => [
                ...oldChatHist,
                { parts: [{ text: message }], role: 'user' },
                { parts: [{ text: response.data }], role: 'model' }
            ]);

            const newMessage: MessageModel = {
                message: response.data.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong>$1</strong>'
                ),
                sender: 'Bot',
                direction: 'incoming',
                position: 'last'
            };
            setMessages((oldMessages) => [...oldMessages, newMessage]);
        } catch (error) {
            console.log(error);
            setTyping(false);
        } finally {
            setTyping(false);
        }
    };

    return (
        <div className={`chat-bot-wrapper ${props.className}`}>
            <MainContainer className="my-chat-container">
                <ChatContainer>
                    <ConversationHeader>
                        <Avatar name="Emily" src={avatar} />
                        <ConversationHeader.Content
                            info="Active"
                            userName="Bager"
                        />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <InfoButton />
                            <div>
                                <img
                                    className="close-chat"
                                    src={times}
                                    onClick={() => props.setShowChat(false)}
                                ></img>
                            </div>
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList
                        typingIndicator={
                            typing ? (
                                <TypingIndicator content="He is typing.." />
                            ) : null
                        }
                    >
                        {messages.map(
                            ({ direction, position, message, sender }, i) => {
                                return (
                                    <>
                                        <Message
                                            className={`${
                                                sender === 'Bot'
                                                    ? 'avatar-space'
                                                    : ''
                                            }`}
                                            key={i}
                                            avatarSpacer={
                                                direction === 'incoming'
                                            }
                                            model={{
                                                message,
                                                sender,
                                                sentTime:
                                                    Date.now().toLocaleString(),
                                                position,
                                                direction
                                            }}
                                        >
                                            {sender === 'Bot' && (
                                                <Avatar
                                                    key={i}
                                                    name="Mark"
                                                    src={avatar}
                                                    // size="sm"
                                                ></Avatar>
                                            )}
                                        </Message>
                                    </>
                                );
                            }
                        )}
                    </MessageList>
                    <MessageInput
                        placeholder="type message here.."
                        onSend={handleSend}
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    );
};
