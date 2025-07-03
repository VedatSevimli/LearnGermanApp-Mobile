import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Animated, Easing } from 'react-native';
import { chatGemini } from '../api/AI/gemini';
import { getDefConv } from '../utils/util';

const BOT_AVATARS = [
  require('../assets/chatBotWithoutBg.png'),
  require('../assets/bot_with_bard.jpeg'),
  require('../assets/kid_bot.webp'),
  require('../assets/teeneger_bot.webp'),
  require('../assets/woman_bot_1.webp'),
];

const ChatBot = ({ learnedVerbsExample = [] }: { learnedVerbsExample?: string[] }) => {
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { message: 'Hallo ich bin dein Sprachpartner/in, was möchtest du lernen.', sender: 'Bot' }
  ]);
  const [chatHistory, setChatHistory] = useState(getDefConv(learnedVerbsExample));
  const flatListRef = useRef<FlatList>(null);
  const [botAvatar, setBotAvatar] = useState(BOT_AVATARS[0]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageFadeAnims = useRef<Animated.Value[]>([new Animated.Value(1)]).current;

  useEffect(() => {
    // Randomly select a bot avatar on mount
    const idx = Math.floor(Math.random() * BOT_AVATARS.length);
    setBotAvatar(BOT_AVATARS[idx]);
    // Animate chat window fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  useEffect(() => {
    // Animate the last bot message fade-in
    if (messages.length > messageFadeAnims.length) {
      messageFadeAnims.push(new Animated.Value(0));
    }
    if (messages[messages.length - 1]?.sender === 'Bot') {
      Animated.timing(messageFadeAnims[messages.length - 1], {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { message: input, sender: 'User' };
    setMessages(prev => [...prev, userMessage]);
    setTyping(true);
    try {
      const response = await chatGemini({ history: chatHistory, message: input });
      if (response.success) {
        setChatHistory(old => [
          ...old,
          { parts: [{ text: input }], role: 'user' },
          { parts: [{ text: response.data }], role: 'model' }
        ]);
        setMessages(prev => [...prev, { message: response.data, sender: 'Bot' }]);
      } else {
        setMessages(prev => [...prev, { message: 'Sorry, something went wrong! 😔', sender: 'Bot' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { message: 'Sorry, something went wrong! 😔', sender: 'Bot' }]);
    } finally {
      setTyping(false);
      setInput('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderItem = ({ item, index }: { item: { message: string; sender: string }, index: number }) => {
    if (item.sender === 'Bot') {
      return (
        <Animated.View style={[styles.messageRow, styles.botRow, { opacity: messageFadeAnims[index] || 1 }]}> 
          <Image source={botAvatar} style={styles.avatar} />
          <View style={[styles.bubble, styles.botBubble]}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        </Animated.View>
      );
    }
    return (
      <View style={[styles.messageRow, styles.userRow]}>
        <View style={[styles.bubble, styles.userBubble]}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        {typing && (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" color="#f4631e" />
            <Text style={styles.typingText}>Bot is typing...</Text>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type message here..."
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16, paddingBottom: 0 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  botRow: {},
  userRow: { justifyContent: 'flex-end' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  botBubble: { backgroundColor: '#f6f6f6', marginRight: 'auto' },
  userBubble: { backgroundColor: '#f4631e', marginLeft: 'auto' },
  messageText: { color: '#222', fontSize: 16 },
  typingRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 44, marginBottom: 8 },
  typingText: { marginLeft: 8, color: '#888' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, fontSize: 16, backgroundColor: '#fafafa' },
  sendBtn: { marginLeft: 8, backgroundColor: '#f4631e', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ChatBot; 