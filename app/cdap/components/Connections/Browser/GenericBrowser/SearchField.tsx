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
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import makeStyle from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyle((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.grey[600],
      paddingLeft: '8px',
    },
    input: {
      padding: '8px',
      backgroundColor: theme.palette.white[50],
    },
  };
});

export default function SearchField({ onChange, value }) {
  const classes = useStyle();

  return (
    <FormControl>
      <OutlinedInput
        classes={classes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search this directory"
        value={value}
        data-cy="connection-browser-search"
        data-testid="connection-browser-search"
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
