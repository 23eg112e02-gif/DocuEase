const format = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
};

export const logInfo = (message) => {
  console.log(format('info', message));
};

export const logError = (error) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(format('error', message));
};
