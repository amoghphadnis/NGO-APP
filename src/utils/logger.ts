export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors and warnings
    if (__DEV__) {
      return true; // Log everything in development
    }
    return level === LogLevel.ERROR || level === LogLevel.WARN;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${entry.level}] ${entry.message}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    // Add to logs array
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging (safe for production)
    if (__DEV__) {
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(this.formatMessage(entry));
          break;
        case LogLevel.WARN:
          console.warn(this.formatMessage(entry));
          break;
        case LogLevel.INFO:
          console.info(this.formatMessage(entry));
          break;
        case LogLevel.DEBUG:
          console.log(this.formatMessage(entry));
          break;
      }
    } else {
      // Production: only errors to console
      if (entry.level === LogLevel.ERROR) {
        console.error(this.formatMessage(entry));
      }
    }
  }

  public error(message: string, data?: any): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      data,
    });
  }

  public warn(message: string, data?: any): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      data,
    });
  }

  public info(message: string, data?: any): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      data,
    });
  }

  public debug(message: string, data?: any): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      data,
    });
  }

  public getRecentLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
