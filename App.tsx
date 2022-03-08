import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./styles";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import theme from "./styles/theme";
import SettingsProvider from "./contexts/SettingsContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <SettingsProvider>
            <Navigation colorScheme={colorScheme} />

            <StatusBar style="light" />
          </SettingsProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
