const path = require('path');
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
const MiniCssExtract = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
module.exports = {
    mode: 'production',

    bail: true,

    devtool: 'source-map',

    entry: {
        DPlayer: './src/js/index.js',
    },

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].min.js',
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        publicPath: '/',
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.scss'],
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: path.resolve(__dirname, '..', 'src/js/index.js'),
                use: [
                    {
                        loader: "wrap-loader",
                        options: {
                            before: [`import '../css/index.scss';`],
//                             after: [`var oldC = window.C;
// exports.noConflict = function() {
// 	window.C = oldC;
// 	return this;
// }
// window.C = exports;`]
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    'template-string-optimize-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtract.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer, cssnano],
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 40000,
                },
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.art$/,
                use: path.resolve(__dirname, './art-template-loader.js'),
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            DPLAYER_VERSION: `"${require('../package.json').version}"`,
            GIT_HASH: JSON.stringify(gitRevisionPlugin.version()),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: true,
        }),
        new MiniCssExtract({
            filename: '[name].css',
        }),
    ],

    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
