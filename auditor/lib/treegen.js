const fs = require('fs');
const path = require('path');

function noop() {}
const dircache = {};

function shouldIgnore(name) {
  if (!name) return true;
  if (name.startsWith('.') || name.endsWith('.lock')) return true;
  return [
    'node_modules',
    'packaged',
    'target',
    'dist',
    'server_dist'
  ].includes(name);
}

function getDirectoryTree(dirpath) {
  if (dircache[dirpath]) return dircache[dirpath];

  const tree = fs.readdirSync(dirpath, { withFileTypes: true }).map((item) => {
    if (shouldIgnore(item.name)) return undefined;

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
  }).filter(Boolean);

  const dirobj = {
    name: path.basename(dirpath),
    path: dirpath,
    ftype: 'directory',
    children: tree,
  };

  dircache[dirpath] = dirobj;
  return dirobj;
}

function traverseDirectoryTree (tree, visitor) {
  const { visitDirectory = noop, visitFile = noop } = visitor;
  if (tree.ftype === 'directory') {
    visitDirectory(tree);
    tree.children.forEach(item => traverseDirectoryTree(item, visitor));
  }
  else visitFile(tree);
}

const appPath = path.resolve(__dirname, '../../app');
const APPDIR = getDirectoryTree(appPath);

module.exports = {
  getDirectoryTree,
  traverseDirectoryTree,
  APPDIR,
};
