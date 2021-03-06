"use strict";
var cls = require('continuation-local-storage'),
    clsify = require('cls-middleware');

var NAMESPACE = 'express-diagnostic-context';
var REQUESTID = 'edc-requestId';
var SESSIONID = 'edc-sessionId';


function init() {
    return cls.createNamespace(NAMESPACE);
}

function getNamespace() {
    return cls.getNamespace(NAMESPACE);
}

function middleware() {
    var clsMiddleware = clsify(getNamespace());

    return function(req, res, next) {
        clsMiddleware(req, res, function() {
            getNamespace().set(REQUESTID, req.requestId);
            getNamespace().set(SESSIONID, req.sessionId);
            next();
        });
    };
}

function getRequestId() {
    return getNamespace().get(REQUESTID);
}

function getSessionId() {
    return getNamespace().get(SESSIONID);
}

function bind(callback) {
    return getNamespace().bind(callback);
}

module.exports = {
    middleware: middleware,
    getRequestId: getRequestId,
    getSessionId: getSessionId,
    bind: bind,
    init: init
};
