/*
 * Copyright © 2017 Cask Data, Inc.
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
require('./EmptyMessageContainer.scss');

const PREFIX = 'features.EmptyMessageContainer';

export default function EmptyMessageContainer({
  title = null,
  searchText = '',
  children,
}: {
  title?: React.ReactNode | null | undefined;
  searchText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-search-container">
      <div className="empty-search">
        <strong>{title ? title : T.translate(`${PREFIX}.title`, { searchText })}</strong>
        <hr />
        <span> {T.translate(`${PREFIX}.suggestionTitle`)} </span>
        {children}
      </div>
    </div>
  );
}
