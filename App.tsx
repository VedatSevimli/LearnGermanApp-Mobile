import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/userContext';

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </UserProvider>
  );
} 