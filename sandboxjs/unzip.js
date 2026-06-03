/*
 * Copyright © 2021 Cask Data, Inc.
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

const fs = require('fs-extra');
const path = require('path');
const yauzl = require("yauzl");

/**
 * Resolves an archive entry path within the extraction root.
 * Throws an error if the resolved path would escape the root directory.
 *
 * @param {string} root - The absolute extraction root directory.
 * @param {string} entryFileName - The archive member fileName.
 * @returns {string} The safe, resolved absolute target path.
 */
function safeEntryPath(root, entryFileName) {
  var normalizedRoot = path.resolve(root) + path.sep;
  var target = path.resolve(normalizedRoot, entryFileName);
  if (!target.startsWith(normalizedRoot)) {
    throw new Error('Zip entry escapes extraction root: ' + entryFileName);
  }
  return target;
}

async function unzipSDK(sdkzippath, targetDir) {
  return new Promise((resolve, reject) => {
    try {
      yauzl.open(sdkzippath, {lazyEntries: true, autoClose: true}, function(err, zipfile) {
        if (err) {
          reject(err);
          return;
        }
        zipfile.readEntry();
        zipfile.on("entry", async function(entry) {
          if (/\/$/.test(entry.fileName)) {
            // directory file names end with '/'
            try {
              var dirTarget = safeEntryPath(targetDir, entry.fileName);
              await fs.mkdirp(dirTarget);
              zipfile.readEntry();
            } catch(err) {
              reject(err);
              return;
            }
          } else {
            // file entry
            zipfile.openReadStream(entry, async function(err, readStream) {
              if (err) {reject(err); return; }
              // ensure parent directory exists
              try {
                var fileTarget = safeEntryPath(targetDir, entry.fileName);
                await fs.mkdirp(path.dirname(fileTarget));
                readStream.pipe(fs.createWriteStream(fileTarget, {flags: 'w+', mode: 0o755}));
                readStream.on("end", function() {
                  zipfile.readEntry();
                });
              } catch(err) {
                reject(err);
                return;
              }
            });
          }
        });
        zipfile.once('close', function() {
          resolve();
        });
      });
    } catch(e) {
      reject(e);
    }
  });
}
module.exports = unzipSDK;
