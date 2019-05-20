(function () {
    const logger = require('./logger').create(__filename);
    const express = require('express');
    const mock = require('./mock');
    const proxy = require('./proxy');
    let bodyParser = require('body-parser');

    let mockServer, proxyServer;
    let mockOptions;
    let proxyOptions;

    module.exports.serve = function (options) {
        logger.configure(options.logOptions);
        logger.info('httpunit: programable http server');

        if (options.mockOptions) {
            mockOptions = JSON.parse(JSON.stringify(options.mockOptions));
            if (!mockOptions.host) {
                mockOptions.host = 'localhost';
            }
            let app = express();
            app.use(bodyParser.json({ limit: '50mb' }));
            app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
            mock.serve(app);
            mockServer = app.listen(mockOptions.port, mockOptions.host);
            logger.info('mock server listen on:' + mockOptions.port);
        }

        if (options.proxyOptions) {
            proxyOptions = JSON.parse(JSON.stringify(options.proxyOptions));
            if (!proxyOptions.host) {
                proxyOptions.host = 'localhost';
            }
            let app = express();
            app.use(bodyParser.json({ limit: '50mb' }));
            app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
            proxy.serve(app);
            proxyServer = app.listen(proxyOptions.port, proxyOptions.host);
            logger.info('proxy server listen on:' + proxyOptions.port);
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

    module.exports.mockCreateServer = function (port, host) {
        if (!mockOptions) {
            logger.error('mock server is not launched');
        }
        else {
            return mock.createServer(mockOptions.port, mockOptions.host, port, host);
        }
    }
    module.exports.mockDeleteServer = function (serverId) {
        if (!mockOptions) {
            logger.error('mock server is not launched');
        }
        else {
            return mock.deleteServer(mockOptions.port, mockOptions.host, serverId);
        }
    }
    module.exports.mockInstallHandler = function (serverId, response) {
        if (!mockOptions) {
            logger.error('mock server is not launched');
        }
        else {
            return mock.installHandler(mockOptions.port, mockOptions.host, serverId, response);
        }
    }
}())