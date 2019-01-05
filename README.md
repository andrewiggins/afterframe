<!-- <p>
<a href="https://www.npmjs.org/package/yield-to-browser"><img src="https://img.shields.io/npm/v/mitt.svg?style=flat" alt="npm"></a> <a href="https://travis-ci.org/developit/mitt"><img src="https://travis-ci.org/developit/mitt.svg?branch=master" alt="travis"></a> <a href="https://david-dm.org/developit/mitt"><img src="https://david-dm.org/developit/mitt/status.svg" alt="dependencies Status"></a> <a href="https://unpkg.com/mitt/dist/mitt.umd.js"><img src="http://img.badgesize.io/https://unpkg.com/mitt/dist/mitt.umd.js?compression=gzip" alt="gzip size"></a> <a href="https://packagephobia.now.sh/result?p=mitt"><img src="https://packagephobia.now.sh/badge?p=mitt" alt="install size"></a>
</p> -->

# Yield To Browser

> Tiny 200b function to invoke a callback after the browser renders the next frame

## TODO

- Add note about how implementation is taken from React's scheduler
- Complete usage section
- Add section about browser support
- Add demo codepen to examples section
- Hook up AzureDevOps build
- Improve demo (index.html) file

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Examples & Demos](#examples--demos)
- [API](#api)
- [Contribute](#contribute)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save yield-to-browser
+ yield-to-browser@0.0.1
```

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import yieldToBrowser from 'yield-to-browser'

// using CommonJS modules
var yieldToBrowser = require('yield-to-browser')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/yield-to-browser/dist/yieldToBrowser.umd.js"></script>
```

You can find the function on `window.yieldToBrowser`.

## Usage

```js
import yieldToBrowser from 'yield-to-browser'

// TODO
```

## Examples & Demos

TODO

<!-- <a href="http://codepen.io/developit/pen/rjMEwW?editors=0110">
  <b>Preact + Mitt Codepen Demo</b>
  <br>
  <img src="https://i.imgur.com/CjBgOfJ.png" width="278" alt="preact + mitt preview">
</a> -->

## API

### yieldToBrowser

Invoke the given callback after the browser renders the next frame

#### Parameters

- `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The function to invoke after the browser renders the next frame. The callback function is passed one argument, a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp) similar to the one returned by [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), indicating the point in time when `yieldToBrowser()` starts to execute callback functions.

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](../../issues).
If don't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

- Fork it!
- Clone your fork: `git clone https://github.com/<your-username>/yield-to-browser`
- Navigate to the newly cloned directory: `cd yield-to-browser`
- Create a new branch for the new feature: `git checkout -b my-new-feature`
- Install the tools necessary for development: `npm install`
- Make your changes.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request with full remarks documenting your changes.
