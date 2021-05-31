module.exports = {
    devServer: {
     open: process.platform === 'darwin',
     host: '0.0.0.0',
     port: 8080,
     https: false,
     hotOnly: false,
     // 设置代理
     proxy: {
        '/api':{
            target:"https://autumnfish.cn/",
            //设置可以跨域
            changeOrigin:true,
            pathRewrite:{"^/api":""}
        }
    },
     before: app => {}
    }
   }
