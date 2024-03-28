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
const yml = require('js-yaml');
const crypto = require('crypto');

const topComment = `---
# Keys in this file can contain only alphanumeric characters and underscore.
#
# Keys in this file are kept alphabetically sorted.
# Sorting of the keys (if necessary) is done in the custom webpack loader.
# Code of the custom loader is located at ui-devtools/testid-yaml-loader.
#
# Please do not modify this comment section at the top.
# This section is added by the testid-yaml-loader.

`;

let cachedHash = '';

module.exports = function(source) {
  const filename = path.basename(this.resourcePath);
  if (filename !== 'testids.yaml') {
    return source;
  }

  this.cacheable();
  const sourceHash = crypto
    .createHash('sha256')
    .update(source, 'utf8')
    .digest('hex');

  if (sourceHash === cachedHash) {
    return source;
  }

  try {
    const data = yml.load(source, {
      filename,
      onWarning: (warning) => {
        this.emitWarning(warning.toString());
      },
    });
    const sortedYaml = yml.dump(data, {
      styles: {
        '!!null': 'canonical',
      },
      sortKeys: true,
    });

    const sortedSource = `${topComment}${sortedYaml}`;
    fs.writeFileSync(this.resourcePath, sortedSource);

    cachedHash = crypto
      .createHash('sha256')
      .update(sortedSource, 'utf8')
      .digest('hex');

    return sortedSource;
  } catch (err) {
    this.emitError([
      `Failed to validate and sort yaml from file: ${this.resourcePath} ! Message: ${err.message}`,
      `Stack: \n`,
      err.stack,
    ]);

    return source;
  }
};
