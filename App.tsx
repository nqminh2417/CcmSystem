// App.tsx

import './global.css';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProviders } from './src/context/AppProviders';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedStatusBar } from './src/components/ThemedStatusBar';

export default function App() {
  return (
    <SafeAreaProvider>

      <AppProviders>
        <ThemedStatusBar />
        <AppNavigator />
      </AppProviders>
    </SafeAreaProvider>
  );
}
