<p>
<a href="https://www.npmjs.org/package/afterframe"><img src="https://img.shields.io/npm/v/afterframe.svg?style=flat" alt="npm"></a> <a href="https://dev.azure.com/andrewiggins-gh/afterframe/_build?definitionId=2&_a=summary"><img src="https://dev.azure.com/andrewiggins-gh/afterframe/_apis/build/status/andrewiggins.afterframe?branchName=master" alt="
Azure DevOps Build Status"></a> <a href="https://unpkg.com/afterframe/dist/afterframe.umd.js"><img src="https://img.badgesize.io/https://unpkg.com/afterframe/dist/afterframe.umd.js?compression=gzip" alt="gzip size"></a> <a href="https://packagephobia.now.sh/result?p=afterframe"><img src="https://packagephobia.now.sh/badge?p=afterframe" alt="install size"></a>
</p>

# AfterFrame

> Tiny function to invoke a callback after the browser renders the next frame

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Examples & Demos](#examples--demos)
- [API](#api)
- [Prior Work](#prior-work)
- [Contribute](#contribute)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --save afterframe
+ afterframe@0.0.0
```

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import afterFrame from "afterframe";

// using CommonJS modules
var afterFrame = require("afterframe");
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/afterframe/dist/afterframe.umd.js"></script>
```

You can find the function on `window.afterFrame`.

## Usage

> Inspired by [Nolan Lawson's blog on measuring layout](https://nolanlawson.com/2018/09/25/accurately-measuring-layout-on-the-web/)

```js
import afterFrame from "afterframe";

performance.mark("start");

// Do some work...

afterFrame(() => {
  performance.mark("end");
});
```

`afterFrame` currently relies on [`requestAnimationFrame`](https://caniuse.com/#feat=requestanimationframe) and [`MessageChannel`](https://caniuse.com/#feat=channel-messaging) so support starts at IE10 and above.

## Examples & Demos

[Sample CodePen demonstrating usage of afterFrame](https://codepen.io/andrewiggins/pen/Ydvapy?editors=0010)

Example function wrapping `afterFrame` in a `Promise`:

```js
let promise = null;
function afterFrameAsync() {
  if (promise === null) {
    promise = new Promise(resolve =>
      afterFrame(time => {
        promise = null;
        resolve(time);
      })
    );
  }

  return promise;
}
```

## API

### afterFrame

Invoke the given callback after the browser renders the next frame

#### Parameters

- `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The function to invoke after the browser renders the next frame. The callback function is passed one argument, a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp) similar to the one returned by [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), indicating the point in time when `afterFrame()` starts to execute callback functions.

## Prior Work

- The implementation for this package is heavily inspired by [React's Scheduler](https://github.com/facebook/react/blob/master/packages/scheduler/src/Scheduler.js). Some commits of particular interest:
  - [Post to MessageChannel instead of window ](https://github.com/facebook/react/pull/14234)
  - [Remove window.postMessage fallback](https://git.io/fhsQk)
  - [Reduce scheduler serialization overhead](https://github.com/facebook/react/pull/14249)
- [Jason Miller's tweet](https://twitter.com/_developit/status/1081681351122829325) of the same function provided some good inspiration for reducing code size
- [Nolan Lawson blogged](https://nolanlawson.com/2018/09/25/accurately-measuring-layout-on-the-web/) about using a similar technique to more accurately measure layout time

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](../../issues).
If don't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

- Fork it!
- Clone your fork: `git clone https://github.com/<your-username>/afterframe`
- Navigate to the newly cloned directory: `cd afterframe`
- Create a new branch for the new feature: `git checkout -b my-new-feature`
- Install the tools necessary for development: `npm install`
- Make your changes.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request with full remarks documenting your changes.
