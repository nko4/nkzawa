var fs = require('fs')
  , path = require('path');


var _filename = path.basename(__filename);

fs.readdirSync(__dirname).forEach(function(filename) {
  if (filename === _filename) return;

  var extname = path.extname(filename);
  if (extname !== '.js') return;

  var basename = path.basename(filename, extname);
  exports[basename] = require('./' + basename);
});
