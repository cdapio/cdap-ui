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
import WarningIcon from '@material-ui/icons/Warning';
import styled from 'styled-components';
import T from 'i18n-react';

const DeprecatedTextContent = styled.span`
  font-weight: bold;
  padding: 0 0.25em;
`;

const DepcrecatedMessage = () => {
  return (
    <>
      <WarningIcon fontSize="inherit" />
      <DeprecatedTextContent>[{T.translate('commons.deprecated')}]</DeprecatedTextContent>
    </>
  );
};

export default DepcrecatedMessage;
