/**
 * Queue of functions to invoke
 * @type {Array<(time: number) => void>}
 */
let callbacks = [];

let channel = new MessageChannel();

let postMessage = (function() {
  this.postMessage(undefined);
}).bind(channel.port2);

// Flush the callback queue when a message is posted to the message channel
channel.port1.onmessage = () => {
  // Reset the callback queue to an empty list in case callbacks call
  // afterFrame. These nested calls to afterFrame should queue up a new
  // callback to be flushed in the following frame and should not impact the
  // current queue being flushed
  let toFlush = callbacks;
  callbacks = [];
  let time = performance.now();
  for (let i = 0; i < toFlush.length; i++) {
    // Call all callbacks with the time the flush began, similar to requestAnimationFrame
    // TODO: Error handling?
    toFlush[i](time);
  }
};

// If the onmessage handler closes over the MessageChannel, the MessageChannel never gets GC'd:
channel = null;

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
