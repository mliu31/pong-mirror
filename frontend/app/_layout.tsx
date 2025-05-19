import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import spaceMono from '../assets/fonts/SpaceMono-Regular.ttf';
import { IoProvider } from '@/context/IoContext';
import { Provider as ReduxProvider } from 'react-redux';
import store, { persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: spaceMono
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode={'dark'}>
          <IoProvider>
            <ThemeProvider value={DarkTheme}>
              <Stack>
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </IoProvider>
        </GluestackUIProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
