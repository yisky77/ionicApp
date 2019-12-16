var chalk = require("chalk");
var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
 
var env = process.env.IONIC_ENV;
var mode = process.env.npm_config_mode;
 
useDefaultConfig.prod.resolve.alias = {
  "@app/env": path.resolve(environmentPath('prod'))
};
 
useDefaultConfig.dev.resolve.alias = {
  "@app/env": path.resolve(environmentPath('dev'))
};
 
if (env !== 'prod' && env !== 'dev') {
  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@app/env": path.resolve(environmentPath('dev'))
  };
}
 
if (mode == "test") {
  console.log("########### now we are building test version ###########");
}
 
function environmentPath(env) {
  if (mode) env = mode;    // for test build
  var filePath = './src/env/env.' + env + '.ts';
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}
 
module.exports = function () {
  return useDefaultConfig;
};