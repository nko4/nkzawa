
module.exports = function(socket, next) {
  if (!socket.request.user) {
    var err = new Error();
    err.data = new Error();
    err.data.status = 401;
  }
  next(err);
};


