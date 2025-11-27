const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
    // nếu bạn có custom resolver/transformer/... thì để ở đây
    // còn nếu chưa có, có thể để trống object {}
};

module.exports = withNativeWind(
    mergeConfig(defaultConfig, config),
    {
        input: "./global.css",
    }
);
