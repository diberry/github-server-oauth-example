var session = require('express-session');
var FileStore = require('session-file-store')(session);

module.exports.createSessionMiddleWare = (sessionConfiguration,) =>{
    return session({
        store: new FileStore(sessionConfiguration.FILE_SESSION.PATH),
        secret: sessionConfiguration.SECRET,
        saveUninitialized: false,
        resave: true,
        cookie: {
          secure: false,
          maxAge: 2160000000,
          httpOnly: false
      }
    });
}
module.exports.get = (req, key) =>{
  return req.session[key];
}
module.exports.set = (req, key, value) =>{
  if(!req || !key || !value) return;
  req.session[key] = value;
}