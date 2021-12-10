const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

(async function example() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://www.avon.com");

    while (true) {
      await sleep(5);
      await driver.navigate().refresh();

      await sleep(1);
      const element = await driver
        .findElement(By.css("button[class^='Headerstyles__UserNameArea']"))
        .catch(() => console.log("throw header button"));

      if (element) {
        console.log("Take a screenshot...");
        const htmlEl = await driver
          .findElement(By.tagName("html"))
          .catch(() => console.log("throw html"));
        const screenShot = await htmlEl.takeScreenshot(true);
        const date = moment().format("YYYY-MM-DD-HH-mm-ss");
        const filename = path.resolve(__dirname, `screenshot-${date}`);

        fs.writeFile(
          `${filename}.png`,
          screenShot.replace(/^data:image\/png;base64,/, ""),
          "base64",
          (err) => console.log(err)
        );
      } else {
        console.log("Not Found");
      }

      console.log("refresh!");
    }
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
})();
