// Validate correct TS import statement
import yieldToBrowser from "../";

type Callback = (time: number) => void;

describe("yieldToBrowser", () => {
  let yieldToBrowser: typeof import("../").default;

  class MessagePortMock {
    public otherPort: MessagePortMock | undefined;
    public onmessage: ((event: any) => void) | undefined;

    public postMessage() {
      if (this.otherPort && this.otherPort.onmessage) {
        this.otherPort.onmessage({});
      }
    }
  }

  class MessageChannelMock {
    public port1 = new MessagePortMock();
    public port2 = new MessagePortMock();

    constructor() {
      this.port1.otherPort = this.port2;
      this.port2.otherPort = this.port1;
    }
  }

  let rAFCallback: Callback | null = null;
  function rAFMock(callback: Callback) {
    rAFCallback = callback;
    return 1;
  }

  function renderFrame() {
    if (rAFCallback) {
      rAFCallback(performance.now());
    }
  }

  beforeEach(() => {
    jest.resetModuleRegistry();
    rAFCallback = null;
    (global as any).MessageChannel = MessageChannelMock;
    (global as any).requestAnimationFrame = jest.fn(rAFMock);

    yieldToBrowser = require("../dist/yieldToBrowser");
  });

  it("uses rAF and MessageChannel to invoke callback", () => {
    let time;
    let callback = jest.fn(t => {
      time = t;
    });

    yieldToBrowser(callback);
    renderFrame();

    expect(callback).toHaveBeenCalled();
    expect(time).toBeGreaterThan(0);
  });

  it("runs multiple callbacks in one rAF for per frame", () => {
    let callback = jest.fn();

    yieldToBrowser(callback);
    yieldToBrowser(callback);
    yieldToBrowser(callback);

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(0);

    renderFrame();
    expect(callback).toHaveBeenCalledTimes(3);

    yieldToBrowser(callback);
    yieldToBrowser(callback);
    yieldToBrowser(callback);

    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledTimes(3);

    renderFrame();
    expect(callback).toHaveBeenCalledTimes(6);
  });

  it("invokes nested yields in new frames", () => {
    let time1: number | undefined,
      time2: number | undefined,
      time3: number | undefined;
    const callback3 = jest.fn(t3 => {
      time3 = t3;
    });
    const callback2 = jest.fn(t2 => {
      time2 = t2;
      yieldToBrowser(callback3);
    });
    const callback1 = jest.fn(t1 => {
      time1 = t1;
      yieldToBrowser(callback2);
    });

    // Schedule yield
    yieldToBrowser(callback1);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(0);
    expect(callback3).toHaveBeenCalledTimes(0);
    expect(time1).toBeUndefined();
    expect(time2).toBeUndefined();
    expect(time3).toBeUndefined();

    // First frame
    renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(0);
    expect(callback3).toHaveBeenCalledTimes(0);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeUndefined();
    expect(time3).toBeUndefined();

    // Second frame
    renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(0);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeGreaterThan(time1 as number);
    expect(time3).toBeUndefined();

    // Third frame
    renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeGreaterThan(time1 as number);
    expect(time3).toBeGreaterThan(time2 as number);
  });

  it("accepts callbacks that ignore the time argument", () => {
    // Primarly a TypeScript types test
    let invoked = false;
    yieldToBrowser(() => (invoked = true));
    renderFrame();

    expect(invoked).toBe(true);
  });
});
