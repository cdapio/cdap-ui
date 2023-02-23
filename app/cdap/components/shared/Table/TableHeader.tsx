/*
 * Copyright © 2020 Cask Data, Inc.
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

import React, { cloneElement } from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (theme): StyleRules => {
  return {
    gridHeader: {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.grey[700],
      color: theme.palette.grey[100],
      fontWeight: 600,
      lineHeight: 1.2,
      zIndex: 1,
    },
  };
};

interface ITableHeaderProps extends WithStyles<typeof styles> {
  columnTemplate?: string;
}

const TableHeaderView: React.FC<React.PropsWithChildren<ITableHeaderProps>> = ({
  classes,
  children,
  columnTemplate,
}) => {
  const childrenClone = React.Children.map(
    children as React.ReactElement<any>[],
    (child: React.ReactElement<any>) => {
      return cloneElement(child, {
        columnTemplate,
        hover: false,
        alignItems: 'end',
      });
    }
  );
  return <div className={classes.gridHeader}>{childrenClone}</div>;
};

const TableHeader = withStyles(styles)(TableHeaderView);
export default TableHeader;
