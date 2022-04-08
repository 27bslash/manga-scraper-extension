import path from "path";
import { ChangeCssFilename } from "./cs";

module.exports = {
    webpack: {
        configure: (webpackConfig: { output: any; optimization: any; }, { env, paths }: any) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [
                        env === "development" &&
                        require.resolve("react-dev-utils/webpackHotDevClient"),
                        paths.appIndexJs,
                    ].filter(Boolean),
                    content: "./src/components/content/content.js",
                    popup: "./src/components/popup/popup.js"
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
