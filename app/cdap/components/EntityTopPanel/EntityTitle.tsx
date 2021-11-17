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
import IconSVG from 'components/shared/IconSVG';
import Heading, { HeadingTypes } from 'components/shared/Heading';

const useStyle = makeStyle<Theme, { multiline: boolean }>((theme) => {
  return {
    overviewHeading: {
      marginBottom: 0,
      marginTop: 0,
      fontWeight: ({ multiline }) => (multiline ? 'bold' : 'normal'),
    },
    multilineEntityType: {
      color: theme.palette.grey[200],
    },
    iconSVG: {
      marginRight: '5px',
    },
    entityTypeText: {
      verticalAlign: 'middle',
    },
  };
});

export function EntityTitle({ title, entityIcon, entityType }) {
  const multiline = typeof entityIcon === 'string' && typeof entityType === 'string';
  const classes = useStyle({ multiline });
  if (multiline) {
    return (
      <div>
        <Heading type={HeadingTypes.h5} label={title} className={classes.overviewHeading} />
        <div className={classes.multilineEntityType}>
          <IconSVG name={entityIcon} />
          <span className={classes.entityTypeText}>{entityType}</span>
        </div>
      </div>
    );
  }
  return <Heading type={HeadingTypes.h5} label={title} className={classes.overviewHeading} />;
}
