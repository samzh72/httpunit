(function () {
    const serverApi = require('./servers');
    const handlerApi = require('./handlers');
    const client = require('./client');

    module.exports.serve = function (app) {
        serverApi.serve(app);
        handlerApi.serve(app);
    }

    module.exports.close = function () {
        serverApi.close();
    }

    module.exports.createServer = client.createServer;
    module.exports.deleteServer = client.deleteServer;
    module.exports.installHandler = client.installHandler;
}())