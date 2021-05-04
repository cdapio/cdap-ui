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

import * as React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface ITabProps {
}

const useStyle = makeStyles((theme) => {
  // TODO Get from theme
  return {
    root: {
      fontSize: '20px',
    }
  };
});

const MuiDialogTitle: React.FC<ITabProps> = (props) => {
  const classes = useStyle();
  return <DialogTitle disableTypography={true} classes={classes}>{props.children}</DialogTitle>
};

export default MuiDialogTitle;