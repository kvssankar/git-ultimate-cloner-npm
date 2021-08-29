#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");
var Spinner = require("cli-spinner").Spinner;
var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");

let url = process.argv[3];
let foldername = process.argv[4];
let app;


  temp_str = url.replace("https://github.com/","");
  let t1,t2;
  for (let i=0;i<temp_str.length;i++) {
      if (temp_str[i]=="/") {
          t1=i+1;
          break;
      }
  }
  temp_str = temp_str.slice(t1);
  temp_str.replace("/","");
  app = temp_str;


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const run = async () => {
  await check();
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
    if (!shell.which("code")) {
      shell.echo("\nVS Code not installed\n".yellow);
    }
    resolve();
  });
};

const clone = () => {
  return new Promise((resolve) => {
    shell.echo("\nAll checks passed, Let the fun begin\n".rainbow);
    console.log(`\n ${capitalizeFirstLetter(app)} is being cloned...\n`.cyan);

    if (!foldername) {
      depSpin.start();
      shell.exec(`git clone ${url}`, () => {
        depSpin.stop();
        console.log(
          `\n\n ${capitalizeFirstLetter(app)} has been cloned successfully\n`
            .green
        );
      resolve();
      });
    } else {
      depSpin.start();
      shell.exec(`git clone ${url}`, () => {
        depSpin.stop();
        console.log(
          `\n\n ${capitalizeFirstLetter(app)} has been cloned successfully\n`
            .green
        );
      shell.exec(`mv ${app} ${foldername}`);
      resolve();
      });
    }
  });
};

const cd = () => {
  return new Promise((resolve) => {
    if (foldername) {
      shell.cd(`${foldername}`);
    } else {
      shell.cd(`${app}`);
    }
      if (!shell.test("-f", "package.json")) {
      console.log(`\n Can't find package.json in the root directory \n`.yellow);
      shell.cd("..");
      resolve();
    } else {
      shell.cd("..");
      console.log("\n Npm packages are being installed...".yellow);

      if (!foldername) {
        depSpin.start();
        shell.exec(`cd ${app} && npm install`, () => {
          depSpin.stop();
          console.log("\n Npm packages got installed\n".green);
          resolve();
        });
      } else {
        depSpin.start();
        shell.exec(`cd ${foldername} && npm install`, () => {
          depSpin.stop();
          console.log("\n Npm packages got installed\n".green);
          resolve();
        });
      }
    }
  });
};

const open = () => {
  return new Promise((resolve) => {
    console.log(
      `\n
    .-----------------TTTT_-----___
                     /''''''''''(___O] ----------_  \___/]
  _...---'"""\ --''   Q                               _____@
|'''                   ._   _____=---------"""""""
|                ..--''|   l L |_l   |
|          ..--''      .  /-___j '   '
|    ..--''           /  ,       '   '
|--''                /   /       '   '
    `.red
    );
    console.log("\nYou are all ready to go forth and conquer\n".trap);
    if (shell.which("code")) {
      if (!foldername) {
        shell.exec(`cd ${app} && code .`, () => {
          resolve();
        });
      } else {
        shell.exec(`cd ${foldername} && code .`, () => {
          resolve();
        });
      }
    }
  });
};

run();
