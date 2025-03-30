export class Logger {

  public static debug(msg: string, ...args: any[]): void {
    console.log(`debug: \x1b[36m${msg}\x1b[0m`, ...args);
  }

  public static info(msg: string, ...args: any[]): void {
    console.log(`\x1b[34minfo: \x1b[0m${msg}`, ...args);
  }

  public static warn(msg: string, ...args: any[]): void {
    console.warn(`\x1b[33mwarn: \x1b[0m${msg}`, ...args);
  }

  public static error(msg: string, ...args: any[]): void {
    console.error(`\x1b[31merror: \x1b[0m${msg}`, ...args);
  }

}
