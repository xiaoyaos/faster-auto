const { IgnorePlugin } = require("webpack")
const path = require("path")

module.exports = {
    entry: "./src/app.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: [ ".js", ".ts", ".tsx",  ],
        alias: {
            "@src": path.resolve(__dirname, "src"),
            "@root": path.resolve(__dirname, "../"),
            "@core": path.resolve(__dirname, "../base-lib/src/core/"),
            "@util": path.resolve(__dirname, "../base-lib/src/util/"),
            "@core-guards": path.resolve(__dirname, "../base-lib/src/core-guards/"),
            "@core-models": path.resolve(__dirname, "../base-lib/src/core-models/")
        }
    },
    target: "node",
    externals:{
        "fs": "commonjs fs",
        "net":"commonjs net",
        "sqlite3": "commonjs sqlite3",
        "pg-query-stream": "commonjs pg-query-stream",
        "oracledb": "commonjs oracledb",
        "mysql2": "commonjs mysql2",
        "tedious": "commonjs tedious",
        "better-sqlite3": "commonjs better-sqlite3",
    },
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /^pg-native$/,
        }),
        new IgnorePlugin({
            resourceRegExp: /^fsevents$/,
        })
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        minimize: false
    }
}

