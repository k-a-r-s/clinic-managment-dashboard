"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static formatDate() {
        return new Date().toISOString();
    }
    static colorize(color, text) {
        const colors = {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
        };
        return `${colors[color]}${text}${colors.reset}`;
    }
    static info(message, ...args) {
        console.log(`${this.colorize('cyan', '[INFO]')} ${this.formatDate()} - ${message}`, ...args);
    }
    static error(message, error) {
        console.error(`${this.colorize('red', '[ERROR]')} ${this.formatDate()} - ${message}`, error || '');
    }
    static warn(message, ...args) {
        console.warn(`${this.colorize('yellow', '[WARN]')} ${this.formatDate()} - ${message}`, ...args);
    }
    static success(message, ...args) {
        console.log(`${this.colorize('green', '[SUCCESS]')} ${this.formatDate()} - ${message}`, ...args);
    }
    static debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${this.colorize('magenta', '[DEBUG]')} ${this.formatDate()} - ${message}`, ...args);
        }
    }
    static http(method, path, statusCode, duration) {
        const color = statusCode >= 500 ? 'red'
            : statusCode >= 400 ? 'yellow'
                : statusCode >= 300 ? 'cyan'
                    : 'green';
        console.log(`${this.colorize('blue', '[HTTP]')} ${this.formatDate()} - ${this.colorize(color, method)} ${path} ${this.colorize(color, String(statusCode))} - ${duration}ms`);
    }
}
exports.Logger = Logger;
