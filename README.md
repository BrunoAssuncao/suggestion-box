# Suggestion Box

This is a web-based suggestion box for **e.near** written with the **MEAN stack** technologies Mongo, Express, Angular and Node.
It is using grunt as task runner.

## starting it up

- do an `npm install`;
- create a **config.js** file on the root with the following settings:
```javascript
    process.env.PORT = 8181; //application port
    process.env.WEBMAIL_HOST = 'mail.<yourdomain>.<tld>'; //this is your company's webmail host, used for logging users in.
    process.env.MONGO_CONNECTION_STRING = 'mongodb://<host>:<port>/<db>';
```
- on the root folder, run `grunt` and if **Mongo** is accessible to the app, it should start listening on the **port** you specified.
