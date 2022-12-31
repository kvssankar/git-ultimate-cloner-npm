#!/usr/bin/env node
const { program } = require("commander");
const shell = require("shelljs");
const colors = require("colors");
const run = require("./main");
const store = require("data-store")("guc");

async function main() {
  program
    .name("git-ultimate-cloner")
    .description("Smarter way to clone git repositories.")
    .version("4.0.0");

  program
    .command("set-folder <folderName> <path>")
    .description(
      "Set a custom folder to clone into.To set default folder, use 'default' as folderName. Use quotes in path if it contains spaces."
    )
    .action((folderName, path) => {
      if (!shell.test("-d", path)) {
        console.log("Invalid path");
        return;
      }
      if (folderName === "ide") {
        console.log("Cannot name folder 'ide'.");
        return;
      }
      if (folderName === "current") {
        console.log("Cannot name folder 'current'.");
        return;
      }
      store.set(folderName, path);
      console.log("Set folder", folderName, path);
    });

  program
    .command("delete-folder <folderName>")
    .description("Delete a custom folder.")
    .action((folderName) => {
      if (store.has(folderName)) {
        store.del(folderName);
        console.log("Deleted folder", folderName);
      } else {
        console.log("Folder not found");
      }
    });

  program
    .command("list-folders")
    .description("List all custom folders.")
    .action(() => {
      console.log(store.data);
    });

  program
    .command("clear-folders")
    .description("Clear all custom folders.")
    .action(() => {
      store.clear();
      console.log("Cleared all folders");
    });

  program
    .command("update-folder <folderName> <path>")
    .description("Update a custom folder.")
    .action((folderName, path) => {
      if (!shell.test("-d", path)) {
        console.log("Invalid path");
        return;
      }
      if (folderName === "ide") {
        console.log("Cannot name folder 'ide'.");
        return;
      }
      if (folderName === "current") {
        console.log("Cannot name folder 'current'.");
        return;
      }
      if (store.has(folderName)) {
        store.set(folderName, path);
        console.log("Updated folder", folderName, path);
      } else {
        console.log("Folder not found");
      }
    });

  program
    .command("set-ide <ide>")
    .description("Set the default ide to open the cloned repository in.")
    .action((ide) => {
      store.set("ide", ide);
      console.log("Set ide", ide);
    });

  //add custom help
  program.addHelpText(
    "after",
    `
    Examples:

    Cloning a repository into a custom folder:
    $ guc clone <repo-url>
    $ guc clone <repo-url> -f <folder-name>
    $ guc clone <repo-url> -f current  //clone into current folder

    Cloning a repository into a custom folder and opening it in an editor:

    NOTE: BY default, the editor is set to vscode.
    $ guc clone <repo-url> -f <folder-name> -i <editor> //editors: vscode, atom, sublime

    Setting a custom folder:
    $ guc set-folder <folder-name> <path>
    $ guc set-folder default <path> //to always clone into a particular folder

    Deleting a custom folder:
    $ guc delete-folder <folder-name>

    Listing all custom folders:
    $ guc list-folders

    Clearing all custom folders:
    $ guc clear-folders

    Updating a custom folder:
    $ guc update-folder <folder-name> <path>

    Setting the default ide:
    $ guc set-ide <ide> //editors: vscode, atom, sublime
    `
  );

  program
    .command("clone <url>")
    .description("Clone a git repository.")
    .option("-i, --ide <editor>", "Open the cloned repository in an editor.")
    .option("-f, --folder <folder>", "Clone the repository into a folder.")
    .action(run);

  program.showHelpAfterError();

  await program.parseAsync(process.argv);
}

main();
