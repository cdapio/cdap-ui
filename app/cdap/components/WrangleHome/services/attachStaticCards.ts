/*
 * Copyright © 2022 Cask Data, Inc.
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

import { AddConnectionIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/AddConnectionIcon';
import { ImportDataIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/ImportDataIcon';
import T from 'i18n-react';

/**
 *
 * @param connectorsWithoutStaticCards connector types cards data without Addconnection card, import data card
 * @returns connectory types data with static data (addconnection card, import data cards) which needs to
 * be shown on home page when no connector type(or connections inside any connector type) is available.
 */

export const attachStaticCards = (connectorsWithoutStaticCards) => [
  {
    name: T.translate(`features.WranglerNewUI.HomePage.labels.common.addConnection`),
    SVG: AddConnectionIcon,
    link: 'connections/create',
  },
  {
    name: T.translate(`features.WranglerNewUI.HomePage.labels.common.importData`),
    SVG: ImportDataIcon,
    link: 'home',
  },
  ...connectorsWithoutStaticCards,
];
