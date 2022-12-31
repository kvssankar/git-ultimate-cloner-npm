const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const dart_packages = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "pubspec.yaml")) {
      resolve();
    } else {
      console.log("\nDart packages are being installed...".blue);
      depSpin.start();
      shell.exec(`dart pub get`, () => {
        depSpin.stop();
        console.log("\nDart packages got installed\n".green);
        resolve();
      });
    }
  });
};

module.exports = dart_packages;
