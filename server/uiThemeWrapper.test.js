/*
 * Copyright © 2026 Cask Data, Inc.
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

import fs from 'fs';
import os from 'os';
import path from 'path';
import { extractUITheme } from 'server/uiThemeWrapper';

describe('extractUITheme', () => {
  const cdapConfig = { 'ui.theme.file': true };

  test('loads a plain JSON theme file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-theme-test-'));
    const themePath = path.join(dir, 'theme.json');
    fs.writeFileSync(themePath, JSON.stringify({ content: { theme: 'ok' } }));

    const result = extractUITheme(cdapConfig, themePath);
    expect(result.content.theme).toBe('ok');
  });

  // Regression test: extractUITheme used to load the theme file with
  // __non_webpack_require__, which executes .js files as Node modules
  // instead of just reading them as data. A path ending in .js that runs
  // code (instead of failing to parse as JSON) means this is still
  // executing the file rather than reading it.
  test('does not execute a .js file passed as the theme path', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-theme-test-'));
    const canaryPath = path.join(dir, 'canary.txt');
    const themePath = path.join(dir, 'theme.js');
    fs.writeFileSync(
      themePath,
      `require('fs').writeFileSync(${JSON.stringify(canaryPath)}, 'executed');\nmodule.exports = { content: { theme: 'pwned' } };\n`
    );

    expect(() => extractUITheme(cdapConfig, themePath)).toThrow();
    expect(fs.existsSync(canaryPath)).toBe(false);
  });
});
