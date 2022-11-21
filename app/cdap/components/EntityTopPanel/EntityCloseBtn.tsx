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
import makeStyle from '@material-ui/core/styles/makeStyles';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';

const useStyle = makeStyle(() => {
  return {
    closeBtn: {
      cursor: 'pointer',
      '& a': {
        color: 'black',
      },
    },
  };
});

export function EntityCloseBtn({
  closeBtnAnchorLink,
}: {
  closeBtnAnchorLink: (() => void) | string;
}) {
  const classes = useStyle();
  if (!closeBtnAnchorLink) {
    return null;
  }

  if (typeof closeBtnAnchorLink === 'function') {
    return (
      <Heading
        type={HeadingTypes.h5}
        className={classes.closeBtn}
        label={
          <IconButton onClick={closeBtnAnchorLink} data-testid="close-icon">
            <CloseIcon />
          </IconButton>
        }
      />
    );
  }

  return (
    <Heading
      type={HeadingTypes.h5}
      label={
        <Link to={closeBtnAnchorLink}>
          <CloseIcon />
        </Link>
      }
    />
  );
}
