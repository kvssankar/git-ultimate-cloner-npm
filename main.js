const shell = require("shelljs");
const colors = require("colors");
const store = require("data-store")("guc");

const { getAppname, check, install_npm_packages } = require("./utils/utils");
const npm_packages = require("./languages/npm");
const go_deps = require("./languages/go");
const pip_packages = require("./languages/pip");
const rust_crates = require("./languages/rust");
const php_modules = require("./languages/php");
const ruby_gems = require("./languages/ruby");
const maven_deps = require("./languages/maven");
const dart_packages = require("./languages/dart");

const run = async (url, options) => {
  check();

  const appname = getAppname(url);
  if (appname === null) {
    shell.echo("Please enter a valid url".red);
    shell.exit(1);
  }

  let folder = options.folder;
  if (folder !== undefined) {
    if (folder === "current") {
      folder = shell.pwd();
    } else if (store.has(folder)) {
      folder = store.get(folder);
    }
  }
  if (folder === undefined) {
    if (store.has("default")) {
      folder = store.get("default");
    }
  }
  if (folder === undefined) {
    folder = shell.pwd();
  }

  shell.cd(folder);
  shell.exec(`git clone ${url}`);
  await install_npm_packages(appname);

  shell.cd(appname);

  const folders = shell.ls("-d", "*");
  for (let i = 0; i < folders.length; i++) {
    await install_npm_packages(folders[i]);
  }

  let ide = options.ide || store.get("ide");
  if (ide) {
    console.log("Opening in", ide);
    if (ide === "vscode") {
      shell.exec(`code .`);
    } else if (ide === "atom") {
      shell.exec(`atom .`);
    } else if (ide === "sublime") {
      shell.exec(`subl .`);
    } else {
      shell.echo(
        "Please enter a valid editor.\n Right now we support only [vscode,atom,sublime]"
          .red
      );
      shell.exit(1);
    }
  } else {
    if (shell.which("code")) {
      shell.exec(`code .`);
    }
  }
  shell.exit(200);
};

module.exports = run;
