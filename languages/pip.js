const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const pip_packages = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "requirements.txt")) {
      resolve();
    } else {
      console.log("\nPip packages are being installed...".blue);
      depSpin.start();
      shell.exec(`pip install -r requirements.txt`, () => {
        depSpin.stop();
        console.log("\nPip packages got installed\n".green);
        resolve();
      });
    }
  });
};

module.exports = pip_packages;
