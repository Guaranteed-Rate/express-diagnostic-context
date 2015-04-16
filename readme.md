## Express Diagnostic Context

This package provides a middleware that takes requestId and sessionId from the Express's request object and makes it available 
at all points of the asyncronous execution for a given request.

```
var edc = require('express-diagnostic-context');


app.use(function(req, res, next) {
    req.requestId = Math.random();
})
app.use(edc.middleware());
app.use(function(req, res, next) {
    console.log(edc.getRequestId());
    console.log(edc.getRequestId());
    return next();
});
```

# Caveat

Currently, this is implemented using continuation-local-storage which has a limitation described [here|https://github.com/othiym23/node-continuation-local-storage/issues/6#issuecomment-32528908]

The workaround is to bind the callback to the namespace explicitly prior to passing it to library that breaks the continuation chain. 
```
db.collection("dumb").findOne({a:1}, edc.bind(function(err, result) {
    console.log("result for " + edc.getRequestID() + " is " + result);
}));
```
