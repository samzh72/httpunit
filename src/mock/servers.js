(function () {
    const express = require('express');
    let router = require('./router');
    const logger = require('../logger').create(__filename);
    let cookieParser = require('cookie-parser');

    /**
     * array of server configs
     * {
     *      server: {},     // express server object
     *      serverId: '12345678', // 8-digit number
     * }
     */
    let servers = [];

    function createServerApi(app) {
        app.post('/server', (req, res) => {
            if (req.body == null) {
                logger.error('create server failed - null param');
                res.status(400).end();
                return;
            }
            if (req.body.port === undefined) {
                logger.error('create server failed - no port specified');
                res.status(400).end();
                return;
            }

            // 8-digit random number
            let serverId = Math.floor(Math.random() * 90000000) + 10000000;

            let mock = express();
            mock.use(cookieParser('secret'));
            mock.use(router.handle(serverId));
            let server = mock.listen(req.body.port, req.body.host);

            servers.push({ server: server, serverId: serverId });
            logger.info('create server done - ' + serverId);

            res.status(200).send({ serverId: serverId });
        })
    }

    function deleteServerApi(app) {
        app.delete('/server/:serverId', (req, res) => {
            if (!req.params.serverId) {
                logger.error('delete server failed - server id not specified');
                res.status(400).end();
                return;
            }

            for (let i = 0; i < servers.length; i++) {
                if (servers[i].serverId == req.params.serverId) {
                    servers[i].server.close();
                    servers.splice(i, 1);
                    logger.info('delete server done - ' + req.params.serverId);

                    res.status(200).end();
                    return;
                }
            }

            logger.error('delete server failed - invalid server id:' + req.params.id);
            res.status(400).end();
        })
    }

    module.exports.serve = function (app) {
        createServerApi(app);
        deleteServerApi(app);
    }

    module.exports.close = function () {
        servers.forEach((s, i) => {
            s.server.close();
        });
    }
}())