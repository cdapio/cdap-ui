/*
 * Copyright © 2024 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

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
