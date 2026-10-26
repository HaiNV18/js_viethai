
const isDevelopment = import.meta.env?.DEV ?? process.env.NODE_ENV !== "production";

const Logger = {
    debug: (...args) => {
        if (isDevelopment) {
            console.debug(`[DEBUG] [${new Date().toISOString()}]`, ...args);
        }
    },

    info: (...args) => {
        if (isDevelopment) {
            console.info(`[INFO] [${new Date().toISOString()}]`, ...args);
        }
    },

    warn: (...args) => {
        console.warn(`[WARN] [${new Date().toISOString()}]`, ...args);
    },

    error: (...args) => {
        console.error(`[ERROR] [${new Date().toISOString()}]`, ...args);
    },

    log: (...args) => {
        if (isDevelopment) {
            console.log(`[LOG] [${new Date().toISOString()}]`, ...args);
        }
    },

    group: (label) => {
        if (isDevelopment) console.group(label);
    },

    groupEnd: () => {
        if (isDevelopment) console.groupEnd();
    },

    table: (data) => {
        if (isDevelopment) console.table(data);
    },
};

export default Logger;
