
module.exports = function(socket, next) {
  console.log('user:', socket.request.user);
  if (socket.request.user) {
    var err = new Error();
    err.data = new Error();
    err.data.status = 401;
  }
  next(err);
};


