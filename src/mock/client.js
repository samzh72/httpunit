(function () {
    let rp = require('request-promise');

    module.exports.createServer = function (adminPort, adminHost, serverPort, serverHost) {
        return new Promise((resolve, reject) => {
            rp({
                resolveWithFullResponse: true,
                simple: false,
                rejectUnauthorized: false,
                timeout: 300000,
                headers: {
                    'user-agent': 'HTTPUnit Mock Client',
                    'content-type': 'application/json'
                },
                json: true,
                url: `http://${adminHost}:${adminPort}/server`,
                method: 'POST',
                body: {
                    port: serverPort,
                    host: serverHost
                }
            })
                .then(res => {
                    if (res.statusCode != 200) {
                        reject('create server failed:' + res.statusCode);
                    }
                    else {
                        resolve(res.body.serverId);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    module.exports.deleteServer = function (adminPort, adminHost, serverId) {
        return new Promise((resolve, reject) => {
            rp({
                resolveWithFullResponse: true,
                simple: false,
                rejectUnauthorized: false,
                timeout: 300000,
                headers: {
                    'user-agent': 'HTTPUnit Mock Client'
                },
                json: true,
                url: `http://${adminHost}:${adminPort}/server/${serverId}`,
                method: 'DELETE'
            })
                .then(res => {
                    if (res.statusCode != 200) {
                        reject('delete server failed:' + res.statusCode);
                    }
                    else {
                        resolve()
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    module.exports.installHandler = function (adminPort, adminHost, serverId, response) {
        return new Promise((resolve, reject) => {
            rp({
                resolveWithFullResponse: true,
                simple: false,
                rejectUnauthorized: false,
                timeout: 300000,
                headers: {
                    'user-agent': 'HTTPUnit Mock Client'
                },
                json: true,
                url: `http://${adminHost}:${adminPort}/${serverId}/handler`,
                method: 'PUT',
                body: response
            })
                .then(res => {
                    if (res.statusCode != 200) {
                        reject('delete server failed:' + res.statusCode);
                    }
                    else {
                        resolve()
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}())