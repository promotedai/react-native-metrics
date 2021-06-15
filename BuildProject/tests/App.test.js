import wd from 'wd';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
const PORT = 4723;

const config = {
  platformName: "iOS",
  platformVersion: "14.5",
  deviceName: "iPhone 11",
  app: "build/BuildProject.ipa",
  automationName: "XCUITest",
};

var retry = require('webdriverjs-retry');
const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
})

test('Test All Promoted Logging Calls', async () => {

  class EmptyResultTextError extends Error {
    constructor() {
      super('Test produced no result text');
      this.name = 'EmptyResultTextError';
    }
  }

  // Ignore Webdriver code 7 (element not found) and empty result.
  await retry.ignoring(7).ignoring(EmptyResultTextError).run(async () => {
    const testAllButton = await driver.elementByAccessibilityId('test-all-button');
    await driver.tapElement(testAllButton);
    const messagesText = await driver.elementByAccessibilityId('messages-text');
    const s = await messagesText.text();
    // Text not yet available. Cause a retry (or failure).
    if (!s) { throw new EmptyResultTextError(); }
    // Text is available. Check that it contains what we expect.
    if (!s.endsWith('All logging passed')) {
      fail(s);
    }
  }, /*timeout=*/10000, /*sleep=*/1000);
});
