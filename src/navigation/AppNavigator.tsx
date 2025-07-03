import React from 'react';
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
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/HomeIcon';
import VerbIcon from '../assets/VerbIcon';
import ListeningIcon from '../assets/ListeningIcon';

export type RootTabParamList = {
  Home: undefined;
  Words: undefined;
  Reading: undefined;
  Listening: undefined;
  Quiz: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
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
          component={WordsScreen}
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
    </NavigationContainer>
  );
};

export default AppNavigator; 