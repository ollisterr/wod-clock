module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            assets: "./assets",
            components: "./components",
            styles: "./styles",
            screens: "./screens",
            utils: "./utils",
            hooks: "./hooks",
            constants: "./constants",
          },
        },
      ],
    ],
  };
};
