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

import React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import classnames from 'classnames';
import NavLinkWrapper from 'components/shared/NavLinkWrapper';

const styles = (theme): StyleRules => {
  return {
    gridRow: {
      display: 'grid',
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      alignContent: 'center',
    },
    hover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[700],
      },
    },
    link: {
      color: 'inherit',

      '&:hover': {
        textDecoration: 'none',
        color: 'inherit',
      },
    },
  };
};

interface ITableRowProps extends WithStyles<typeof styles> {
  columnTemplate?: string;
  hover?: boolean;
  alignItems?: string;
  to?: string;
  nativeLink?: boolean;
  className?: string;
}

const TableRowView: React.FC<React.PropsWithChildren<
  ITableRowProps & React.HTMLAttributes<HTMLDivElement>
>> = ({
  classes,
  children,
  columnTemplate,
  alignItems = 'center',
  hover = true,
  to,
  nativeLink = false,
  className,
  ...rest
}) => {
  const style = {
    gridTemplateColumns: columnTemplate,
    alignItems,
  };

  if (to) {
    return (
      <NavLinkWrapper
        to={to}
        isNativeLink={nativeLink}
        className={classnames(classes.gridRow, classes.hover, classes.link, className)}
        style={style}
        {...rest}
      >
        {children}
      </NavLinkWrapper>
    );
  }

  return (
    <div
      className={classnames(classes.gridRow, className, { [classes.hover]: hover })}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};

const TableRow = withStyles(styles)(TableRowView);
export default TableRow;
