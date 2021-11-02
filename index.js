#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");
var Spinner = require("cli-spinner").Spinner;
var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

let idename = "code";

const store = require("data-store")("guc");

// const customFolderHelp = () => {
//   shell.echo("\n\nSet\\Edit your cloning folder:\n".white.bgMagenta);
//   shell.echo("quick --set-folder <foldername> <path>".blue);
//   shell.echo(
//     "\nExample: ".magenta +
//       "quick " +
//       "--set-folder node" +
//       ' "C:\\Users\\SANKAR KUMAR\\Desktop\\projects\node"'
//   );
//   shell.echo("\n\nHow to use:".white.bgMagenta);
//   shell.echo("\nquick clone <repo-link> --folder <foldername>");
//   shell.echo(
//     "\nExample: ".magenta + "quick clone <repo-link> --folder node".blue
//   );
// };

// const defaultFolderHelp = () => {
//   shell.echo("\n\nSet\\Edit your default cloning folder:\n".white.bgMagenta);
//   shell.echo("quick --set-folder default <path>".blue);
//   shell.echo(
//     "\nExample: ".magenta +
//       "quick " +
//       "--set-folder default".yellow +
//       ' "C:\\Users\\SANKAR KUMAR\\Desktop\\projects"'
//   );
//   shell.echo(
//     "\n\nClone in the current folder if u set the default folder:".white
//       .bgMagenta
//   );
//   shell.echo("quick clone <repo-link> --folder current".blue);
// };

const defaultFolderHelp = () => {
  shell.echo(
    "--set-folder default".yellow +
      ' "<path>"'.cyan +
      " : for setting default folder to clone into"
  );
  shell.echo(
    "--folder ".yellow +
      "current".cyan +
      " : to clone into current cmd directory"
  );
};

const customFolderHelp = () => {
  shell.echo(
    "--set-folder ".yellow +
      "<folderName>".cyan +
      ' "<path>"'.cyan +
      " : for setting custom folders to clone into"
  );
  shell.echo(
    "--folder ".yellow +
      "<folderName>".cyan +
      " : for cloning into custom folders set"
  );
};

const help = () => {
  shell.echo("\n\nGIT-ULTIMATE-CLONER GUIDELINES".white.bgMagenta);
  shell.echo("\nquick clone <repo-link> <options>\n".blue);
  shell.echo("where options is one of the below\n");
  shell.echo("--ide ".yellow + "atom   : for opening in atom editor");
  shell.echo("--ide ".yellow + "vscode : for opening in vscode editor");
  defaultFolderHelp();
  customFolderHelp();
};

const syntaxError = () => {
  console.log("Not a valid command. Please follow proper syntax\n".red);
  console.log("Syntax : quick clone <url> [--ide {editor name}]\n".yellow);
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

if (process.argv[2] == "--set-folder") {
  var folderName = "guc-" + process.argv[3];
  store.set(folderName, process.argv[4]);
  shell.echo(
    `Successfully set ${process.argv[3]} path as `.green + process.argv[4].blue
  );
  shell.echo("\nTo Know more about usage: ".magenta + "quick --help".yellow);
  shell.exit(200);
}

let url = process.argv[3];
let options = process.argv.slice(4);
let cloneInCurrentPath = 0;
let cloneInCustomPath = null;
const optionsExc = () => {
  for (var i = 0; i < options.length; i++) {
    if (options[i] == "--ide" && options[i + 1] == "atom") {
      idename = options[i + 1];
      i++;
    }
    if (options[i] == "--folder") {
      var path = "guc-" + options[i + 1];
      if (store.has(path)) {
        if (path == "guc-current") {
          cloneInCurrentPath = 1;
        } else {
          cloneInCustomPath = path;
          console.log(`Cloning into ${store.get(path)} folder\n`.green);
        }
      }
      i++;
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
      store.has("guc-default") &&
      cloneInCurrentPath == 0 &&
      cloneInCustomPath == null
    ) {
      shell.cd(`${store.get("guc-default")}`);
    } else if (cloneInCustomPath !== null) {
      shell.cd(`${store.get(cloneInCustomPath)}`);
    }
    shell.echo("\nAll checks has passed successfully\n".bgBlue.white);
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
