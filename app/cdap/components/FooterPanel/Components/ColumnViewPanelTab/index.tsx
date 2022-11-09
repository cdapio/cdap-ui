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

import { Box } from '@material-ui/core';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import TabWrapper from 'components/FooterPanel/Components/common/TabWrapper';
import { PREFIX } from 'components/FooterPanel/constants';
import { ColumnIcon } from 'components/FooterPanel/IconStore/ColumnIcon';
import T from 'i18n-react';
import React from 'react';

export default function() {
  return (
    <Box data-testid="footer-panel-column-view-panel-tab-wrapper">
      <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
        <Box>
          <TabWrapper size="small" dataTestID="footer-panel-column-view-panel-tab">
            {ColumnIcon}
          </TabWrapper>
        </Box>
      </CustomTooltip>
    </Box>
  );
}
