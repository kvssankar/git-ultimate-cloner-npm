const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const go_deps = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "go.mod")) {
      resolve();
    } else {
      console.log("\nGo dependencies are being installed...".blue);
      depSpin.start();
      shell.exec(`go mod tidy`, () => {
        depSpin.stop();
        console.log("\nGo dependencies got installed\n".green);
        resolve();
      });
    }
  });
};

module.exports = go_deps;
