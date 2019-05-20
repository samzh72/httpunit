(function () {
    const assert = require('assert');
    const rp = require('request-promise');
    const config = require('config');
    const hu = require('../../src');

    const mockPort = config.mockOptions.port;
    const SERVER_PORT = 9000;
    let serverId;

    const REQUEST_TIMEOUT = 5 * 1000;
    const RESPONSE_BODY_STRING = 'body string to be verified';
    const RESPONSE_BODY_OBJECT = { text: 'body object to be verified' };
    const RESPONSE_BODY_STRING_BIG = 'big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.big body string to be compressed.';
    const RESPONSE_HEADERS = { // keep header field in lower case because express will return like that
        'server': 'httpunit',
        'x-my-header': 'My-Header-Value'
    };
    const RESPONSE_COOKIES = [
        {
            name: 'cookie-name',
            value: 'any-cookie-value',
            signed: false,
            domain: 'google.com',
            httpOnly: false,
            expires: '2019-6-11T15:25:37.000Z',
            maxAge: 200000,
            path: '/',
            secure: false,
            sameSite: 'strict'
        },
        {
            name: 'cookie-name1',
            value: 'any-cookie-value',
            signed: true,
            domain: 'facebook.com',
            httpOnly: true,
            expires: '2019-6-11T15:25:37.000Z',
            maxAge: 200000,
            path: '/',
            secure: false,
            sameSite: 'lax'
        }
    ]

    function testHandler(routePath, method, requestPath, response, verifyRes, verifyErr) {
        hu.mockInstallHandler(serverId, {
            path: routePath,
            method: method,
            response: response
        })
            .then(() => {
                return rp({
                    url: `http://localhost:${SERVER_PORT}${requestPath}`,
                    method: 'GET',
                    headers: {  // tell server client support compression.
                        "accept-encoding": "gzip, deflate, br"
                    },
                    timeout: REQUEST_TIMEOUT,
                    resolveWithFullResponse: true,
                    simple: false,
                    json: true,
                    gzip: true
                })
            })
            .then(res => {
                verifyRes(res);
            })
            .catch(err => {
                verifyErr(err);
            })
    }

    describe('handler API', () => {
        before(done => {
            hu.mockCreateServer(SERVER_PORT)
                .then(sid => {
                    serverId = sid;
                    assert(serverId);
                    assert(serverId > 10000000 && serverId < 99999999);
                    done()
                })
                .catch(err => {
                    done(err);
                })
        });

        after(done => {
            hu.mockDeleteServer(serverId)
                .then(() => {
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('set handler - plain url', done => {
            let routePath = requestPath = '/normal';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus
            }, res => {
                assert(res.statusCode == testStatus);
                done();
            }, err => {
                done(err);
            })
        });

        it('set handler - url with parameter', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus
            }, res => {
                assert(res.statusCode == testStatus);
                done();
            }, err => {
                done(err);
            })
        });

        it('set handler - url with queries', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc?abc=def';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus
            }, res => {
                assert(res.statusCode == testStatus);
                done();
            }, err => {
                done(err);
            })
        });

        it('set handler - url unmatched', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normala/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus
            }, res => {
                assert(res.statusCode == 404);
                done();
            }, err => {
                done(err);
            })
        });

        it('set handler - delay = 0', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                delay: 0,
                status: testStatus
            }, res => {
                done(new Error('unexpected response'));
            }, err => {
                done();
            })
        })

        it('set handler - delay = 2s', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            let begin = Date.now();
            testHandler(routePath, 'GET', requestPath, {
                delay: 2000,
                status: testStatus
            }, res => {
                let end = Date.now();
                assert((end - begin) >= 2000);
                assert(res.statusCode == testStatus);
                done();
            }, err => {
                done(err);
            })
        })

        it('set handler - with headers', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus,
                headers: RESPONSE_HEADERS
            }, res => {
                assert(res.statusCode == testStatus);
                assert(res.headers);
                for (let h in RESPONSE_HEADERS) {
                    assert(RESPONSE_HEADERS[h] == res.headers[h]);
                }
                done();
            }, err => {
                done(err);
            })
        })

        it('set handler - with cookies', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus,
                cookies: RESPONSE_COOKIES
            }, res => {
                assert(res.statusCode == testStatus);
                assert(res.headers);
                let cookies = res.headers['set-cookie'];
                assert(cookies);
                assert(cookies.length == RESPONSE_COOKIES.length);
                done();
            }, err => {
                done(err);
            })
        })

        it('set handler - with string body', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus,
                body: RESPONSE_BODY_STRING
            }, res => {
                assert(res.statusCode == testStatus);
                assert(res.body == RESPONSE_BODY_STRING);
                done();
            }, err => {
                done(err);
            })
        })

        it('set handler - with object body', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus,
                body: RESPONSE_BODY_OBJECT
            }, res => {
                assert(res.statusCode == testStatus);
                assert(JSON.stringify(res.body) == JSON.stringify(RESPONSE_BODY_OBJECT));
                done();
            }, err => {
                done(err);
            })
        })

        it('set handler - with compressed response', done => {
            let routePath = '/normal/:abc';
            let requestPath = '/normal/abc';
            let testStatus = 201;

            testHandler(routePath, 'GET', requestPath, {
                status: testStatus,
                body: RESPONSE_BODY_STRING_BIG
            }, res => {
                assert(res.statusCode == testStatus);
                assert(res.headers['transfer-encoding'] == 'chunked');
                // axios will decompress automatically if 'content-type' is 'gzip'
                // res.data is always plain text
                assert(res.body == RESPONSE_BODY_STRING_BIG);
                done();
            }, err => {
                done(err);
            })
        })
    })
}())