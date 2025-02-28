import {performance} from 'perf_hooks'

export class Timer {
  startTime: number
  endTime: number | null
  delta: number

  constructor() {
    this.startTime = 0
    this.endTime = null
    this.delta = 0
  }

  start() {
    this.startTime = performance.now()
  }

  stop() {
    this.endTime = performance.now()
    this.delta = this.endTime - this.startTime
  }

  getDelta(format = false) {
    if (format) {
      // return this.delta
      let minutes = Math.floor(this.delta / 60000)
      let seconds = ((this.delta % 60000) / 1000).toFixed(0)
      return minutes + 'm ' + (seconds < 10 ? '0' : '') + seconds + 's'
    } else {
      return this.delta
    }
  }
}
