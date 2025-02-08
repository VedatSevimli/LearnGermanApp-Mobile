const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: 'production',
    devtool: false, // Disable source maps,
    plugins: [
        new Dotenv({
            path: './.env.production'
        })
    ]
});
