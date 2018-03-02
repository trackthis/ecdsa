var fs   = require('fs-extra'),
    path = require('path');

fs.scandir = require('co').wrap(function* (dir) {
  var stat, filename, i, src = yield fs.readdir(dir);
  var output                 = [];
  for (i in src) {
    if (!src.hasOwnProperty(i)) { continue; }
    filename = path.join(dir, src[i]);
    stat     = yield fs.stat(filename);
    if (stat.isDirectory()) {
      output = output.concat(yield fs.scandir(filename));
    } else if (stat.isFile()) {
      output.push(filename);
    }
  }
  return output;
});
