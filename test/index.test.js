describe("yieldToBrowser", () => {
  /** @type {import('../').default} */
  let yieldToBrowser;

  function MessagePortMock() {
    this.otherPort = undefined;
    this.onmessage = undefined;
    this.postMessage = () => {
      if (this.otherPort && this.otherPort.onmessage) {
        this.otherPort.onmessage({});
      }
    };
  }

  function MessageChannelMock() {
    this.port1 = new MessagePortMock();
    this.port2 = new MessagePortMock();

    this.port1.otherPort = this.port2;
    this.port2.otherPort = this.port1;
  }

  let rAFCallback;
  function rAFMock(callback) {
    rAFCallback = callback;
    return 1;
  }

  function renderFrame() {
    if (rAFCallback) {
      rAFCallback();
    }
  }

  beforeEach(() => {
    jest.resetModuleRegistry();
    rAFCallback = null;
    global.MessageChannel = MessageChannelMock;
    global.requestAnimationFrame = jest.fn(rAFMock);

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
    let time1, time2, time3;
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
    expect(time2).toBeGreaterThan(time1);
    expect(time3).toBeUndefined();

    // Third frame
    renderFrame();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(time1).toBeGreaterThan(0);
    expect(time2).toBeGreaterThan(time1);
    expect(time3).toBeGreaterThan(time2);
  });
});
