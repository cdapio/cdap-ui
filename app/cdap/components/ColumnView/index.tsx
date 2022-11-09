/*
 * Copyright © 2022 Cask Data, Inc.
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

import { Box } from '@material-ui/core';
import ColumnViewWidget from 'components/ColumnViewWidget';
import React, { Fragment, useState } from 'react';
import { HEADING_TEXT } from 'components/ColumnView/constants';
import SelectColumnsList from 'components/ColumnView/SelectColumnsList';
import { useStyles } from 'components/ColumnView/styles';
import { IColumnViewProps } from 'components/ColumnView/types';

export default function({
  columnData,
  dataQuality,
  closeClickHandler,
  setLoading,
}: IColumnViewProps) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Fragment>
      <ColumnViewWidget
        headingText={HEADING_TEXT}
        closeClickHandler={closeClickHandler}
        searchedTermHandler={(searchedTerm) => setSearchValue(searchedTerm)}
      >
        <Box className={classes.selectColumnListBodyStyles} data-testid="select-column-list-parent">
          <SelectColumnsList
            columnData={columnData}
            dataQuality={dataQuality}
            searchTerm={searchValue}
          />
        </Box>
      </ColumnViewWidget>
    </Fragment>
  );
}
