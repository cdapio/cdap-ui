/*
 * Copyright © 2019 Cask Data, Inc.
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
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = () => {
  return {
    multiRowContainer: {
      padding: '10px 5px',
    },
  };
};

interface IMultiRowContainerProps extends WithStyles<typeof styles> {
  children: any[] | any;
  dataCy?: string;
  dataTestId?: string;
}

function MultiRowContainer(props: IMultiRowContainerProps) {
  return (
    <div
      className={props.classes.multiRowContainer}
      data-cy={props.dataCy}
      data-testid={props.dataTestId}
    >
      {props.children}
    </div>
  );
}

const StyledContainer = withStyles(styles)(MultiRowContainer);
export default StyledContainer;
