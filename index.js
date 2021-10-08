#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");
var Spinner = require("cli-spinner").Spinner;
var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

let idename = "code";

const store = require("data-store")("guc");

const help = () => {
  shell.echo("\n\nGIT-ULTIMATE-CLONER GUIDELINES".white.bgMagenta);
  shell.echo("\nquick clone <repo-link> <options>\n".blue);
  shell.echo("where options is one of the below\n");
  shell.echo("-e ".yellow + "atom   : for opening in atom editor");
  shell.echo("-e ".yellow + "vscode : for opening in vscode editor");
  shell.echo("\n\nSet\\Edit your default cloning folder:\n".white.bgMagenta);
  shell.echo("quick --default <path>".blue);
  shell.echo(
    "\nExample: ".magenta +
      "quick " +
      "--default".yellow +
      ' "C:\\Users\\SANKAR KUMAR\\Desktop\\projects"'
  );
  shell.echo(
    "\n\nClone in the current folder after setting default folder:".white
      .bgMagenta
  );
  shell.echo("\nquick clone <repo-link> --current\n".blue);
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

if (process.argv[2] == "--default") {
  store.set("guc-path", process.argv[3]);
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
    if (options[i] == "--current") {
      cloneInCurrentPath = 1;
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
  await cd();
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
    if (store.has("guc-path") && cloneInCurrentPath == 0) {
      //console.log("working................ " + store.get("guc-path"));
      shell.cd(`${store.get("guc-path")}`);
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

const cd = () => {
  return new Promise((resolve) => {
    shell.cd(`${appname}`);
    if (!shell.test("-f", "package.json")) {
      console.log(`\nCan't find package.json in the root directory\n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\nNpm packages are being installed...".bgMagenta.white);
      depSpin.start();
      shell.exec(`npm install`, () => {
        depSpin.stop();
        console.log("\nNpm packages got installed\n".bgGreen.white);
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
