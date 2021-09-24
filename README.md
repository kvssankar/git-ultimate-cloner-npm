# Git ultimate cloner


Are you tried of cloning repository, opening it in ide and installing packages, just for reviewing code????
<br>
No more use,  `quick clone <git-repo-url>` and make your life easier.
<br>
This package clones the repositry, installs npm packages required from package.json and instantly opens the code in your favorite ide.

# What does it do?
1. Clones your repo
2. Installs all the npm packages
3. Opens your repositoy in your favorite ide

![Demo](https://user-images.githubusercontent.com/70322519/134666741-7c2f2d97-dc34-4296-9e30-2f3ad4aa891e.jpeg)
Currently supported ides : [Atom](https://atom.io/) , [Visual Studio Code](https://code.visualstudio.com/download) 
# Use this 😎😎😎

    quick clone <repository-url> [-e {editor name}]
    
   Note:
   > For Visual Studio Code, use c. For Atom, use a.
   
   > Opens in Visual Studio Code by defualt
    
## Or this 🥵🥵🥵
    
    git clone <repo-url>
    cd repository-name
    code .
    ----open terminal in vs code----
    npm install

## Examples
1. For Visual Studio Code (defualt) :
   ```sh
   quick clone https://github.com/Tanmay000009/git-ultimate-cloner
   ```
2. For Atom :
   ```sh
   quick clone https://github.com/Tanmay000009/git-ultimate-cloner -e a
   ```

## Prerequsites

1.  [NodeJS](https://nodejs.org/en/) installed.
2.  [Atom](https://atom.io/) or [Visual Studio Code](https://code.visualstudio.com/download) installed.
3.  [git](https://git-scm.com/) installed globally.
