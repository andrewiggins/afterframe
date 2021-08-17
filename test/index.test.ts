// Validate correct TS import statement
import afterFrame from "../";

type Callback = (time: number) => void;

describe("afterFrame", () => {
  let afterFrame: typeof import("../").default;

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

  const delay = (ms = 5) => new Promise((resolve) => setTimeout(resolve, ms));

  async function renderFrame() {
    // Wait a beat to simulate these frames running at different times
    await delay();

    if (rAFCallback) {
      rAFCallback(performance.now());
    }
  }

  beforeEach(() => {
    jest.resetModules();
    rAFCallback = null;
    (global as any).performance = { now: Date.now };
    (global as any).MessageChannel = MessageChannelMock;
    (global as any).requestAnimationFrame = jest.fn(rAFMock);

    afterFrame = require("../");
  });

  it("uses rAF and MessageChannel to invoke callback", async () => {
    let time;
    let callback = jest.fn((t) => {
      time = t;
    });

    afterFrame(callback);
    await renderFrame();

    expect(callback).toHaveBeenCalled();
    expect(time).toBeGreaterThan(0);
  });

  it("runs multiple callbacks in one rAF for per frame", async () => {
    let callback = jest.fn();

    afterFrame(callback);
    afterFrame(callback);
    afterFrame(callback);

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(0);

    await renderFrame();
    expect(callback).toHaveBeenCalledTimes(3);

    afterFrame(callback);
    afterFrame(callback);
    afterFrame(callback);

    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledTimes(3);

    await renderFrame();
    expect(callback).toHaveBeenCalledTimes(6);
  });

  it("invokes nested callbacks in new frames", async () => {
    let time1: number | undefined,
      time2: number | undefined,
      time3: number | undefined;
    const callback3 = jest.fn((t3) => {
      time3 = t3;
    });
    const callback2 = jest.fn((t2) => {
      time2 = t2;
      afterFrame(callback3);
    });
    const callback1 = jest.fn((t1) => {
      time1 = t1;
      afterFrame(callback2);
    });

    // Schedule callback
    afterFrame(callback1);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(0);
    expect(callback3).toHaveBeenCalledTimes(0);
    expect(time1).toBeUndefined();
    expect(time2).toBeUndefined();
    expect(time3).toBeUndefined();

    // First frame
    await renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(0);
    expect(callback3).toHaveBeenCalledTimes(0);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeUndefined();
    expect(time3).toBeUndefined();

    // Second frame
    await renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(0);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeGreaterThan(time1 as number);
    expect(time3).toBeUndefined();

    // Third frame
    await renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeGreaterThan(time1 as number);
    expect(time3).toBeGreaterThan(time2 as number);
  });

  it("accepts callbacks that ignore the time argument", async () => {
    // Primarly a TypeScript types test
    let invoked = false;
    afterFrame(() => (invoked = true));
    await renderFrame();

    expect(invoked).toBe(true);
  });
});
