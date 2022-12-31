const shell = require("shelljs");
const colors = require("colors");
const npm_packages = require("../languages/npm");
const dart_packages = require("../languages/dart");
const go_deps = require("../languages/go");
const pip_packages = require("../languages/pip");
const rust_crates = require("../languages/rust");
const php_modules = require("../languages/php");
const ruby_gems = require("../languages/ruby");
const maven_deps = require("../languages/maven");

const getAppname = (url) => {
  if (url == null) {
    return null;
  }
  if (url.startsWith("https://")) {
    return url.split("/")[4].replace(".git", "");
  } else if (url.startsWith("git@")) {
    return url.split("/")[1].replace(".git", "");
  } else {
    return;
  }
};

const check = () => {
  return new Promise((resolve) => {
    if (!shell.which("git")) {
      shell.echo(
        "\nSorry, this script requires git installed globally :(\n".red
      );
    }
    resolve();
  });
};

async function install_npm_packages(folder) {
  if (shell.test("-d", folder)) {
    console.log("Checking for dependencies in".blue, folder);
    shell.cd(folder);
    await npm_packages();
    await dart_packages();
    await go_deps();
    await pip_packages();
    await rust_crates();
    await php_modules();
    await ruby_gems();
    await maven_deps();
    shell.cd("..");
  }
}

module.exports = {
  getAppname,
  check,
  install_npm_packages,
};
