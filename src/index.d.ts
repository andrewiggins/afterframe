/** Invoke the given callback after the browser renders the next frame */
export function yieldToBrowser(callback: (time: number) => void): void;
