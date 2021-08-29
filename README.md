# Git ultimate cloner


Are you tired of cloning the repository, opening it in your favorite IDE, and installing packages, just to check an error in your friend's code or experimenting with a code!! No more, use our npm package and make your life easier.
This package clones the repository installs packages required from package.json and instantly opens your favorite IDE for you.

# What does it do?
1. Clones your repo
2. Installs all the npm packages
3. Opens your repo in vs code

![Demo](https://res.cloudinary.com/sankarkvs/image/upload/v1620725916/images/gunvvv_isldke.png)

# Use this 😎😎😎

    quick <repo-url>
    
or 
    
    quick <repo-url> [-c{custom folder name}] [-e{editor name}]
    
## Or this 🥵🥵🥵
    
    git clone <repo-url>
    cd repo-name
    code .
    ----open terminal in vs code----
    npm install

## Additional options
Editor and Custom folder names are optional.
### Open the code in your favorite IDE
If no parameter is passed, by default folder will be opened in Visual Studio Code
As editor name :

1. Use **c** for Visual Studio Code
    ```sh
    quick <repo-url> -ec
    ```
2. Use **a** for Atom
    ```sh
    quick <repo-url> -ea
    ```

### For cloning into a custom named folder :
```sh
quick <repo-url> [-c{custom folder name}]
```
Example :
```sh
quick https://github.com/Tanmay000009/git-ultimate-cloner/ -cCustom-Named-Folder
```
The package will clone the repository into a folder named "Custom-Named-Folder". And will by default open the code in Visual Studio Code, as no parameter has been passed with `-e`.

## Prerequisites

1.  node installed
2.  git installed globally
