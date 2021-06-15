import wd from 'wd';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
const PORT = 4723;

const config = {
  platformName: "iOS",
  platformVersion: "14.4",
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
  const messagesText = await driver.elementByAccessibilityId('messages-text');
  const tries = 10;
  var i;
  for (i = 0; i < tries; i++) {
    await driver.sleep(1000);
    await driver.tapElement(testAllButton);
    const s = await messagesText.text();
    if (!s) { continue; }  // No result yet.
    if (s.endsWith('All logging passed')) {
      return;  // Got the right message, test passes.
    } else {
      fail(s);
    }
  }
  fail('Test produced no output after ' + tries + ' tries');
});
