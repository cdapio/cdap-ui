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

const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse').default;

const { getDirectoryTree, traverseDirectoryTree } = require('../lib/treegen');
const { isJs, isTs } = require('../lib/fileUtils');
const { getCodeFragment } = require('../lib/strUtils');

const rootPath = path.resolve(__dirname, '../../');
const packageJson = JSON.parse(fs.readFileSync(path.resolve(rootPath, 'package.json'), 'utf8'));
let deps = Object.keys(packageJson.dependencies).reduce((acc, key) => {
  acc[key] = {
    name: key,
    type: 'dependency',
    version: packageJson.dependencies[key],
    importedIn: new Set(),
    importCount: 0,
    canRemove: false,
  };
  return acc;
}, {});

deps = Object.keys(packageJson.devDependencies).reduce((acc, key) => {
  acc[key] = {
    name: key,
    type: 'devDependency',
    version: packageJson.devDependencies[key],
    importedIn: new Set(),
    importCount: 0,
    canRemove: false,
  };
  return acc;
}, deps);

function getTopDir(abspath) {
  return path.relative(rootPath, abspath).split('/')[0];
}

function incUse(src, filepath) {
  for (const lib of Object.keys(deps)) {
    if (src === lib || src.startsWith(lib + '/')) {
      deps[lib].importCount += 1;
      deps[lib].importedIn.add(getTopDir(filepath));
    }
  }
}

const BABEL_PARSER_OPTS = {
  sourceType: "unambiguous",
  plugins: ['jsx', 'typescript']
};

const visitor = {
  visitFile(file) {
    if (isJs(file) || isTs(file)) {
      const ast = babelParser.parse(file.content, BABEL_PARSER_OPTS);
      babelTraverse(ast,  {
        ImportDeclaration(path) {
          const importedFrom = path.node.source.value;
          incUse(importedFrom, file.path);
        },

        CallExpression(path) {
          if (path.node.callee.name === 'require' && path.node.arguments[0].type === 'StringLiteral') {
            const requiredFrom = path.node.arguments[0].value;
            incUse(requiredFrom, file.path);
          }
        }
      });
    }
  }
}

function main() {
  traverseDirectoryTree(getDirectoryTree(rootPath), visitor);
  const depsArr = Object.values(deps);
  const csvArr = [["Package name", "Version", "Dependency type", "Import count", "Imported in", "Can remove"]];

  for (const dep of depsArr) {
    dep.importedIn = '"' + Array.from(dep.importedIn).join('\n') + '"';
    if (dep.type === 'dependency' && !dep.name.startsWith('@bower') && dep.importCount === 0) {
      dep.canRemove = true;
    }

    csvArr.push([
      dep.name,
      dep.version,
      dep.type,
      dep.importCount,
      dep.importedIn,
      dep.canRemove,
    ]);
  }


  const csvStr = csvArr.map(row => row.join(',')).join('\n');
  fs.writeFileSync(path.resolve(__dirname, '../reports/externalLibraryUsageInJs.csv'), csvStr);
}

main();

debugger;
