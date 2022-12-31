# Git ultimate cloner

For contributing please read [this](https://github.com/kvssankar/git-ultimate-cloner/blob/master/CONTRIBUTING.md)


## Use this 😎😎😎

    npm i -g git-ultimate-cloner

    guc clone <repository-url>


## Or this 🥵🥵🥵

    cd desktop
    cd projects
    git clone <repo-url>
    cd repository-name
    code .
    open terminal in vs code
    npm install
	cd client
	npm install
	cd ..
	cd server
	npm install
	cd ..
	npm run dev

# What does it do?

1. Clones your repo
2. Installs all the npm packages Or dart, php... [find more](https://github.com/kvssankar/git-ultimate-cloner/blob/master/README.md#supports-various-package-managers)present in the repo (even the inner folders).
3. Opens your repositoy in your favorite ide

   All in a single step 🤩🤩🤩

4. Set your default path so that **WHEREVER** you open your command prompt it will clone into the path you set

   Example: Your projects folder (Open cmd in any folder and it will clone into your projects folder)

## Documentation

> For usage details: guc --help

1.  To simply clone:
	
	```
	guc clone <repo-link>
	```

2.  To set default path to clone into:

        guc set-folder default "C:\Users\SANKAR KUMAR\Desktop\projects"

3.  If u set a default folder but want to clone into current folder then:

        guc clone <repo-link> --folder current

4.  Set more custom folders to clone ur projects into respective folders:

        guc set-folder myfolder "C:\Users\SANKAR KUMAR\Desktop\projects\myfolder"

5.  To clone into custom folder:

        guc clone <repo-link> --folder myfolder

6.  To open in your atom ide (by default opens in vscode):

        guc clone <repo-link> --ide atom

7. To set default ide:

		guc set-ide default atom

# Currently supported various package managers:

Automatically searches and installs...

1. NPM Packages
2. PHP Modules
3. Yarn and pnpm
4. Dart Packages
5. Ruby Gems
6. Rust Crates
7. Go Packages
8. Maven Dependencies

> For more feature suggestions visit:

[GitHub Repo](https://github.com/kvssankar/git-ultimate-cloner.git)

## Prerequsites

1.  [NodeJS](https://nodejs.org/en/) installed.
2.  [git](https://git-scm.com/) installed globally.

## Contributors

## Contributors

<table>
	<tr align="center">
		<td>
		Kvs Sankar Kumar
		<p align="center">
			<img src = "https://user-images.githubusercontent.com/70322519/135128594-9d853a7c-c501-4c8d-9943-ac984569ae7f.png" width="150" height="150" alt="Kvs Sankar Kumar">
		</p>
			<p align="center">
				<a href = "https://github.com/kvssankar">
					<img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/>
				</a>
				<a href = "https://www.linkedin.com/in/sankarkvs/">
					<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
				</a>
			</p>
		</td>
        <td>
		Tanmay Vyas
		<p align="center">
			<img src = "https://user-images.githubusercontent.com/70322519/135129327-554cead3-1245-4024-95e8-7d704341ab63.png" width="150" height="150" alt="Tanmay Vyas">
		</p>
			<p align="center">
				<a href = "https://github.com/Tanmay000009">
					<img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/>
				</a>
				<a href = "https://www.linkedin.com/in/tanmay-vyas-09/">
					<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
				</a>
			</p>
		</td>
        <td>
		Dev Sharma
		<p align="center">
			<img src = "https://avatars.githubusercontent.com/u/50591491?v=4" width="150" height="150" alt="Dev Sharma">
		</p>
			<p align="center">
				<a href = "https://github.com/cryptus-neoxys">
					<img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/>
				</a>
				<a href = "https://www.linkedin.com/in/cryptus-neoxys/">
					<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
				</a>
			</p>
		</td>
    </tr>
</table>

---

```javascript
if (youLikedOurPackage) {
  starThisRepository();
}
```

---
