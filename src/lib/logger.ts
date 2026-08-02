export type LogLevel = "debug" | "info" | "warn" | "error";

export type Logger = {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

const levelRank: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function createLogger(
  minLevel: LogLevel = "info",
  write: (line: string) => void = console.error,
): Logger {
  const emit = (level: LogLevel, message: string): void => {
    if (levelRank[level] < levelRank[minLevel]) {
      return;
    }

    write(`[${level}] ${message}`);
  };

  return {
    debug: (message) => {
      emit("debug", message);
    },
    info: (message) => {
      emit("info", message);
    },
    warn: (message) => {
      emit("warn", message);
    },
    error: (message) => {
      emit("error", message);
    },
  };
}
