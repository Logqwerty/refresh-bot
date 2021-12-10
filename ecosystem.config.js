const path = require("path");
const logPath = path.resolve(__dirname, "./logs/pm2");

module.exports = {
  apps: [
    {
      name: "avon",
      script: "./src/index.js",
      watch: false,
      instances: "max",
      exec_mode: "cluster",
      log_file: `${logPath}/combined.log`,
      error_file: `${logPath}/error.log`,
      time: true,
    },
  ],
};
