
var app = require('./app')
  , routes = require('../app/routes')
  , auth = require('../app/routes/auth')
  , vms = require('../app/routes/vms')
  , users = require('../app/routes/users');


function loginRequired(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  next();
}

app.get('/', routes.index)

// auth
app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/signup', auth.signup);
app.get('/auth/github', auth.github);
app.get('/auth/github/callback', auth.githubCallback, auth.successCallback);

// vms
app.param('vmId', vms.vmId);
app.get('/vms/new', loginRequired, vms.new);
app.get('/vms/:vmId', vms.show);

// users
app.param('userId', users.userId);
app.get('/users/:userId', users.show);
