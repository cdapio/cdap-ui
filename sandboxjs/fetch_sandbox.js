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

const branchInfo = require('./sandbox_version.json');
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const unzip = require('./unzip');

async function downloadSDK(res, pathToZipFile) {
  const fileStream = fs.createWriteStream(pathToZipFile);
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", () => {
      console.log('Done downloading!');
      resolve();
    });
  });
}

async function fetchSandbox(targetDir) {
  // Get the last successful build from cdap-build
  const cdapVersion = branchInfo.version;
  console.log('CDAP version: ', cdapVersion);

  const SDKZipPath = `https://github.com/cdapio/cdap-build/releases/download/${branchInfo.release}/cdap-sandbox-${cdapVersion}.zip`;
  console.log('SDK zip path: ', SDKZipPath);
  let res;
  try {
    res = await fetch(SDKZipPath);
  } catch(e) {
    throw `Invalid url to SDK zip file: ${SDKZipPath} - ${e}` 
  }
  console.log('fetch begun');

  // Download and unzip SDK
  const downloadPath = await fs.mkdtemp('cdf_sandbox_download_');
  const pathToZipFile = path.join(downloadPath, `cdap-sandbox-${cdapVersion}.zip`);
  console.log(`Downloading sandbox to: ${pathToZipFile}`);
  let unzippedPath;
  try {
    await downloadSDK(res, pathToZipFile);
    console.log('Download complete; unzipping');
    unzippedPath = await fs.mkdtemp('cdf_sandbox_unzipped_');
    await unzip(pathToZipFile, unzippedPath);
    // Move the unzipped files so subsequent scripts don't need to know the version
    await fs.move(path.join(unzippedPath, `cdap-sandbox-${cdapVersion}`), targetDir);
    console.log(`SDK is unzipped and ready to start! Location: ${targetDir}`);
  } catch(e) {
    console.error('Unable to download or unzip the SDK');
    throw e.message;
  }

  try {
    console.log(`Cleaning up: ${downloadPath}`);
    await fs.rmdir(downloadPath, { recursive: true });
    console.log(`Cleaning up: ${unzippedPath}`);
    await fs.rmdir(unzippedPath, { recursive: true });
  } catch(e) {
    console.error('Cleanup failed; temp directories left behind');
    if (e.message) {
      console.error(e.message);
    }
    // Don't rethrow - don't fail the build
  }
}

module.exports = fetchSandbox;
