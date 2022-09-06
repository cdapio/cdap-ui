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

import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';
import { useStyles } from './styles';
import DrawerWidget from 'components/DrawerWidget';
import { IMPORT_DATASET, WRANGLE } from './constants';
import DatasetBody from './Components/ImportDatasetBody';

const ImportDataSet = (props) => {
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [file, setFile] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    setDrawerStatus(true);
  }, []);

  const closeClickHandler = () => {
    setDrawerStatus(false);
    props.handleClosePanel();
  };

  const onDropHandler = (acceptedFile) => {
    setFile(acceptedFile);
  };

  const componentToRender = (
    <DrawerWidget
      headingText={IMPORT_DATASET}
      openDrawer={setDrawerStatus}
      showDivider={true}
      closeClickHandler={closeClickHandler}
    >
      <Box className={classes.bodyWrapper}>
        <Box className={classes.panelbody}>
          <DatasetBody file={file} onDropHandler={onDropHandler} />
        </Box>
        {file && (
          <Box className={classes.buttonWrapper}>
            <Button variant="contained" className={classes.wrangleButton}>
              {WRANGLE}
            </Button>
          </Box>
        )}
      </Box>
    </DrawerWidget>
  );

  return drawerStatus && componentToRender;
};

export default ImportDataSet;
