const fs = require('fs');
const path = require('path');
function noop() {}

const dircache = {};

function getDirectoryTree(dirpath) {
  if (dircache[dirpath]) return dircache[dirpath];

  const tree = fs.readdirSync(dirpath, { withFileTypes: true }).map((item) => {
    const itempath = path.join(dirpath, item.name);
    if (item.isDirectory()) {
      return getDirectoryTree(itempath);
    }

    return {
      name: item.name,
      extension: item.name.split('.').pop(),
      path: itempath,
      ftype: 'file',
      content: fs.readFileSync(itempath, 'utf8'),
    };
  });

  const dirobj = {
    name: path.basename(dirpath),
    path: dirpath,
    ftype: 'directory',
    children: tree,
  };

  dircache[dirpath] = dirobj;
  return dirobj;
}

function visitDirectoryTree (tree, visitor) {
  const { visitDirectory = noop, visitFile = noop } = visitor;
  if (tree.ftype === 'directory') {
    visitDirectory(tree);
    tree.children.forEach(item => visitDirectoryTree(item, visitor));
  }
  else visitFile(tree);
}

const appPath = path.resolve(__dirname, '../../app');
const APPDIR = getDirectoryTree(appPath);

module.exports = {
  getDirectoryTree,
  visitDirectoryTree,
  APPDIR,
};
