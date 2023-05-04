const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        //使用的publicPath,文件夹不会真正生成，而是在8080端口虚拟生成，格式一般为/XXX/
        publicPath: '/xuni/',
        filename: 'bundle.js',
    },
    devServer: {
        //端口号
        port: 8080,
        static: 'www'
    },
    resolve: {
        extensions: ['.ts', '.js', '.less']
    },

};