const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {

    entry: {
        'audio' : path.resolve(__dirname, './source/script/audio-dev.js')
    },
    output: {
        filename: 'source/script/[name].js',
        path: path.resolve( __dirname, 'dist' ),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: 'sass-loader',
                        options: {
                          // Prefer `dart-sass`
                          implementation: require.resolve('sass'),
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin( {
            template: 'index.html',
            filename: path.resolve( __dirname, 'dist', 'index.html' ),
        } ),
        new CopyWebpackPlugin( {
            patterns: [
                {
                    from: 'assets',
                    to: 'assets'
                },
                {
                    from: 'source/manifest.json',
                    to: 'source'
                },
                {
                    from: 'source/images',
                    to: 'source/images'
                },
                {
                    from: 'source/script/templates',
                    to: 'source/script/templates'
                },
                {
                    from: 'source/script/lib',
                    to: 'source/script/lib'
                },
            ],
        } ),
        new MiniCssExtractPlugin({
            filename: 'source/css/[name].css',
            chunkFilename: 'source/css/[id].css',
        } ),
    ],

};