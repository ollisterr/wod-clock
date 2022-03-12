import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./styles";
import { observer } from "mobx-react-lite";
import { Text } from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import theme from "./styles/theme";
import SettingsProvider from "./contexts/SettingsContext";
import AppStateProvider from "./contexts/AppStateContext";
import TimerProvider from "./contexts/TimerContext";
import { store } from "./modules/store";

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    store.loadTimers();
  }, []);

  if (!isLoadingComplete && store.isReady) {
    return <Text>Loading</Text>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <AppStateProvider>
            <SettingsProvider>
              <TimerProvider>
                <Navigation colorScheme={colorScheme} />

                <StatusBar style="light" />
              </TimerProvider>
            </SettingsProvider>
          </AppStateProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}

export default observer(App);
