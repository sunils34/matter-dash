var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build/dev');
var APP_DIR = path.resolve(__dirname, './src/client');

console.log("-- Development --");
console.log();

console.log("Core directories");
console.log("> App src: " + APP_DIR);
console.log("> Build dir: " + BUILD_DIR);
console.log();

var config = {
    devtool: 'source-map',
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'dist/bundle.js',
    },
    plugins: [
        new LiveReloadPlugin({appendScriptTag: true}),
        new CleanPlugin(['./build/dev'], {
            verbose: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/client/fonts',
                to: './public/fonts/'
            },
            {
                from: 'src/client/images',
                to: './public/images/'
            }
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/client/views/index.ejs',
            filename: 'index.html',
            inject: false
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                include: APP_DIR,
                loader: 'babel',
                include: [path.resolve(__dirname, 'src')]
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
            },
        ]
    },
    postcss: function() {
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
