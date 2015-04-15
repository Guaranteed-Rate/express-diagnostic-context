'use strict';

var edc = require('../edc.js');
var test = require('tap').test;

test("assert all the things", function (t) {
  t.plan(7);

  var http    = require('http');
  var express = require('express');
  var request = require('request');
  
  var assertIds = function() {
    t.equal(edc.getRequestId(), 'reqId111');
    t.equal(edc.getSessionId(), 'sessId111');

  };
  var assertThatBindWorks;

    var app = express();
    app.use(function(req, res, next) {
        //setup the data
        req.requestId = 'reqId111';
        req.sessionId = 'sessId111';
        next();
    });

    //code under test
    app.use(edc.middleware());

    app.get('/THUNDAR', function (req, res) {
      assertThatBindWorks = edc.bind(assertIds);
      assertIds();

      res.send({status : 'ok'});
      res.end();
    });

    var server = http.createServer(app).listen(8080, function () {
      request('http://localhost:8080/THUNDAR',
              {json : true},
              function (error, res, body) {
        t.notOk(error, "no error found");
        t.equal(res.statusCode, 200, "got OK response");
        t.deepEqual(body, {status : 'ok'}, "body was as expected");
        server.close();

        assertThatBindWorks();

      });
    });

  });

