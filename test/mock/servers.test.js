(function () {
    const assert = require('assert');
    const rp = require('request-promise');
    const config = require('config');
    const hu = require('../../src');

    const mockPort = config.mockOptions.port;
    let serverId_9000, serverId_9001;

    describe('servers API - create server', () => {
        it('create server - with port only', done => {
            hu.mockCreateServer(9000)
                .then(serverId => {
                    assert(serverId);
                    serverId_9000 = serverId;
                    assert(serverId_9000 > 10000000 && serverId_9000 < 99999999);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        })
        it('create server - with port and host', done => {
            hu.mockCreateServer(9001)
                .then(serverId => {
                    assert(serverId);
                    serverId_9001 = serverId;
                    assert(serverId_9001 > 10000000 && serverId_9001 < 99999999);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        })
        it('create server - with nothing', done => {
            hu.mockCreateServer(undefined)
                .then(serverId => {
                    done(new Error('unexpected createServer success'));
                })
                .catch(err => {
                    done();
                })
        })
    })

    describe('servers API - delete server', () => {
        it('delete server 9000', done => {
            hu.mockDeleteServer(serverId_9000)
                .then(() => {
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('delete server 9001', done => {
            hu.mockDeleteServer(serverId_9001)
                .then(() => {
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('delete server which not exist', done => {
            hu.mockDeleteServer(00000000)
                .then(() => {
                    done(new Error('unexpected deleteServer success'));
                })
                .catch(err => {
                    done();
                })
        });
    })
}())