import path from "path";
import { ChangeCssFilename } from "./cs";

module.exports = {
    webpack: {
        configure: (webpackConfig: any, { env, paths }: any) => {
            webpackConfig.plugins = webpackConfig.plugins.map((plugin: any) => {
                if (plugin?.constructor?.name === "HtmlWebpackPlugin") {
                    plugin.userOptions = {
                        ...plugin.userOptions,
                        chunks: ["popup"],
                    };
                }
                return plugin;
            });
            return {
                ...webpackConfig,
                entry: {
                    main: [
                        env === "development" &&
                        require.resolve("react-dev-utils/webpackHotDevClient"),
                        paths.appIndexJs,
                    ].filter(Boolean),
                    content: "./src/components/content/content.js",
                    popup: "./src/components/popup/popup-extension.tsx"
                },
                output: {
                    ...webpackConfig.output,
                    filename: "static/js/[name].js",
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                },
            };
        },
    },
    plugins: [
        {
            plugin: ChangeCssFilename,
            options: {
                filename: "App.css",
                chunkFilename: "App.[name].chunk.css",
            },
        },
    ],
};
