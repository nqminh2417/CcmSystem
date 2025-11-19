import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import React from 'react';

export default function App() {
  return <PaperProvider>
    <AppNavigator />
  </PaperProvider>;
}
