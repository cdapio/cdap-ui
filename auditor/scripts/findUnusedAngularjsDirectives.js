const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse').default;
const { getDirectoryTree, traverseDirectoryTree, APPDIR } = require('../lib/treegen');
const { isJs, isTs } = require('../lib/fileUtils');
const { camelCaseToHyphenated } = require('../lib/strUtils');

const directivesPath = path.resolve(__dirname, '../../app/directives');
const NG_REACT_PATH = path.resolve(directivesPath, 'react-components/index.js');
const BABEL_PARSER_OPTS = {
  sourceType: "unambiguous",
  plugins: ['jsx', 'typescript']
};

const fileList = [];
traverseDirectoryTree(APPDIR, {
  visitFile(file) {
    fileList.push(file);
  }
});

const directivesDir = getDirectoryTree(directivesPath);
const directivesList = [];

function getDirectiveUsage(directiveName, sourceFilePath) {
  const usedIn = [];
  for(const file of fileList) {
    if (file.path === sourceFilePath) continue;
    if (isJs(file) || isTs(file) || file.extension === 'html' || file.extension === 'svg') {
      if (file.content.indexOf(directiveName) > -1) usedIn.push(file.path);
    }
  }
  return usedIn;
}

function getSiblingFiles(filepath) {
  const parentDir = getDirectoryTree(path.resolve(filepath, '..'));
  const siblings = [];
  traverseDirectoryTree(parentDir, {
    visitFile(file) {
      siblings.push(file.path);
    }
  });

  return siblings;
}

const report = {};

traverseDirectoryTree(directivesDir, {
  visitFile(file) {
    report[file.path] = {
      filePath: file.path,
      isUnused: false,
      definesDirectives: new Set(),
      directivesUsedIn: new Set(),
      unusedDirectives: new Set(),
    };

    if (isJs(file) || isTs(file)) {
      const ast = babelParser.parse(file.content, BABEL_PARSER_OPTS);

      // find callExpressions of the form `angular.module(...).directive(<directiveName>, <directiveFn>)`
      babelTraverse(ast,  {
        CallExpression(path) {
          if (path.node.callee.type === 'MemberExpression'
            // && path.node.callee.object.type === 'CallExpression'
            // && path.node.callee.object.callee.type === 'MemberExpression'
            // && path.node.callee.object.callee.object.name === 'angular'
            // && path.node.callee.object.callee.property.name === 'module'
            && path.node.callee.property.name === 'directive'
          ) {
            const directiveName = path.node.arguments[0].value;

            const directiveMeta = {
              names: [ directiveName, camelCaseToHyphenated(directiveName)],
              usedIn: getDirectiveUsage(directiveName, file.path).concat(
                getDirectiveUsage(camelCaseToHyphenated(directiveName), file.path)),
              source: file.path,
            };

            directiveMeta.isUnused = directiveMeta.usedIn.length === 0;
            directiveMeta.isNgReactWrapped = file.path === NG_REACT_PATH;
            directivesList.push(directiveMeta);
          }
        }
      });
    }
  }
});

for (const directiveMeta of directivesList) {
  const fileObj = report[directiveMeta.source];

  fileObj.definesDirectives.add(directiveMeta.names[1]);

  directiveMeta.usedIn.forEach(filePath => {
    fileObj.directivesUsedIn.add(filePath);
  });

  if (directiveMeta.isUnused) fileObj.unusedDirectives.add(directiveMeta.names[1]);
}

for (const fileObj of Object.values(report)) {
  if (fileObj.definesDirectives.size > 0 && fileObj.definesDirectives.size === fileObj.unusedDirectives.size) {
    fileObj.isUnused = true;
    for (const sibling of getSiblingFiles(fileObj.filePath)) {
      report[sibling].isUnused = true;
    }
  }
}

function getRelativePath(abspath) {
  return path.relative(path.resolve(__dirname, '../../'), abspath);
}

const reportArr = Object.values(report);
reportArr.sort((a, b) => a.filePath.localeCompare(b.filePath));
const csvReport = [['Filepath', 'Is unsed', 'Directives defined', 'Directives used in', 'Unused directives']];
reportArr.forEach(obj => {
  csvReport.push([
    getRelativePath(obj.filePath),
    obj.isUnused,
    '"' + Array.from(obj.definesDirectives).join('\n') + '"',
    '"' + Array.from(obj.directivesUsedIn).map(getRelativePath).join('\n') + '"',
    '"' + Array.from(obj.unusedDirectives).join('\n') + '"',
  ]);
});

const csvStr = csvReport.map(row => row.join(',')).join('\n');
fs.writeFileSync(path.resolve(__dirname, '../reports/unusedAngularjsDirectives.csv'), csvStr);
