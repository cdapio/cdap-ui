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

import React from 'react';
import T from 'i18n-react';
import { SELECT_COLUMN_LIST_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { NormalFont } from 'components/common/TypographyText';

export default function({ selectedColumnsCount }: { selectedColumnsCount: number }) {
  const text = selectedColumnsCount
    ? selectedColumnsCount > 10
      ? selectedColumnsCount
      : `${selectedColumnsCount} ${T.translate(`${SELECT_COLUMN_LIST_PREFIX}.columnsSelected`)}`
    : `${T.translate(`${SELECT_COLUMN_LIST_PREFIX}.no`)} ${T.translate(
        `${SELECT_COLUMN_LIST_PREFIX}.columnsSelected`
      )}`;

  return (
    <NormalFont component="p" data-testid="no-column-title">
      {text}
    </NormalFont>
  );
}
