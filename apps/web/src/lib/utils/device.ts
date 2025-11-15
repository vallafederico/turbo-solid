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
		Device.initMonitoring();
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
			Device.initWorker();
			Device.useWorker = true;
		} else {
			Device.useWorker = false;
			setInterval(() => {
				Device.initWebglMonitoring();
			}, Device.perf.interval);
		}
	}

	static initWorker(): void {
		const workerCode = () => {
			const perf: PerformanceMetrics = {
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

			self.onmessage = (e: MessageEvent) => {
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
		Device.worker = new Worker(workerUrl);

		Device.worker.onmessage = (e: MessageEvent) => {
			if (e.data.type === "perfUpdate") {
				Device.fps = e.data.fps;
				if (Device.power !== e.data.power) {
					Device.power = e.data.power;
				}
			}
		};

		// Initialize the worker with the interval values
		Device.worker.postMessage({
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
		Device.perf.lastMeasured = [];
		Device.perf.isMonitoring = true;
		Device.perf.last = performance.now();
		setTimeout(() => {
			Device.stopWebglMonitoring();
		}, WEBGL_MONITORING_DURATION);
	}

	static stopWebglMonitoring(): void {
		Device.perf.isMonitoring = false;
		const avgFps = Device.perf.readMeasured();
		if (!isNaN(avgFps)) {
			Device.power = Device.calculatePower(avgFps);
			Device.fps = avgFps;
		}
	}

	static monitorWebgl(): void {
		if (Device.useWorker) {
			if (Device.worker) {
				Device.worker.postMessage({
					type: "monitor",
					timestamp: performance.now(),
				});
			}
		} else {
			if (!Device.perf.isMonitoring) return;
			const currentLoop = performance.now();
			const fps = 1000 / (currentLoop - Device.perf.last!);
			if (!isNaN(fps)) {
				Device.perf.last = currentLoop;
				Device.perf.lastMeasured.push(fps);
			}
		}
	}

	// >>> OBSERVABLES
	static addPowerObserver(callback: (power: PowerLevel) => void): void {
		Device.observers.push(callback);
	}

	static removePowerObserver(callback: (power: PowerLevel) => void): void {
		Device.observers = Device.observers.filter((obs) => obs !== callback);
	}

	static notifyObservers(): void {
		Device.observers.forEach((callback) => callback(Device._power));
	}

	static set power(newValue: PowerLevel) {
		if (Device._power !== newValue) {
			Device._power = newValue;
			Device.notifyObservers();
			console.table({
				power: Device._power,
				fps: Device.fps?.toFixed(2),
			});
		}
	}

	static get power(): PowerLevel {
		return Device._power;
	}
}
