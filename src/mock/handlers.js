(function () {
    let router = require('./router');
    const logger = require('../logger').create(__filename);

    function validateHandler(params) {
        if (!params.path) {
            return 'no path specified';
        }
        if (!params.path.startsWith('/')) {
            return 'path has to start with \/';
        }
        if (!params.method) {
            return 'no method specified';
        }
        if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(params.method)) {
            return 'wrong method specified:' + params.method;
        }
        if (!params.response) {
            return 'no response specified';
        }
        if (!params.response.status) {
            return 'no response status specified';
        }
        if (params.response.body) {
            if (typeof params.response.body !== 'string' && typeof params.response.body !== 'object') {
                return 'wrong reponse body type';
            }
        }
        if (params.response.headers && typeof params.response.headers != 'object') {
            return 'wrong response headers type';
        }
        if (params.response.cookies) {
            if (!params.response.cookies.every((c, i) => {
                if (!c.name) {
                    return false;
                }
                if (!c.value) {
                    return false;
                }
                return true;
            })) {
                return 'cookie must have name and value';
            }
        }
        return null;
    }

    function installHandlerApi(app) {
        app.put('/:serverId/handler', (req, res) => {
            if (!req.body) {
                logger.error('install handler failed - null param');
                res.status(400).end();
                return;
            }
            if (!req.params.serverId) {
                logger.error('install handler failed - no server id specified');
                res.status(400).end();
                return;
            }

            let failed = validateHandler(req.body);
            if (failed) {
                logger.error('install handler failed - ' + failed);
                res.status(400).end();
                return;
            }

            if (router.setHandler(req.params.serverId, req.body.path, req.body.method, req.body.response) == false) {
                logger.error('install handler failed - innvalid server id:' + req.params.serverId);
                res.status(400).end();
                return;
            }

            logger.info('install handler done for path:' + req.body.path);
            res.status(200).end();

        })
    }
    module.exports.serve = function (app) {
        installHandlerApi(app);
    }
}())