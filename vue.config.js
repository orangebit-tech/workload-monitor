module.exports = {
  // make resources be relative, app not working this way
  // publicPath: './',
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" },
    host: 'americor.gixcore.com',
    port: 8080,
    // proxy: {
    //   "^/jira/": {
    //     target: {
    //       protocol: "https:",
    //       host: "americor.atlassian.net",   
    //       port: 443   
    //     },
    //     changeOrigin: true,
    //     pathRewrite: { '^/jira/': '/rest/api/' },
    //     ws: true,
    //     // "secure": true,
    //     /*
    //     // can't understand what i missing but it does not want to proxy app queries like from "/redmine/api/*" => https://msmonitor.maintstar.co/redmine/api/*
    //     pathRewrite: function (path, req) {
    //       console.log(path);
    //       return path.replace('^/redmine/api', 'asdfasdf');
    //     },
    //     */
    //     logLevel: "debug"
    //   }
    // }
  }
}
