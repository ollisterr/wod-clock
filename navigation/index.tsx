import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { observer } from "mobx-react-lite";

import NotFoundScreen from "../screens/NotFoundScreen";
import SetsScreen from "../screens/SetsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StopwatchScreen from "../screens/StopwatchScreen";
import TimerScreen from "../screens/TimerScreen";
import theme from "../styles/theme";
import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { store } from "../modules/store";

const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  const { isReady } = store;

  return isReady ? (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  ) : null;
};

export default observer(Navigation);

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.peach,
        tabBarInactiveBackgroundColor: theme.colors.black,
        tabBarActiveBackgroundColor: theme.colors.black,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          paddingBottom: 12,
        },
        tabBarHideOnKeyboard: true,
        tabBarVisibilityAnimationConfig: {
          show: {
            animation: "timing",
            config: { duration: 0 },
          },
          hide: {
            animation: "timing",
            config: { duration: 500 },
          },
        },
      }}
    >
      <BottomTab.Screen
        name="Stopwatch"
        component={StopwatchScreen}
        options={{
          title: "Stopwatch",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="clock-o" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          title: "Timer",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="hourglass-end" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Rounds"
        component={SetsScreen}
        options={{
          title: "Rounds",
          tabBarIcon: ({ color }) => <TabBarIcon name="repeat" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} {...props} />;
}
