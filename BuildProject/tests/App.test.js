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

const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
})


test('Test All Promoted Logging Calls', async () => {
  const testAllButton = await driver.elementByAccessibilityId('test-all-button');
  // Need to tap twice for this to appear.
  await driver.tapElement(testAllButton);
  await driver.tapElement(testAllButton);
  const messagesText = await driver.elementByAccessibilityId('messages-text');
  const s = await messagesText.text();
  if (!s.endsWith('All logging passed')) {
    fail(s);
  }
});
