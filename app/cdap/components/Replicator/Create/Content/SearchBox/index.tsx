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

import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const styles = (): StyleRules => {
  return {
    searchBox: {
      width: '200px',

      '& input': {
        paddingTop: '7px',
        paddingBottom: '7px',
      },
    },
  };
};

interface ISearchBoxProps extends WithStyles<typeof styles> {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  withAdornment?: boolean;
}

const SearchBoxView: React.FC<ISearchBoxProps> = ({
  classes,
  value,
  onChange,
  placeholder,
  withAdornment,
}) => {
  function handleChange(e) {
    onChange(e.target.value);
  }

  return (
    <TextField
      className={classes.searchBox}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      variant="outlined"
      InputProps={
        withAdornment
          ? {
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ marginLeft: '-14px', borderRadius: '3px 0 0 3px' }}
                >
                  <SearchIcon
                    style={{
                      background: '#EEEEEE',
                      height: '28px',
                      width: '24px',
                      color: '#979797',
                      borderRadius: '4px 0 0 4px',
                    }}
                  />
                </InputAdornment>
              ),
            }
          : null
      }
    />
  );
};

const SearchBox = withStyles(styles)(SearchBoxView);
export default SearchBox;
