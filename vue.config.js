module.exports = {
  // make resources be relative, app not working this way
  publicPath: './',
  devServer: {
    proxy: {
      "/redmine/redmines.php": {
        target: "https://msmonitor.maintstar.co/redmine/redmines.php",
        /*
        // can't understand what i missing but it does not want to proxy app queries like from "/redmine/api/*" => https://msmonitor.maintstar.co/redmine/api/*
        pathRewrite: function (path, req) {
          console.log(path);
          return path.replace('^/redmine/api', 'asdfasdf');
        },
        */
        logLevel: "debug"
      }
    }
  }
}
