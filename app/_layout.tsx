import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TaskProvider } from "../components/helpers/TaskContext";
import { NativeBaseProvider } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { read, write } from "../components";
import common_en from "../translation/en.json";
import common_es from "../translation/es.json";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [locationUser, setLocationUser] = useState<string>('');

  useEffect(() => {
    getLocationEnv().then((response: string) => {
      setLocationUser(response);
    });
  }, [i18next.changeLanguage]);

  const getLocationEnv = async () => {
    let locationUser = await read("locationUser");
    if (!locationUser) {
      await write("locationUser", 'es');
      locationUser = 'es';
    }
    return locationUser;
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (locationUser) {
      i18next.init({
        lng: locationUser,
        resources: {
          en: { translation: common_en },
          es: { translation: common_es },
        },
        interpolation: {
          escapeValue: false,
        }
      });
    }
  }, [locationUser]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <NativeBaseProvider>
          <I18nextProvider i18n={i18next}>
            <QueryClientProvider client={queryClient}>
              <AutocompleteDropdownContextProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: true }} />
                </Stack>
                <StatusBar style="auto" />
              </AutocompleteDropdownContextProvider>
            </QueryClientProvider>
          </I18nextProvider>
        </NativeBaseProvider>
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
