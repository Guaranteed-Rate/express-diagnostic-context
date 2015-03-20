"use strict";
var cls     = require('continuation-local-storage');
var clsify  = require('cls-middleware');

var NAMESPACE = 'express-diagnostic-context';
var REQUESTID = 'edc-requestId';


function getNamespace() {
    return cls.getNamespace(NAMESPACE);
}
function middleware() {

    var ns = cls.createNamespace(NAMESPACE);
    var clsMiddleware = clsify(ns);

    return function(req, res, next) {
        clsMiddleware(req, res, function() {
            getNamespace().set(REQUESTID, req.requestId);
            next();
        });
    };
}

function getRequestId() {
    return getNamespace().get(REQUESTID);
}


function bind(callback) {
    getNamespace().bind(callback);
    return callback;
}

module.exports = {
    middleware: middleware,
    getRequestId : getRequestId,
    bind : bind
};
