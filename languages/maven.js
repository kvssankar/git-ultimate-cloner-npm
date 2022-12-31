const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const maven_deps = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "pom.xml")) {
      resolve();
    } else {
      console.log("\nMaven dependencies are being installed...".blue);
      depSpin.start();
      shell.exec(`mvn clean install`, () => {
        depSpin.stop();
        console.log("\nMaven dependencies got installed".green);
        resolve();
      });
    }
  });
};

module.exports = maven_deps;
