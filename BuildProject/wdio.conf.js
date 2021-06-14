exports.config = {
  runner: 'local',
  specs: [
    './tests/App.test.js'
  ],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
    acceptInsecureCerts: true
  }],
  logLevel: 'debug',
  logLevels: {
      webdriver: 'debug',
      '@wdio/applitools-service': 'info'
  },
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    require: ['@babel/register'],
    ui: 'bdd',
    timeout: 60000
  }
}
