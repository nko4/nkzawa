
var app = require('./app')
  , routes = require('../app/routes')
  , auth = require('../app/routes/auth');

app.get('/', routes.index)

app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/signup', auth.signup);
app.get('/auth/github', auth.github);
app.get('/auth/github/callback', auth.githubCallback, auth.successCallback);

//app.param('vmId', vms.vmId);
//app.get('/vms', vms.index);
//app.get('/vms/new', vms.new);
//app.get('/vms/:vmId', vms.show);

