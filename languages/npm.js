const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const npm_packages = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "package.json")) {
      resolve();
    } else {
      console.log("\nNpm packages are being installed...".blue);
      if (shell.test("-f", "yarn.lock")) {
        console.log("\nUsing yarn".blue);
        depSpin.start();
        shell.exec(`yarn install`, () => {
          depSpin.stop();
          console.log("\nNpm packages got installed\n".green);
          resolve();
        });
      } else if (shell.test("-f", "pnpm-lock.yaml")) {
        console.log("\nUsing pnpm".blue);
        depSpin.start();
        shell.exec(`pnpm install`, () => {
          depSpin.stop();
          console.log("\nNpm packages got installed\n".green);
          resolve();
        });
      } else {
        console.log("\nUsing npm".blue);
        depSpin.start();
        shell.exec(`npm install`, () => {
          depSpin.stop();
          console.log("\nNpm packages got installed\n".green);
          resolve();
        });
      }
    }
  });
};

module.exports = npm_packages;
