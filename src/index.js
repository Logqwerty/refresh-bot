const { Builder, By } = require("selenium-webdriver");
const fs = require("fs").promises;
const path = require("path");
const moment = require("moment");

const sleep = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

(async function refreshBot() {
  const driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().window().maximize();

  try {
    await driver.get("http://www.avon.com");

    while (true) {
      await sleep(5);
      await driver.navigate().refresh();

      await sleep(1);
      const element = await driver
        .findElement(By.css("button[class^='Headerstyles__UserNameArea']"))
        .catch(() => console.log("throw header button"));
      const cookies = await driver.manage().getCookies();

      if (element || cookies?.refreshToken) {
        console.log("Take a screenshot...");
        const htmlEl = await driver
          .findElement(By.tagName("html"))
          .catch(() => console.log("throw html"));
        const screenShot = await htmlEl.takeScreenshot(true);
        const date = moment().format("YYYY-MM-DD-HH-mm-ss");
        const screenShotName = path.resolve(
          __dirname,
          "../logs/images",
          `screenshot-${date}`
        );
        const jsonName = path.resolve(
          __dirname,
          "../logs/cookies",
          `cookies-${date}`
        );

        await fs.writeFile(
          `${screenShotName}.png`,
          screenShot.replace(/^data:image\/png;base64,/, ""),
          "base64",
          err => console.log(err)
        );
        await fs.writeFile(`${jsonName}.json`, JSON.stringify(cookies), err =>
          console.log(err)
        );
        break;
      } else {
        console.log("Not Found");
      }

      console.log("Refresh!");
    }
    console.log("Done!");
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
})();
