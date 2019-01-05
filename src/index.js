// Useful commits to look at:
// * https://github.com/facebook/react/pull/14234
// * https://github.com/facebook/react/commit/8feeed10d8f79a0c01ca293890880cbe72b3788d#diff-603a307ec39e05daabd1c651dc2ffb15

/** Only schedule animation frame once per frame */
let scheduledFrame = 0;

/**
 * Queue of functions to invoke
 * @type {Array<(time: number) => void>}
 */
let callbacks = [];

const channel = new MessageChannel();
const port = channel.port2;

// Flush the callback queue when a message is posted to the message channel
channel.port1.onmessage = function() {
  scheduledFrame = 0;

  // Reset the callback queue to an empty list in case callbacks call
  // yieldToBrowser. These calls to yieldToBrowser should queue up a new
  // callback to be flushed in the next yield and should not impact the
  // current queue being flushed
  let toFlush = callbacks;
  callbacks = [];

  let time = performance.now();
  for (let i = 0; i < toFlush.length; i++) {
    // Call all callbacks with the time the flush began, for debug purposes
    // TODO: Error handling? (https://github.com/facebook/react/pull/14384)
    toFlush[i](time);
  }
};

/**
 * Invoke the given callback after the browser renders the next frame
 * @param {(time: number) => void} callback The function to call after the browser renders
 * the next frame. The callback function is passed one argument, a DOMHighResTimeStamp
 * similar to the one returned by performance.now(), indicating the point in time when
 * yieldToBrowser() starts to execute callback functions.
 */
export default function yieldToBrowser(callback) {
  if (!scheduledFrame) {
    scheduledFrame = requestAnimationFrame(() => {
      // See https://github.com/facebook/react/pull/14249
      // for explanation of why use `undefined` here
      port.postMessage(undefined);
    });
  }

  callbacks.push(callback);
}
