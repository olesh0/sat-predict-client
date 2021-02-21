const appConfig = require('./app.json')

module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: appConfig,
    },
  },
}
