#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");
var Spinner = require("cli-spinner").Spinner;
var depSpin = new Spinner("%s");
depSpin.setSpinnerString("|/-\\");


// cmd clone <link> [custom folder name] [ideaname : by default VS Code]
                                        // a = atom ;v = vscode
let foldername,idename;
let url = process.argv[3];
let temp1 = process.argv[4];
let temp2 = process.argv[5];
if (temp1) {
  if (temp1[0]=="-" && temp1[1]=="e") {
    if (temp1[2]=="a") {
      idename = "atom";
    } else {
      idename = "code";
    }
  } else if (temp1[0]=="-" && temp1[1]=="c") {
    foldername = temp1.slice(2);
  } else {
    console.log("Not a valid command. Please follow proper syntax\n".red);
    console.log("Syntax : lit clone <url> [-e{editor name}] [-c{custom folder name}]\n".yellow);
    console.log("Supported editors : Visual Studio Code, Atom".yellow);
    console.log("For Visual Studio Code, use c. For Atom, use a\n".yellow);
    shell.exit(1);
  }
}
if (temp2) {
  if (temp2[0]=="-" && temp2[1]=="e") {
    if (temp2[2]=="a") {
      idename = "atom";
    } else {
      idename = "code";
    }
  } else if (temp2[0]=="-" && temp2[1]=="c") {
    foldername = temp2.slice(2);
  } else {
    console.log("Not a valid command. Please follow proper syntax\n".red);
    console.log("Syntax : lit clone <url> [-e{editor name}] [-c{custom folder name}]\n".yellow);
    console.log("Supported editors : Visual Studio Code, Atom".yellow);
    console.log("For Visual Studio Code, use c. For Atom, use a\n".yellow);
    shell.exit(1);
  }
}
let app;
if (process.argv[2]!= "clone") {
  console.log("Not a valid command. Please follow proper syntax\n".red);
  console.log("Syntax : lit clone <url> [-e{editor name}] [-c{custom folder name}]\n".yellow);
  console.log("Supported editors : Visual Studio Code, Atom".yellow);
  console.log("For Visual Studio Code, use code. For Atom, use atom\n".yellow)
  shell.exit(1);
}


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
    var chk = checkIde(idename);
    if (chk!="no issues") {
      shell.echo(chk.yellow);
    }
    resolve();
  });
};

const clone = () => {
  return new Promise((resolve) => {
    shell.echo("\nAll checks passed, Let the fun begin\n".rainbow);
    console.log(`\n ${capitalizeFirstLetter(app)} is being cloned...\n`.cyan);
    depSpin.start();
    shell.exec(`git clone ${url}`, () => {
      depSpin.stop();
      console.log(
        `\n\n ${capitalizeFirstLetter(app)} has been cloned successfully\n`
          .green
      );
    resolve();
    if (foldername) {
      shell.exec(`mv ${app} ${foldername}`);
    }
    });
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
    console.log("\nYou are all ready to go forth and conquer\n".trap);
    if (checkIde(idename)=="no issues") {
        if (!foldername) {
          shell.exec(`cd ${app} && ${idename} .`, () => {
            resolve();
          });
        } else {
          shell.exec(`cd ${foldername} && ${idename} .`, () => {
            resolve();
          });
        }
    }
    
  });
};

const checkIde = (idename) => {
  if (idename=="code") {
    if (!shell.which("code")) {
      return "\nVS Code not installed\n";
    }
  } else {
    if (!shell.which("atom")) {
      return "\nAtom not installed\n";
    }
  }
  return "no issues"
}

run();
