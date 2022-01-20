/*
 * Copyright © 2018-2021 Cask Data, Inc.
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
import classnames from 'classnames';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';
import { EntityBreadCrumb } from 'components/EntityTopPanel/EntityBreadCrumb';
import { EntityTitle } from 'components/EntityTopPanel/EntityTitle';
import { EntityCloseBtn } from 'components/EntityTopPanel/EntityCloseBtn';

interface IEntityTopPanelProps {
  breadCrumbAnchorLink?: string;
  breadCrumbAnchorLabel?: string;
  onBreadCrumbClick?: () => void;
  title: string;
  entityIcon?: string;
  entityType?: string;
  closeBtnAnchorLink?: string | (() => void);
  historyBack?: boolean;
  inheritBackground?: boolean;
  className?: string;
  showBreadcrumb?: boolean;
}

const useStyle = makeStyle<Theme>((theme) => {
  return {
    root: {
      height: '50px',
      background: theme.palette.grey[600],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 50px',
    },
    titleContainer: {
      display: 'flex',
    },
    background: {
      background: 'inherit',
    },
  };
});

export function EntityTopPanel({
  breadCrumbAnchorLink,
  breadCrumbAnchorLabel,
  onBreadCrumbClick,
  title,
  entityIcon,
  entityType,
  closeBtnAnchorLink,
  historyBack,
  inheritBackground,
  className,
  showBreadcrumb = true,
}: IEntityTopPanelProps) {
  const multilineTitle = typeof entityIcon === 'string' && typeof entityType === 'string';
  const classes = useStyle({ multiline: multilineTitle });

  return (
    <div
      className={classnames(classes.root, {
        [classes.background]: inheritBackground,
        [className]: className,
      })}
    >
      <div className={classes.titleContainer}>
        {showBreadcrumb && (
          <EntityBreadCrumb
            breadCrumbAnchorLabel={breadCrumbAnchorLabel}
            breadCrumbAnchorLink={breadCrumbAnchorLink}
            historyBack={historyBack}
            onBreadCrumbClick={onBreadCrumbClick}
          />
        )}
        <EntityTitle title={title} entityIcon={entityIcon} entityType={entityType} />
      </div>
      <EntityCloseBtn closeBtnAnchorLink={closeBtnAnchorLink} />
    </div>
  );
}
