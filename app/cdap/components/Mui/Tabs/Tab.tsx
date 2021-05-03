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

import React from 'react';
import Tab from '@material-ui/core/Tab';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface ITabProps {
  disabled?: boolean;
  label: string;
  value: any;
}
const useStyle = makeStyles((theme) => {
  // TODO Get from theme
  return {
    root: {
      color: 'rgba(0, 0, 0, .54)',
      fontSize: theme.typography.fontSize,
      opacity: 1.0,
      '&$selected': {
        color: theme.palette.primary.main,
      }
    },
    selected: {},
  };
});

const MuiTab: React.FC<ITabProps> = (props) => {
  const classes = useStyle();
  const { label, ...others } = props;
  
  // Material-ui can pass additional props to children
  // In this case, selection status is passed down from Tabs
  return <Tab classes={classes} label={label} {...others} />
};

export default MuiTab;
