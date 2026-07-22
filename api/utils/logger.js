const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 }
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info

const logger = {
  debug: (...args) => { if (CURRENT_LEVEL <= LOG_LEVELS.debug) console.log('[DEBUG]', ...args) },
  info: (...args) => { if (CURRENT_LEVEL <= LOG_LEVELS.info) console.log('[INFO]', ...args) },
  warn: (...args) => { if (CURRENT_LEVEL <= LOG_LEVELS.warn) console.warn('[WARN]', ...args) },
  error: (...args) => { if (CURRENT_LEVEL <= LOG_LEVELS.error) console.error('[ERROR]', ...args) },
}

module.exports = logger
