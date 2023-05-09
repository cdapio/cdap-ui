const fs = require('fs');
const path = require('path');

try {
  fs.symlinkSync(
    path.resolve('node_modules/@bower_components'),
    'bower_components',
    'junction'
  );
} catch (e) {
  // PASS
}
