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
import Tooltip from '@material-ui/core/Tooltip';
import capitalize from 'lodash/capitalize';
import If from 'components/shared/If';
import T from 'i18n-react';

const useStyle = makeStyle((theme) => {
  return {
    tooltip: {
      backgroundColor: theme.palette.grey[50],
    },
    iconContainer: {
      marginRight: '.5rem',
    },
  };
});

const PREFIX = 'features.DataPrep.DataPrepBrowser.GenericBrowser.EntityCount';
const I18N_KEYS = {
  bucket: true,
  database: true,
  dataset: true,
  directory: true,
  file: true,
  instance: true,
  schema: true,
  table: true,
  topic: true,
};

function getEntityTypeString(entityType, count) {
  if (I18N_KEYS[entityType]) {
    return T.translate(`${PREFIX}.${entityType}`, {
      context: count,
    });
  }
  return T.translate(`${PREFIX}.generic`, {
    type: capitalize(entityType),
    count,
  });
}

export default function EntityCount({
  entityCounts,
  isFiltered,
  isTruncated,
  totalUnfilteredCount,
  truncationLimit,
}) {
  const classes = useStyle();

  const entityKeys = Object.keys(entityCounts);
  const entityCountString = entityKeys.length
    ? entityKeys
        .sort()
        .map((k) => getEntityTypeString(k, entityCounts[k]))
        .join(', ')
    : T.translate(`${PREFIX}.empty`);

  const fullString = isFiltered
    ? T.translate(`${PREFIX}.filtered`, {
        countString: entityCountString,
        total: totalUnfilteredCount,
      })
    : entityCountString;

  return (
    <span>
      <If condition={isTruncated}>
        <span className={classes.iconContainer}>
          <Tooltip title={`Results limited to ${truncationLimit} entities`} classes={classes}>
            <span className="fa fa-lg fa-exclamation-circle" />
          </Tooltip>
        </span>
      </If>
      {fullString}
    </span>
  );
}
