(function () {
    let config = require('config');
    let hu = require('../src');

    before(function () {
        console.log('serving hu ....');
        hu.serve(config);
    });

    after(function () {
        console.log('closing hu ....');
        hu.close();
    });
}())