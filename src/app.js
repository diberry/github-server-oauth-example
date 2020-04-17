const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')

// Config
const GLOBALCONFIG = require('../src/config.js')

const session = require(`../src/lib/session.js`)
const metaroute = require('./routes/preroute');
const user = require('./routes/user')
const authenticationRouter = require('./routes/authentication')
const gitHubRouter = require('./routes/github');

// app config
let app = express();
app.locals = GLOBALCONFIG;

// cookies and sessions
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: `http://localhost:${GLOBALCONFIG.UI_PORT}`
}))
app.use(session.createSessionMiddleWare(GLOBALCONFIG.SESSION_SETTINGS))

app.use(express.static(path.join(__dirname, './public')));
app.use(metaroute.preroute)

// public routes
app.get('/status', (req, res) => {
  res.send(JSON.stringify(req.session));
});
app.get('/login', (req, res, next) => {
  const CONFIG = req.app.locals;

  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CONFIG.GITHUB_CLIENT_ID}&scope=user%20repo`);
})
app.use('/callback', authenticationRouter.router)

// authenticated routes
app.use('/github', authenticationRouter.isAuthenticated, gitHubRouter);
app.use('/user', authenticationRouter.isAuthenticated, user);

app.use(metaroute.errorHandling)
module.exports = app;
