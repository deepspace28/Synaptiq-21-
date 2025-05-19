type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
}

class Logger {
  private context: string
  private isProduction: boolean

  constructor(context: string) {
    this.context = context
    this.isProduction = process.env.NODE_ENV === "production"
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    }
  }

  private log(entry: LogEntry): void {
    // In production, we might want to send logs to a service like Datadog, Sentry, etc.
    if (this.isProduction) {
      // Format for production logging
      const logObject = {
        level: entry.level,
        message: `[${this.context}] ${entry.message}`,
        timestamp: entry.timestamp,
        context: this.context,
        ...(entry.data && { data: entry.data }),
      }

      // Log as JSON string for easier parsing
      console.log(JSON.stringify(logObject))
    } else {
      // Development logging with colors
      const colors = {
        debug: "\x1b[34m", // blue
        info: "\x1b[32m", // green
        warn: "\x1b[33m", // yellow
        error: "\x1b[31m", // red
        reset: "\x1b[0m", // reset
      }

      const timestamp = new Date().toLocaleTimeString()
      const prefix = `${colors[entry.level]}[${entry.level.toUpperCase()}]\x1b[0m [${this.context}]:`

      if (entry.data) {
        console.log(`${prefix} ${entry.message}`, entry.data)
      } else {
        console.log(`${prefix} ${entry.message}`)
      }
    }
  }

  debug(message: string, data?: any): void {
    if (!this.isProduction) {
      this.log(this.createLogEntry("debug", message, data))
    }
  }

  info(message: string, data?: any): void {
    this.log(this.createLogEntry("info", message, data))
  }

  warn(message: string, data?: any): void {
    this.log(this.createLogEntry("warn", message, data))
  }

  error(message: string, error?: any): void {
    this.log(
      this.createLogEntry("error", message, {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : error,
      }),
    )
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context)
}

export const logger = createLogger("App")
