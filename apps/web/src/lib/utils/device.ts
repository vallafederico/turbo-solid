const PERFORMANCE_MONITORING_INTERVAL = 3000;
const WEBGL_MONITORING_DURATION = 1000;

export type PowerLevel = "low" | "medium" | "high" | null;

export interface PerformanceMetrics {
  last: number | null;
  interval: number;
  isMonitoring: boolean;
  lastMeasured: number[];
  readMeasured: () => number;
}

export interface DeviceConfig {
  power: PowerLevel;
  fps: number | null;
  useWorker: boolean;
  worker: Worker | null;
  observers: ((power: PowerLevel) => void)[];
  perf: PerformanceMetrics;
}

export class Device {
  private static _power: PowerLevel = null;
  private static fps: number | null = null;
  private static useWorker = false;
  private static worker: Worker | null = null;
  private static observers: ((power: PowerLevel) => void)[] = [];
  private static perf: PerformanceMetrics = {
    last: null,
    interval: PERFORMANCE_MONITORING_INTERVAL,
    isMonitoring: false,
    lastMeasured: [],
    readMeasured: () => {
      return (
        Device.perf.lastMeasured.reduce((a, b) => a + b, 0) /
        Device.perf.lastMeasured.length
      );
    },
  };

  static {
    this.initMonitoring();
  }

  static get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  static onDeviceChange(): void {
    window.addEventListener("resize", () => {
      if (Device.isMobile) {
        // Mobile-specific code
      } else {
        // Desktop-specific code
      }
    });
  }

  static initMonitoring(): void {
    if (typeof Worker !== "undefined") {
      this.initWorker();
      this.useWorker = true;
    } else {
      this.useWorker = false;
      setInterval(() => {
        this.initWebglMonitoring();
      }, this.perf.interval);
    }
  }

  static initWorker(): void {
    const workerCode = function () {
      let perf: PerformanceMetrics = {
        last: null,
        interval: 3000, // Default value, will be overwritten
        isMonitoring: false,
        lastMeasured: [],
        readMeasured: () => {
          return (
            perf.lastMeasured.reduce((a, b) => a + b, 0) /
            perf.lastMeasured.length
          );
        },
      };

      let WEBGL_MONITORING_DURATION = 1000; // Default value, will be overwritten

      function calculatePower(value: number): PowerLevel {
        if (isNaN(value)) return null;
        let result: PowerLevel = "high";
        if (value < 50) result = "low";
        if (value < 65) result = "medium";
        return result;
      }

      function initWebglMonitoring(): void {
        perf.lastMeasured = [];
        perf.isMonitoring = true;
        perf.last = Date.now();
        setTimeout(() => {
          stopWebglMonitoring();
        }, WEBGL_MONITORING_DURATION);
      }

      function stopWebglMonitoring(): void {
        perf.isMonitoring = false;
        const avgFps = perf.readMeasured();
        if (!isNaN(avgFps)) {
          const power = calculatePower(avgFps);
          self.postMessage({ type: "perfUpdate", power: power, fps: avgFps });
        }
      }

      function monitorWebgl(timestamp: number): void {
        if (!perf.isMonitoring) return;
        const currentLoop = timestamp;
        const fps = 1000 / (currentLoop - perf.last!);
        if (!isNaN(fps)) {
          perf.last = currentLoop;
          perf.lastMeasured.push(fps);
        }
      }

      self.onmessage = function (e: MessageEvent) {
        switch (e.data.type) {
          case "init":
            perf.interval = e.data.interval;
            WEBGL_MONITORING_DURATION = e.data.duration;
            setInterval(() => {
              initWebglMonitoring();
            }, perf.interval);
            break;
          case "monitor":
            monitorWebgl(e.data.timestamp);
            break;
        }
      };
    };

    const blob = new Blob([`(${workerCode.toString()})()`], {
      type: "application/javascript",
    });
    const workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(workerUrl);

    this.worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === "perfUpdate") {
        this.fps = e.data.fps;
        if (this.power !== e.data.power) {
          this.power = e.data.power;
        }
      }
    };

    // Initialize the worker with the interval values
    this.worker.postMessage({
      type: "init",
      interval: PERFORMANCE_MONITORING_INTERVAL,
      duration: WEBGL_MONITORING_DURATION,
    });

    URL.revokeObjectURL(workerUrl);
  }

  static calculatePower(value: number): PowerLevel {
    if (isNaN(value)) return null;
    let result: PowerLevel = "high";
    if (value < 50) result = "low";
    if (value < 65) result = "medium";
    return result;
  }

  static initWebglMonitoring(): void {
    this.perf.lastMeasured = [];
    this.perf.isMonitoring = true;
    this.perf.last = performance.now();
    setTimeout(() => {
      this.stopWebglMonitoring();
    }, WEBGL_MONITORING_DURATION);
  }

  static stopWebglMonitoring(): void {
    this.perf.isMonitoring = false;
    const avgFps = this.perf.readMeasured();
    if (!isNaN(avgFps)) {
      this.power = this.calculatePower(avgFps);
      this.fps = avgFps;
    }
  }

  static monitorWebgl(): void {
    if (this.useWorker) {
      if (this.worker) {
        this.worker.postMessage({
          type: "monitor",
          timestamp: performance.now(),
        });
      }
    } else {
      if (!this.perf.isMonitoring) return;
      const currentLoop = performance.now();
      const fps = 1000 / (currentLoop - this.perf.last!);
      if (!isNaN(fps)) {
        this.perf.last = currentLoop;
        this.perf.lastMeasured.push(fps);
      }
    }
  }

  // >>> OBSERVABLES
  static addPowerObserver(callback: (power: PowerLevel) => void): void {
    this.observers.push(callback);
  }

  static removePowerObserver(callback: (power: PowerLevel) => void): void {
    this.observers = this.observers.filter((obs) => obs !== callback);
  }

  static notifyObservers(): void {
    this.observers.forEach((callback) => callback(this._power));
  }

  static set power(newValue: PowerLevel) {
    if (this._power !== newValue) {
      this._power = newValue;
      this.notifyObservers();
      console.table({
        power: this._power,
        fps: this.fps?.toFixed(2),
      });
    }
  }

  static get power(): PowerLevel {
    return this._power;
  }
}
