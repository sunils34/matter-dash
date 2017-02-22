var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build/prod');
var APP_DIR = path.resolve(__dirname, './src/client');

console.log("-- Production --");
console.log();

console.log("Core directories");
console.log("> App src: " + APP_DIR);
console.log("> Build dir: " + BUILD_DIR);
console.log();

var config = {
    devtool: 'source-map',
    entry: APP_DIR + '/app.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'dist/bundle.[hash].js'
    },
    plugins: [
        new CleanPlugin(['./build/prod'], {
            verbose: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/client/app/fonts',
                to: './public/fonts/'
            },
            {
                from: 'src/client/app/images',
                to: './public/images/'
            }
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
         new HtmlWebpackPlugin({
            template: 'src/client/index.ejs',
            filename: 'index.html',
            inject: false
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js?/,
                // exclude: /node_modules/,
                include: APP_DIR,
                loader: 'babel',
                include: [path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/joi'),
                    path.resolve(__dirname, 'node_modules/hoek'),
                    path.resolve(__dirname, 'node_modules/isemail'),
                    path.resolve(__dirname, 'node_modules/topo')]
            },
            {
                test: /\.css?$/,
                loader: "style-loader!css-loader!postcss-loader"
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loaders: [
                    'public/images/file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }]
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    node: {
        dns: 'mock',
        net: 'mock'
    }
};

module.exports = config;
