#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");
var Spinner = require("cli-spinner").Spinner;
var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

let idename = "code";

const store = require("data-store")("guc");

const instrustionsToAddPaths = () => {
  shell.echo("\n\nAdd your custom folder paths\n".underline.magenta);
  shell.echo("quick --set-<folderName> <path>".blue);
  shell.echo(
    "\nExample to set path to my node folder:\n".cyan +
      "quick " +
      "--set-node".yellow +
      ' "C:\\Users\\SANKAR KUMAR\\Desktop\\projects\\node"'
  );
  shell.echo("\n\nClone in folder your custom folder:\n".underline.magenta);
  shell.echo("quick clone <repo-link> --folderName".blue);
  shell.echo("\nExample to clone my node project to node folder:".cyan);
  shell.echo("quick clone <repo-link> --path node");
  shell.echo(
    "\n\nClone in the current folder after setting default folder:".underline
      .magenta
  );
  shell.echo("\nquick clone <repo-link> --path current\n".blue);
};

const help = () => {
  shell.echo("\n\nGIT-ULTIMATE-CLONER GUIDELINES".underline.magenta);
  shell.echo("\nquick clone <repo-link> <options>\n".blue);
  shell.echo("where options is one of the below\n");
  shell.echo("-e ".yellow + "atom   : for opening in atom editor");
  shell.echo("-e ".yellow + "vscode : for opening in vscode editor");
  shell.echo("\n\nSet\\Edit your default cloning folder:\n".underline.magenta);
  shell.echo("quick --set-default <path>".blue);
  shell.echo(
    "\nExample:\n".cyan +
      "quick " +
      "--set-default".yellow +
      ' "C:\\Users\\SANKAR KUMAR\\Desktop\\projects"'
  );
  shell.echo("\n\nView your paths for custom folders:\n".underline.magenta);
  shell.echo("quick --view-paths".blue);
  instrustionsToAddPaths();
};

const syntaxError = () => {
  console.log("Not a valid command. Please follow proper syntax\n".red);
  console.log("Syntax : quick clone <url> [-e {editor name}]\n".yellow);
  console.log("Supported editors : Visual Studio Code, Atom".yellow);
  console.log(
    "For Visual Studio Code, use vscode or leave empty. For Atom, use atom\n"
      .yellow
  );
};

if (process.argv[2] == "--help") {
  help();
  shell.exit(200);
}

if (process.argv[2] == "--view-paths") {
  if (store.has("paths")) {
    console.log(store.get("paths"));
  } else {
    console.log("\nNo paths added yet".bgWhite.black);
    instrustionsToAddPaths();
  }
  shell.exit(200);
}

if (process.argv[2].startsWith("--set-")) {
  var pathName = process.argv[2].split("--set-")[1] + "-path";

  var mapy = store.get("paths");
  if (mapy == null) {
    mapy = new Map();
  }
  mapy.set(pathName, process.argv[3]);
  store.set("paths", mapy);

  if (pathName == "default-path") {
    shell.echo(
      "\nSuccessfully set default path to: ".green + process.argv[3].yellow
    );
    shell.echo("\nTIPS: ".bgMagenta.white);
    shell.echo(
      "\nClone in current folder instead of default one using " +
        "--current".yellow
    );
    shell.echo(
      "\nExample: ".yellow + "\nquick clone <repo-link> --current\n".blue
    );
  }
  shell.exit(200);
}

let url = process.argv[3];
let options = process.argv.slice(4);
let cloneInCurrentPath = 0;
const optionsExc = () => {
  for (var i = 0; i < options.length; i++) {
    if (options[i] == "-e" && options[i + 1] == "atom") {
      idename = options[i + 1];
      i++;
    }
    if (options[i] == "--path") {
      if (options[i + 1] == "current") {
        cloneInCurrentPath = 1;
      }
    }
  }
};

if (process.argv[2] != "clone") {
  syntaxError();
  shell.exit(1);
}
let url_length = url.length;
if (url.slice(url_length - 4, url_length) == ".git") {
  url = url.slice(0, url_length - 4);
}

//get appname
appname = url.replace("https://github.com/", "");
let t1;
for (let i = 0; i < appname.length; i++) {
  if (appname[i] == "/") {
    t1 = i + 1;
    break;
  }
}
appname = appname.slice(t1);
appname.replace("/", "");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const run = async () => {
  await check();
  await optionsExc();
  await clone();
  await npm_packages();
  await pip_packages();
  await go_deps();
  await rust_crates();
  await dart_packages();
  await ruby_gems();
  await php_modules();
  await open();
  shell.exit(200);
};

const check = () => {
  return new Promise((resolve) => {
    if (!url.includes("https://github.com/")) {
      shell.echo("\nError: Enter a valid github url\n".red);
      shell.exit(1);
    }
    if (!shell.which("git")) {
      shell.echo(
        "\nSorry, this script requires git installed globally :(\n".red
      );
    }
    resolve();
  });
};

const clone = async () => {
  return new Promise((resolve) => {
    if (
      store.has("paths") &&
      cloneInCurrentPath == 0 &&
      store.get("paths").has("default-path")
    ) {
      shell.cd(`${store.get("paths").get("default-path")}`);
    }
    shell.echo("\nAll checks have passed successfully\n".bgBlue.white);
    console.log(
      `\n${capitalizeFirstLetter(appname)} is being cloned...\n`.bgMagenta.white
    );
    depSpin.start();
    shell.exec(`git clone ${url}`, () => {
      depSpin.stop();
      console.log(
        `\n${capitalizeFirstLetter(appname)} has been cloned successfully\n`
          .bgGreen.white
      );
      resolve();
    });
  });
};

const npm_packages = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);

    if (!shell.test("-f", "package.json")) {
      console.log(`\nCan't find package.json in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nNpm packages are being installed...".bgMagenta.white);
      if (shell.test("-f", "yarn.lock")) {
        console.log("\nUsing yarn".bgMagenta.white);
        depSpin.start();
        shell.exec(`yarn install`, () => {
          depSpin.stop();
          console.log("\nNpm packages got installed\n".bgGreen.white);
          shell.cd("..");
          resolve();
        });
      } else if (shell.test("-f", "pnpm-lock.yaml")) {
        console.log("\nUsing pnpm".bgMagenta.white);
        depSpin.start();
        shell.exec(`pnpm install`, () => {
          depSpin.stop();
          console.log("\nNpm packages got installed\n".bgGreen.white);
          shell.cd("..");
          resolve();
        });
      } else {
        console.log("\nUsing npm".bgMagenta.white);
        depSpin.start();
        shell.exec(`npm install`, () => {
          depSpin.stop();
          console.log("\nNpm packages got installed\n".bgGreen.white);
          shell.cd("..");
          resolve();
        });
      }
    }
  });
};

const pip_packages = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "requirements.txt")) {
      console.log(
        `\nCan't find requirements.txt in the root directory\n`.yellow
      );
      shell.cd("..");
      resolve();
    } else {
      console.log("\nPip packages are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`pip install -r requirements.txt`, () => {
        depSpin.stop();
        console.log("\nPip packages got installed\n".bgGreen.white);
        shell.cd("..");
        resolve();
      });
    }
  });
};

const go_deps = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "go.mod")) {
      console.log(`\nCan't find go.mod in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nGo dependencies are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`go mod tidy`, () => {
        depSpin.stop();
        console.log("\nGo dependencies got installed\n".bgGreen.white);
        shell.cd("..");
        resolve();
      });
    }
  });
};

const rust_crates = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "Cargo.toml")) {
      console.log(`\nCan't find Cargo.toml in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nRust crates are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`cargo build`, () => {
        depSpin.stop();
        console.log("\nRust crates got installed\n".bgGreen.white);
        shell.cd("..");
        resolve();
      });
    }
  });
};

const dart_packages = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "pubspec.yaml")) {
      console.log(`\nCan't find pubspec.yaml in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nDart packages are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`dart pub get`, () => {
        depSpin.stop();
        console.log("\nDart packages got installed\n".bgGreen.white);
        shell.cd("..");
        resolve();
      });
    }
  });
};

const ruby_gems = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "Gemfile")) {
      console.log(`\nCan't find Gemfile in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nRuby gems are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`bundle install`, () => {
        depSpin.stop();
        console.log("\nRuby gems got installed\n".bgGreen.white);
        shell.cd("..");
        resolve();
      });
    }
  });
};

const php_modules = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "composer.json")) {
      console.log(`\nCan't find composer.json in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nPHP modules are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`php composer.phar install`, () => {
        depSpin.stop();
        console.log("\nPHP modules got installed\n".bgGreen.white);
        shell.cd("..");
        resolve();
      });
    }
  });
};

const open = () => {
  return new Promise((resolve) => {
    checkIde(idename);
    shell.cd(`${appname}`);
    console.log("\nYou are all ready to go forth and conquer\n".bgWhite.black);
    shell.exec(`${idename} .`, () => {
      resolve();
    });
  });
};

const checkIde = (idename) => {
  if (idename == "code") {
    if (!shell.which("code")) {
      shell.echo("\nError:VS Code not installed\n".red);
      shell.exit(1);
    }
  } else {
    if (!shell.which("atom")) {
      shell.echo("\nError:Atom not installed\n".red);
      shell.exit(1);
    }
  }
};

run();
