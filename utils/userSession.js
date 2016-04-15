module.exports = function(req, res, next) {
    if ( req.session.username ||
            /^\/(login|favicon\.)/.test(req.url) ||
            /^\/(stylesheets|images|javascripts)\//.test(req.url) ) {

        next();
    } else {
        req.session.destinationUrl = req.url;
        res.redirect('/login');
    }
};