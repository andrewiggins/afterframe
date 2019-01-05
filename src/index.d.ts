/**
 * Invoke the given callback after the browser renders the next frame
 * @param {(time: number) => void} callback The function to call after the browser renders
 * the next frame. The callback function is passed one argument, a DOMHighResTimeStamp
 * similar to the one returned by performance.now(), indicating the point in time when
 * yieldToBrowser() starts to execute callback functions.
 */
export function yieldToBrowser(callback: (time: number) => void): void;
