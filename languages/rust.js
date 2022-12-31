const shell = require("shelljs");
const colors = require("colors");
const Spinner = require("cli-spinner").Spinner;

var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

const rust_crates = () => {
  return new Promise((resolve) => {
    if (!shell.test("-f", "Cargo.toml")) {
      resolve();
    } else {
      console.log("\nRust crates are being installed...".blue);
      depSpin.start();
      shell.exec(`cargo build`, () => {
        depSpin.stop();
        console.log("\nRust crates got installed\n".green);
        resolve();
      });
    }
  });
};

module.exports = rust_crates;
