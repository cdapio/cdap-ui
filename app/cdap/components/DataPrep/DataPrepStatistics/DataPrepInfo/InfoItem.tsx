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
import PropTypes from 'prop-types';

export default function InfoItem({
  className = '',
  itemName,
  valuePrefix = '',
  itemValue,
  valueSuffix = '',
}) {
  return (
    <tr className={className}>
      <td className="info-name">{itemName}</td>
      <td className="info-value">{valuePrefix + itemValue.toString() + valueSuffix}</td>
    </tr>
  );
}

InfoItem.propTypes = {
  className: PropTypes.string,
  itemName: PropTypes.string,
  valuePrefix: PropTypes.string,
  itemValue: PropTypes.any,
  valueSuffix: PropTypes.string,
};
