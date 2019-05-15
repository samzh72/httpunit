(function () {
    const assert = require('assert');
    const axios = require('axios');
    const config = require('config');

    const mockPort = config.mockOptions.port;
    let serverId_9000, serverId_9001;

    describe('servers API - create server', () => {
        it('create server - with port only', done => {
            axios
                .request({
                    url: `http://localhost:${mockPort}/server`,
                    method: 'post',
                    data: { port: 9000 }
                })
                .then(res => {
                    assert(res.status == 200);
                    serverId_9000 = res.data.serverId;
                    assert(serverId_9000);
                    assert(serverId_9000 > 10000000 && serverId_9000 < 99999999);
                    done()
                })
                .catch(err => {
                    done(err);
                })
        })
        it('create server - with port and host', done => {
            axios
                .request({
                    url: `http://localhost:${mockPort}/server`,
                    method: 'post',
                    data: { port: 9001, host: '127.0.0.1' }
                })
                .then(res => {
                    assert(res.status == 200);
                    serverId_9001 = res.data.serverId;
                    assert(serverId_9001);
                    assert(serverId_9001 > 10000000 && serverId_9001 < 99999999);
                    done()
                })
                .catch(err => {
                    done(err);
                })
        })
        it('create server - with nothing', done => {
            axios
                .request({
                    url: `http://localhost:${mockPort}/server`,
                    method: 'post',
                    data: {}
                })
                .then(res => {
                    done(new Error('create server expect failed but success'));
                })
                .catch(err => {
                    assert(err.response.status == 400);
                    done();
                })
        })
    })

    describe('servers API - delete server', () => {
        it('delete server 9000', done => {
            axios
                .request({
                    url: `http://localhost:${mockPort}/server/${serverId_9000}`,
                    method: 'delete'
                })
                .then(res => {
                    assert(res.status == 200);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('delete server 9001', done => {
            axios
                .request({
                    url: `http://localhost:${mockPort}/server/${serverId_9001}`,
                    method: 'delete'
                })
                .then(res => {
                    assert(res.status == 200);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('delete server which not exist', done => {
            axios
                .request({
                    url: `http://localhost:${mockPort}/server/00000000`,
                    method: 'delete'
                })
                .then(res => {
                    done(new Error('delete server expect failed but success'));
                })
                .catch(err => {
                    assert(err.response.status == 400);
                    done();
                })
        });
    })
}())