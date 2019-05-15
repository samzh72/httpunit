(function () {
    const serverApi = require('./servers');
    const handlerApi = require('./handlers');

    module.exports.serve = function (app) {
        serverApi.serve(app);
        handlerApi.serve(app);
    }

    module.exports.close = function () {
        serverApi.close();
    }
}())