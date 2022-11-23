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

import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';

const ROOT_ELEMENT = 'Root';

const useStyle = makeStyle(() => {
  return {
    crumb: {
      color: 'black',
      fontSize: '1.0rem',
    },
    lastCrumb: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: '1.0rem',
    },
  };
});

export default function Breadcrumb({ path, baseLinkPath }) {
  // Filter to handle '/' as first or last character
  const pathElements = path.split('/').filter((pathElement) => pathElement.length > 0);
  const classes = useStyle();

  function createCrumb(title, pathFragment, isLast) {
    return isLast ? (
      <Typography key={pathFragment} className={classes.lastCrumb} component="span">
        {title}
      </Typography>
    ) : (
      <Link to={`${baseLinkPath}${pathFragment}`} key={pathFragment} component={RouterLink}>
        <Typography className={classes.crumb} component="span">
          {title}
        </Typography>
      </Link>
    );
  }

  return (
    <Breadcrumbs maxItems={3} itemsAfterCollapse={2} itemsBeforeCollapse={0}>
      {createCrumb(ROOT_ELEMENT, '/', pathElements.length === 0)}
      {pathElements.map((pathEntry, i) => {
        const fullPath = `/${pathElements.slice(0, i + 1).join('/')}/`;
        return createCrumb(pathEntry, fullPath, i === pathElements.length - 1);
      })}
    </Breadcrumbs>
  );
}
