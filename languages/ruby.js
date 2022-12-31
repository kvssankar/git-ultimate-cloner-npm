const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const ruby_gems = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "Gemfile")) {
      resolve();
    } else {
      console.log("\nRuby gems are being installed...".blue);
      depSpin.start();
      shell.exec(`bundle install`, () => {
        depSpin.stop();
        console.log("\nRuby gems got installed\n".green);
        resolve();
      });
    }
  });
};

module.exports = ruby_gems;
