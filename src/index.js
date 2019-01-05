// Useful commits to look at:
// * https://github.com/facebook/react/pull/14234
// * https://github.com/facebook/react/commit/8feeed10d8f79a0c01ca293890880cbe72b3788d#diff-603a307ec39e05daabd1c651dc2ffb15

/**
 * Queue of functions to invoke
 * @type {Array<(time: number) => void>}
 */
let callbacks = [];

const channel = new MessageChannel();

// Flush the callback queue when a message is posted to the message channel
channel.port1.onmessage = () => {
  // Reset the callback queue to an empty list in case callbacks call
  // yieldToBrowser. These calls to yieldToBrowser should queue up a new
  // callback to be flushed in the next yield and should not impact the
  // current queue being flushed

  // 193 B
  let toFlush = callbacks;
  callbacks = [];
  let time = performance.now();
  for (let i = 0; i < toFlush.length; i++) {
    // Call all callbacks with the time the flush began, similar to requestAnimationFrame
    // TODO: Error handling? (https://github.com/facebook/react/pull/14384)
    toFlush[i](time);
  }

  // 199 B
  // let time = performance.now();
  // callbacks.splice(0, callbacks.length).forEach(cb => cb(time));

  // 199 B
  // let toFlush = callbacks.splice(0, callbacks.length);
  // let time = performance.now();
  // for (let i = 0; i < toFlush.length; i++) {
  //   toFlush[i](time);
  // }
};

function postMessage() {
  channel.port2.postMessage(undefined);
}

/**
 * Invoke the given callback after the browser renders the next frame
 * @param {(time: number) => void} callback The function to call after the browser renders
 * the next frame. The callback function is passed one argument, a DOMHighResTimeStamp
 * similar to the one returned by performance.now(), indicating the point in time when
 * yieldToBrowser() starts to execute callback functions.
 */
export default function yieldToBrowser(callback) {
  if (callbacks.push(callback) === 1) {
    requestAnimationFrame(postMessage);
  }
}
