// App.tsx

import './global.css';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProviders } from './src/context/AppProviders';
import { PaperProvider } from 'react-native-paper';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppProviders>
          <AppNavigator />
        </AppProviders>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
