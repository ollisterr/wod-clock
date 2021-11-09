import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    initialRouteName: "Root",
    screens: {
      Root: {
        initialRouteName: "Stopwatch",
        screens: {
          Stopwatch: "stopwatch",
          Timer: "timer",
          Rounds: "rounds",
        },
      },
    },
  },
};

export default linking;
