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
import makeStyle from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyle = makeStyle<Theme>((theme) => {
  return {
    root: {
      alignSelf: 'center',
    },
    linkContainer: {
      color: (theme.palette as any).blue[100],
      cursor: 'pointer',
      '& :hover': {
        textDecoration: 'underline',
      },
    },
    arrowLeft: {
      marginRight: '5px',
    },
    divider: {
      margin: '0 10px',
    },
  };
});
interface IEntityBreadCrumbProps {
  breadCrumbAnchorLink?: string;
  historyBack?: boolean;
  onBreadCrumbClick?: () => void;
  breadCrumbAnchorLabel: string;
}
export function EntityBreadCrumb({
  breadCrumbAnchorLink,
  historyBack,
  onBreadCrumbClick,
  breadCrumbAnchorLabel,
}: IEntityBreadCrumbProps) {
  const classes = useStyle();
  let Tag = Link;
  if (historyBack || typeof onBreadCrumbClick === 'function') {
    Tag = 'span';
  }
  const onClickHandler = () => {
    if (typeof onBreadCrumbClick === 'function') {
      onBreadCrumbClick();
    }
    if (!historyBack) {
      return;
    }
    history.back();
  };
  if (!breadCrumbAnchorLabel) {
    return null;
  }
  return (
    <div className={classes.root}>
      <Tag to={breadCrumbAnchorLink} onClick={onClickHandler} className={classes.linkContainer}>
        <span className={classes.arrowLeft}>&laquo;</span>
        <span>{breadCrumbAnchorLabel}</span>
      </Tag>
      <span className={classes.divider}> | </span>
    </div>
  );
}
