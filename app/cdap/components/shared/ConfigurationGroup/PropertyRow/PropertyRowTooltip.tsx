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

import withStyles, { StyleRules } from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';

const PropertyRowTooltip = withStyles(
  (theme): StyleRules => {
    return {
      tooltip: {
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.grey[700],
        fontSize: '12px',
        wordBreak: 'break-word',
      },
    };
  }
)(Tooltip);

export default PropertyRowTooltip;
