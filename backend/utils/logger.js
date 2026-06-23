// custom logger with standard levels
// setting up log config

const LOG_LEVELS = Object.freeze({
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
});

// fetching minimum log level
const currentLevel = () => {
    const envLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
    
    if (LOG_LEVELS[envLevel] !== undefined) {
        return LOG_LEVELS[envLevel];
    }
    
    return LOG_LEVELS.INFO;
};

// getting current time
const timestamp = () => {
    return new Date().toISOString();
};

// assigning colors
const COLORS = {
    TRACE: '\x1b[90m',
    DEBUG: '\x1b[36m',
    INFO:  '\x1b[32m',
    WARN:  '\x1b[33m',
    ERROR: '\x1b[31m',
    FATAL: '\x1b[41m\x1b[37m',
    RESET: '\x1b[0m'
};

// printing the log
const log = (level, context, message, meta) => {
    if (LOG_LEVELS[level] < currentLevel()) {
        return;
    }

    const color = COLORS[level];
    const reset = COLORS.RESET;
    const prefix = `${timestamp()} ${color}[${level}]${reset}`;
    
    // formatting prefix
    let ctx = '';
    if (context) {
        ctx = ` [${context}]`;
    }

    if (meta !== undefined) {
        console.log(`${prefix}${ctx} ${message}`, meta);
    } else {
        console.log(`${prefix}${ctx} ${message}`);
    }
};

// exposing functions
const logger = {
    trace: (context, message, meta) => log('TRACE', context, message, meta),
    debug: (context, message, meta) => log('DEBUG', context, message, meta),
    info:  (context, message, meta) => log('INFO',  context, message, meta),
    warn:  (context, message, meta) => log('WARN',  context, message, meta),
    error: (context, message, meta) => log('ERROR', context, message, meta),
    fatal: (context, message, meta) => log('FATAL', context, message, meta)
};

export default logger;
