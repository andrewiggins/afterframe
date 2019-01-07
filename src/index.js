/**
 * Queue of functions to invoke
 * @type {Array<(time: number) => void>}
 */
let callbacks = [];

const channel = new MessageChannel();

// Flush the callback queue when a message is posted to the message channel
channel.port1.onmessage = () => {
  // Reset the callback queue to an empty list in case callbacks call
  // afterFrame. These calls to afterFrame should queue up a new
  // callback to be flushed in the following frame and should not impact the
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
 * afterFrame() starts to execute callback functions.
 */
export default function afterFrame(callback) {
  if (callbacks.push(callback) === 1) {
    requestAnimationFrame(postMessage);
  }
}
