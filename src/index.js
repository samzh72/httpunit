(function () {
    const logger = require('./logger').create(__filename);
    const express = require('express');
    const mock = require('./mock');
    const proxy = require('./proxy');
    let bodyParser = require('body-parser');

    let mockServer, proxyServer;

    module.exports.serve = function (options) {
        logger.configure(options.logOptions);
        logger.info('httpunit: programable http server');

        let app = express();

        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

        if (options.mockOptions) {
            mock.serve(app);
            mockServer = app.listen(options.mockOptions.port, options.mockOptions.host);
            logger.info('mock server listen on:' + options.mockOptions.port);
        }

        if (options.proxyOptions) {
            proxy.serve(app);
            proxyServer = app.listen(options.proxyOptions.port, options.proxyOptions.host);
            logger.info('proxy server listen on:' + options.proxyOptions.port);
        }
    }

    module.exports.close = function () {
        if (mockServer) {
            mockServer.close();
            mock.close();
        }
        if (proxyServer) {
            proxyServer.close();
            proxy.close();
        }
    }
}())