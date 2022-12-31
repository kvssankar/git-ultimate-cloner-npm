const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const php_modules = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "composer.json")) {
      resolve();
    } else {
      console.log("\nPHP modules are being installed...".blue);
      depSpin.start();
      shell.exec(`php composer.phar install`, () => {
        depSpin.stop();
        console.log("\nPHP modules got installed\n".green);
        resolve();
      });
    }
  });
};

module.exports = php_modules;
