var modules = require('../lib/modules'),
    fs = require('fs');

var context = {window: {}};

var kanso = modules.require({}, {
    'kanso': fs.readFileSync(__dirname + '/../commonjs/kanso.js').toString(),
    'templates': '// templates module'
}, '/', 'kanso', context);


exports['getBaseURL - browser'] = function (test) {
    kanso.isBrowser = true;
    var testpath = function (p) {
        context.window.location = {pathname: p};
        return kanso.getBaseURL();
    };
    test.equal(testpath('/'), '');
    test.equal(testpath('/some/path'), '');
    test.equal(
        testpath('/db/_design/doc/_rewrite/'),
        '/db/_design/doc/_rewrite'
    );
    test.equal(
        testpath('/db/_design/doc/_rewrite/some/path'),
        '/db/_design/doc/_rewrite'
    );
    test.done();
};

exports['getBaseURL - couchdb no vhost'] = function (test) {
    kanso.isBrowser = false;
    var testpath = function (p) {
        return kanso.getBaseURL({path: p, headers: {}});
    };
    test.equal(
        testpath(['db','_design','doc','_show','testshow']),
        '/db/_design/doc/_rewrite'
    );
    test.equal(
        testpath(['db','_design','doc','_list','testlist']),
        '/db/_design/doc/_rewrite'
    );
    test.equal(
        testpath(['db','_design','doc']),
        '/db/_design/doc/_rewrite'
    );
    test.done();
};

exports['getBaseURL - couchdb with vhost'] = function (test) {
    kanso.isBrowser = false;
    var testpath = function (p) {
        var req = {
            path: ['db','_design','doc','_show','testshow'],
            headers: {'x-couchdb-vhost-path': p}
        };
        return kanso.getBaseURL(req);
    };
    test.equal(testpath('/'), '');
    test.equal(testpath('/some/path'), '');
    test.done();
};

exports['getBaseURL - couchdb no request'] = function (test) {
    kanso.isBrowser = false;
    test.throws(function () {
        kanso.getBaseURL();
    });
    test.done();
};

exports['getURL using pathname'] = function (test) {
    var testpath = function (p) {
        context.window.location = {pathname: p};
        return kanso.getURL();
    };
    test.equal(testpath('/'), '/');
    test.equal(testpath('/some/path'), '/some/path');
    test.equal(testpath('/db/_design/doc/_rewrite/'), '/');
    test.equal(testpath('/db/_design/doc/_rewrite/some/path'), '/some/path');
    test.done();
};

exports['getURL using hash'] = function (test) {
    var testpath = function (p, h) {
        context.window.location = {pathname: p, hash: h};
        return kanso.getURL();
    };
    test.equal(testpath('/', '#/'), '/');
    test.equal(testpath('/', '#/some/path'), '/some/path');
    test.equal(testpath('/db/_design/doc/_rewrite/','#/'), '/');
    test.equal(
        testpath('/db/_design/doc/_rewrite/','#/some/path'),
        '/some/path'
    );
    test.done();
};

exports['getURL hash priority over pathname'] = function (test) {
    var testpath = function (p, h) {
        context.window.location = {pathname: p, hash: h};
        return kanso.getURL();
    };
    test.equal(testpath('/other/path', '#/'), '/');
    test.equal(testpath('/other/path', '#/some/path'), '/some/path');
    test.equal(testpath('/db/_design/doc/_rewrite/other/path','#/'), '/');
    test.equal(
        testpath('/db/_design/doc/_rewrite/other/path','#/some/path'),
        '/some/path'
    );
    test.done();
};
