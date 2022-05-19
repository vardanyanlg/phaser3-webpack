![phaser3-parcel-playable-logo](/src/img/logo.png)
## Phaser 3 + Webpack 5
> A Phaser 3 project template for JavaScript (ES6 support via Babel) and Webpack 5 that includes local server with  hot-reloading for development and production builds.

### Features
- Final build with minification and code optimization
- Modern code with inheritance classes, arrow functions, as well as asynchronous code, and all this will work even in older browsers thanks to the built-in BabelJS

### Requirements
[Node.js](https://nodejs.org/) (with npm) and I recommend installing and using [Yarn 3](https://yarnpkg.com/).

### Getting Started
You need to either download this project or clone it:
```bash
git clone https://github.com/vardanyanlg/phaser3-webpack.git
```
Make sure you are in the project, if not then go there:
```bash
cd phaser3-webpack
```
Now you need to install all the necessary dependencies for the project to work:
```bash
yarn install
```

Everything is ready to start the project.
For local testing use (localhost:8000 will open auto in browser) and without stat warnings
```bash
yarn watch
```
Or use `yarn start` for start dev server with show stat warnings

To build the final file use
```bash
yarn build
```

The finished `index.html` file is waiting for you in the `dist` folder
