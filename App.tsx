// App.tsx

import './global.css';

import React, { useEffect } from 'react';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProviders } from './src/context/AppProviders';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedStatusBar } from './src/components/ThemedStatusBar';
import { ensureDataWedgeProfile } from './src/native/datawedge';

export default function App() {
  useEffect(() => {
    ensureDataWedgeProfile();
  }, []);

  return (
    <SafeAreaProvider>

      <AppProviders>
        <ThemedStatusBar />
        <AppNavigator />
      </AppProviders>
    </SafeAreaProvider>
  );
}
