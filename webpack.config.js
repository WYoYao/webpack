var path = require('path');

function rewriteUrl(replacePath) {
  return function (req, opt) {
    var queryIndex = req.url.indexOf('?');
    var query = queryIndex >= 0 ? req.url.substr(queryIndex) : "";

    req.url = req.path.replace(opt.path, replacePath) + query;
    console.log("rewriting ", req.originalUrl, req.url);
  };
}

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool:'cheap-module-source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.css/,
          loader: 'style!css'
        },
        {
          test: /\.less/,
          loader: 'style!css!less'
        }
      ]
    },
    //节省下之前命令行里面写的配置参数
    devServer:{
        //显示进度
        progress:true,
        //文件根目录
        contentBase:'build',
        //编译的时候显示颜色
        stats:{colors:true},
        //实现热替换
        inline:true,
        //虚拟目录。调用JS的地址也需要修改
        publicPath:'/static/',
        resolve:{
          extension:["", ".js", ".jsx", ".css", ".json"]
        },
        proxy: [
          {
            //正则 /api/*
            path: /^\/api\/(.*)/,
            target: "http://localhost:8080/",
            rewrite: rewriteUrl('/$1\.json'),
            changeOrigin: true
          }
       ]
        // //实现热替换
        // hot:true
    }
};
