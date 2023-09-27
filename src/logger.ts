export default class Logger {
  static log(...message: any[]) {
    console.log(...message)
  }

  static error(...message: any[]) {
    console.error('[ERROR]: ', ...message)
  }
}