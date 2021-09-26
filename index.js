#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");
var Spinner = require("cli-spinner").Spinner;
var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

let idename = "code";

const help = () => {
  shell.echo("\nFirst cd into the folder you want to clone\n");
  shell.echo("\nUsage: quick clone <repo-link> <options>\n");
  shell.echo("where options is one of the below\n");
  shell.echo("-e atom   : for opening in atom editor");
  shell.echo("-e vscode : for opening in vscode editor");
};

const syntaxError = () => {
  console.log("Not a valid command. Please follow proper syntax\n".red);
  console.log(
    "Syntax : quick clone <url> [-e {editor name}]\n"
      .yellow
  );
  console.log("Supported editors : Visual Studio Code, Atom".yellow);
  console.log("For Visual Studio Code, use c. For Atom, use a\n".yellow);
};

if (process.argv[2] == "--help") {
  help();
  shell.exit(200);
}

let url = process.argv[3];
let options = process.argv.slice(4);

const optionsExc = () => {
  for (var i = 0; i < options.length; i++) {
    if (options[i] == "-e" && options[i + 1] == "a") {
      idename = options[i + 1];
      i++;
    }
  }
};

if (process.argv[2] != "clone") {
  syntaxError();
  shell.exit(1);
}
let url_length = url.length
if (url.slice(url_length-4,url_length) == ".git") {
  url = url.slice(0,url_length-4);
}
console.log(url);
temp_str = url.replace("https://github.com/", "");
let t1;
for (let i = 0; i < temp_str.length; i++) {
  if (temp_str[i] == "/") {
    t1 = i + 1;
    break;
  }
}
temp_str = temp_str.slice(t1);
temp_str.replace("/", "");

// getting github repo name

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
    shell.echo("\nAll checks passed, Let the fun begin\n".rainbow);
    console.log(
      `\n ${capitalizeFirstLetter(temp_str)} is being cloned...\n`.cyan
    );
    depSpin.start();
    shell.exec(`git clone ${url}`, () => {
      depSpin.stop();
      console.log(
        `\n\n ${capitalizeFirstLetter(temp_str)} has been cloned successfully\n`
          .green
      );
      resolve();
    });
  });
};

const cd = () => {
  return new Promise((resolve) => {
    shell.cd(`${temp_str}`);
    if (!shell.test("-f", "package.json")) {
      console.log(`\n Can't find package.json in the root directory \n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      console.log("\n Npm packages are being installed...".yellow);
      depSpin.start();
      shell.exec(`npm install`, () => {
        depSpin.stop();
        console.log("\n Npm packages got installed\n".green);
        resolve();
      });
    }
  });
};

const open = () => {
  return new Promise((resolve) => {
    checkIde(idename);
    console.log("\nYou are all ready to go forth and conquer\n".green);
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
