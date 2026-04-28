// CryptoWolf OS — Structured Logger

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: unknown;
}

const ICONS: Record<LogLevel, string> = {
  info: '🔵',
  warn: '🟡',
  error: '🔴',
  debug: '⚪',
  success: '🟢',
};

class Logger {
  private history: LogEntry[] = [];
  private maxHistory = 500;

  private log(level: LogLevel, module: string, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data,
    };

    this.history.push(entry);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const prefix = `${ICONS[level]} [CryptoWolf:${module}]`;
    const ts = entry.timestamp.slice(11, 23);

    if (data !== undefined) {
      if (level === 'error') {
        console.error(`${prefix} ${ts} ${message}`, data);
      } else if (level === 'warn') {
        console.warn(`${prefix} ${ts} ${message}`, data);
      } else {
        console.log(`${prefix} ${ts} ${message}`, data);
      }
    } else {
      if (level === 'error') {
        console.error(`${prefix} ${ts} ${message}`);
      } else if (level === 'warn') {
        console.warn(`${prefix} ${ts} ${message}`);
      } else {
        console.log(`${prefix} ${ts} ${message}`);
      }
    }
  }

  info(module: string, message: string, data?: unknown) {
    this.log('info', module, message, data);
  }

  warn(module: string, message: string, data?: unknown) {
    this.log('warn', module, message, data);
  }

  error(module: string, message: string, data?: unknown) {
    this.log('error', module, message, data);
  }

  debug(module: string, message: string, data?: unknown) {
    this.log('debug', module, message, data);
  }

  success(module: string, message: string, data?: unknown) {
    this.log('success', module, message, data);
  }

  getHistory(): LogEntry[] {
    return [...this.history];
  }

  getErrors(): LogEntry[] {
    return this.history.filter(e => e.level === 'error');
  }
}

export const logger = new Logger();
export type { LogEntry, LogLevel };
