import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import QuizScreen from '../screens/QuizScreen';
import ReadingScreen from '../screens/ReadingScreen';
import WordsScreen from '../screens/WordsScreen';
import { Ionicons } from '@expo/vector-icons';
import LoginIcon from '../assets/LoginIcon';
import QuizIcon from '../assets/QuizIcon';
import ReadingIcon from '../assets/ReadingIcon';
import { Image, Modal, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/HomeIcon';
import VerbIcon from '../assets/VerbIcon';
import ListeningIcon from '../assets/ListeningIcon';
import ChatBot from '../components/ChatBot';
import WordDetailsScreen from '../screens/WordDetailsScreen';
import { createStackNavigator } from '@react-navigation/stack';

export type RootTabParamList = {
  Home: undefined;
  Words: undefined;
  Reading: undefined;
  Listening: undefined;
  Quiz: undefined;
  Login: undefined;
};

export type WordsStackParamList = {
  WordsList: undefined;
  WordDetails: { word: string };
};

const Tab = createBottomTabNavigator();
const WordsStack = createStackNavigator<WordsStackParamList>();

const chatBotIcon = require('../assets/chatBotWithoutBg.png');

function WordsStackScreen() {
  return (
    <WordsStack.Navigator>
      <WordsStack.Screen name="WordsList" component={WordsScreen} options={{ headerShown: false }} />
      <WordsStack.Screen name="WordDetails" component={WordDetailsScreen} options={{ title: 'Word Details' }} />
    </WordsStack.Navigator>
  );
}

const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const [showChat, setShowChat] = useState(false);
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#f4631e',
              borderTopWidth: 0,
              height: 62 + insets.bottom,
              paddingBottom: insets.bottom || 6,
              paddingTop: 6,
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#fff',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <HomeIcon width={28} height={28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Words"
            component={WordsStackScreen}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <VerbIcon width={28} height={28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Reading"
            component={ReadingScreen}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <ReadingIcon width={28} height={28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Listening"
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <ListeningIcon width={28} height={28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <QuizIcon width={28} height={28} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Login"
            component={LoginScreen}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <LoginIcon width={28} height={28} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        {/* Floating ChatBot Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowChat(true)}
          activeOpacity={0.8}
        >
          <Image source={chatBotIcon} style={styles.fabIcon} />
        </TouchableOpacity>
        {/* ChatBot Modal */}
        <Modal visible={showChat} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ChatBot />
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowChat(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 6,
    bottom: 110,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f4631e',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AppNavigator; 