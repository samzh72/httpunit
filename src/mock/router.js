(function () {
    const logger = require('../logger').create(__filename);
    const pathToRegexp = require('path-to-regexp')

    function sendResponse(res, response) {
        if (response.headers) {
            for (let h in response.headers) {
                res.set(h, response.headers[h]);
            }
        }

        if (response.cookies) {
            for (let c of response.cookies) {
                res.cookie(c.name, c.value, {
                    domain: c.domain,
                    expires: c.expires,
                    httpOnly: c.httpOnly,
                    maxAge: c.maxAge,
                    path: c.path,
                    secure: c.secure,
                    signed: c.signed,
                    sameSite: c.sameSite
                });
            }
        }

        res.status(response.status).send(response.body);
    }
    /**
     * routers is an array of object, one for a server
     * {
     *      serverId: '12345678',
     *      routes: [
     *          {
     *              reg: '/abc',
     *              method: 'GET',
     *              response: {
     *                  ... // see comments of setHandlerApi()
     *              }
     *          }
     *      ]
     * }
     */
    let routers = [];
    module.exports.handle = function (serverId) {
        let router;
        for (router of routers) {
            if (router.serverId == serverId) {
                break;
            }
        }
        if (!router) {
            router = { serverId: serverId, routes: [] };
            routers.push(router);
        }

        return function (req, res, next) {
            logger.debug('request coming on server:' + serverId + ' with url:' + req.url);

            // find a specified route
            let route;
            for (let r of router.routes) {
                if (r.method == req.method && r.reg.exec(req.url)) {
                    route = r;
                    break;
                }
            }
            if (!route) {
                logger.error('invalid request path:' + req.url);
                res.status(404).end();
                next();
                return;
            }

            if (route.response.delay === undefined) {
                // response immediately
                sendResponse(res, route.response);
                next();
            }
            else if (route.response.delay == 0) {
                // never response
                // no next() called
            }
            else {
                // response after delay(ms)
                setTimeout(() => {
                    sendResponse(res, route.response);
                    next();
                }, route.response.delay);
            }
        }
    }

    module.exports.setHandler = function (serverId, path, method, response) {
        let router;
        for (router of routers) {
            if (router.serverId == serverId) {
                break;
            }
        }
        if (!router) {
            return false;
        }

        let route = {};
        route.reg = pathToRegexp(path);
        route.method = method;
        route.response = response;

        for (let r of router.routes) {
            if (r.reg.toString() == route.reg.toString() && r.method == method) {
                // replace response
                r.response = response;
                return true;
            }
        }

        router.routes.push(route);
        return true;
    }
}())