(function () {
    const log4js = require('log4js');
    const path = require('path');

    let Logger = function (logger) {
        this.logger = logger;
    }

    /**
     * logOptions looks like:
     * {
     *      "logfile": "./log/sr.log",
     *      "passthrough": true,
     *      "modules": [
     *          {"name": "mymodule1", "level": "debug"},
     *          {"name": "mymodule2", "level": "trace"}
     *      ]
     * }
     * 
     * logger works even this function is not called at all
     * 
     * @param logOptions 
     * @param logOptions.logfile log file name, optional. won't log to file if not specified
     * @param logOptions.passthrough log message passthrough without padding timestamp, optional. default false(with timestamp)
     * @param logOptions.modules an array of module configurations, optional
     * @param logOptions.module.name module name
     * @param logOptions.module.level module log level
     */
    Logger.prototype.configure = function (logOptions) {
        let options = {
            categories: {
                default: {
                    appenders: [
                        "console"
                    ],
                    level: "info"
                }
            },
            appenders: {
                console: {
                    type: "console"
                }
            }
        };

        if (logOptions && logOptions.level) {
            options.categories.default.level = logOptions.level;
        }

        if (logOptions && logOptions.logfile) {
            options.categories.default.appenders.push('disk');
            options.appenders.disk = { type: "file", filename: logOptions.logfile }
        }

        if (logOptions && logOptions.passthrough) {
            options.appenders.console.layout = { type: 'messagePassThrough' };
            // whatever, log file will have timestamp in it
        }

        if (logOptions && logOptions.modules) {
            for (let m of logOptions.modules) {
                let cat = {
                    level: m.level
                };
                options.categories[m.name] = cat;
            }
        }

        log4js.configure(options);
    }

    Logger.prototype.fatal = function (message) {
        this.logger.fatal(message);
    }

    Logger.prototype.error = function (message) {
        this.logger.error(message);
    }

    Logger.prototype.warn = function (message) {
        this.logger.warn(message);
    }

    Logger.prototype.info = function (message) {
        this.logger.info(message);
    }

    Logger.prototype.debug = function (message) {
        this.logger.debug(message);
    }

    Logger.prototype.trace = function (message) {
        this.logger.trace(message);
    }

    /**
     * create a logger
     * 
     * a logger could log with levels:
     * trace, debug, info, warn, error, fatal
     * 
     * @param filename source file name. /path/to/abc.js will be transformed to module name: abc
     */
    module.exports.create = function (filename) {
        return new Logger(log4js.getLogger(path.basename(filename)));
    }

}());
