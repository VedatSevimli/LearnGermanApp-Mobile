const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    // devtool: 'inline-source-map',
    // devtool: 'cheap-module-source-map',
    devServer: {
        static: './dist',
        compress: true,
        port: 3000,
        open: true, // Automatically open browser
        hot: true, // Enable Hot Module Replacement (HMR)
        historyApiFallback: true,
        watchFiles: ['src/**/*']
    },
    plugins: [
        new Dotenv({
            path: './.env.development'
        })
    ]
});
