loginOnExchange = require('./utils/loginOnExchange');

var loginData = {
    webmailHost: 'mail.edotgen.com',
    username: '',
    password: '',
    https: true
};

loginOnExchange( loginData, function( error, success ) {
    if ( success ) {
        console.log('Login OK');
    } else {
        console.log('error: ' + error);
    }
});