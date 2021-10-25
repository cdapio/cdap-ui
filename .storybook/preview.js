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

import T from 'i18n-react';
import React from "react"
import  ThemeWrapper  from "../app/cdap/components/ThemeWrapper"


require('font-awesome-sass-loader!../app/cdap/styles/font-awesome.config.js');
require('../app/cdap/styles/lib-styles.scss');
require('../app/cdap/styles/common.scss');
require('../app/cdap/styles/main.scss');
require('./stories.global.scss');
require('../app/cdap/styles/bootstrap_4_patch.scss');

T.setTexts(require('../app/cdap/text/text-en.yaml'));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <ThemeWrapper><Story /></ThemeWrapper>
  )
];
