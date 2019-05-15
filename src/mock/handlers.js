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
        return null;
    }
    /**
     * 
     * request:
     * {
     *      path: '/abc/:id',       // url to be handled, express format
     *      method: 'GET',          // http method
     *      response: {             // content handler will reponse to the url
     *          delay: 200,         // optional, milliseconds before response.
     *                              // 0 means no response at all
     *                              // if not specified, response will happen
     *                              // immediately.
     *          status: 200,        // http status code
     *          headers: {          // optional
     *              'X-any-header': 'any header value'
     *          },
     *          body: 'any string or object'  // optional, it could be string or json object
     *          cookies: [          // optional
     *              {
     *                  name: 'any-cookie-name',
     *                  value: 'cookie-value',
     *                  signed: false,
     *                  domain: 'google.com',
     *                  httpOnly: false,
     *                  expires: '2019-05-11T15:25:37.000Z',
     *                  maxAge: 2000，      // seconds, maxAge has higher prioirty than expires
     *                  path: '/',
     *                  secure: false,      // https only
     *                  sameSite: 'strict'  // strict or lax
     *              }
     *          ]
     *      }
     * }
     */
    function setHandlerApi(app) {
        app.put('/:serverId/handler', (req, res) => {
            if (!req.body) {
                logger.error('set handler failed - null param');
                res.status(400).end();
                return;
            }
            if (!req.params.serverId) {
                logger.error('set handler failed - no server id specified');
                res.status(400).end();
                return;
            }

            let failed = validateHandler(req.body);
            if (failed) {
                logger.error('set handler failed - ' + failed);
                res.status(400).end();
                return;
            }

            if (router.setHandler(req.params.serverId, req.body.path, req.body.method, req.body.response) == false) {
                logger.error('set handler failed - innvalid server id:' + req.params.serverId);
                res.status(400).end();
                return;
            }

            logger.info('set handler done for path:' + req.body.path);
            res.status(200).end();

        })
    }
    module.exports.serve = function (app) {
        setHandlerApi(app);
    }
}())