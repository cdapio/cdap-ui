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
const generate = require('@babel/generator').default;
const prettier = require('prettier');
const t = require('@babel/types');

const { getDirectoryTree, traverseDirectoryTree } = require('../lib/treegen');
const { isJs, isTs } = require('../lib/fileUtils');
const { getCodeFragment } = require('../lib/strUtils');

const rootPath = path.resolve(__dirname, '../../');
const componentsPath = path.resolve(rootPath, 'app/cdap/components');

const BABEL_PARSER_OPTS = {
  sourceType: "unambiguous",
  plugins: ['jsx', 'typescript']
};

const visitor = {
  visitFile(file) {
    if (isJs(file) || isTs(file)) {
      if (file.path.indexOf('__test') > -1) return;
      if (file.path.indexOf('.stories') > -1) return;

      let fileModified = false;

      const ast = babelParser.parse(file.content, BABEL_PARSER_OPTS);
      babelTraverse(ast,  {
        JSXElement(_path) {
          const opening = _path.node.openingElement;
          let datacy = null;
          let datatestid = null;
          for(const attr of opening.attributes) {
            if (attr.type === 'JSXAttribute' && attr.name.name === 'data-cy') {
              datacy = attr.value;
            }
            if (attr.type === 'JSXAttribute' && attr.name.name === 'data-testid') {
              datatestid = attr.value;
            }
          }

          if (datacy && !datatestid) {
            const testidAttr = t.jsxAttribute(t.jsxIdentifier('data-testid'), datacy);
            opening.attributes.push(testidAttr);
            fileModified = true;
          }
        }
      });

      if (fileModified) {
        const out = generate(ast, { retainLines: true }, file.content);
        fs.writeFileSync(file.path, out.code);
      }
    }
  }
}

function main() {
  traverseDirectoryTree(getDirectoryTree(componentsPath), visitor);
}

main();
