#!/usr/bin/env node
const shell = require("shelljs");
const colors = require("colors");

let url = process.argv[2];

let names = [];

function reverseString(str) {
  return str.reverse().join("");
}

for (let i = url.length - 5; i > 0; i--) {
  if (url[i] === "/") break;
  names.push(url[i]);
}

let app = reverseString(names);

const run = async () => {
  await clone();
  await cd();
  await open();
  shell.exit(200);
};

const clone = () => {
  return new Promise((resolve) => {
    console.log(`\n ${app} is being cloned\n`.cyan);
    shell.exec(`git clone ${url}`, () => {
      console.log(`\n ${app} has been cloned\n`.blue);
      resolve();
    });
  });
};

const cd = () => {
  return new Promise((resolve) => {
    console.log(`\n npm packages being installed \n`.cyan);
    shell.exec(`cd ${app} && npm i`, () => {
      console.log("\n npm packages installed\n".blue);
      resolve();
    });
  });
};

const open = () => {
  return new Promise((resolve) => {
    console.log(`\n opening vs code ... \n`.cyan);
    shell.exec(`cd ${app} && code .`, () => {
      console.log("\n opened vs code\n".blue);
      resolve();
    });
  });
};

run();
