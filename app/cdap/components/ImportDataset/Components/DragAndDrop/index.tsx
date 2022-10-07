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

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classnames from 'classnames';
import { useStyles } from '../../styles';
import { Box, Divider, Typography } from '@material-ui/core';
import { uploadSVG, infoIcon, deleteSVG } from 'components/ImportDataset/iconStore';
import { DRAG_AND_DROP_TEXT, MAX_SIZE_TEXT } from 'components/ImportDataset/constants';

export default function FileDnD({ file, onDropHandler }) {
  const classes = useStyles();
  const onDrop = useCallback((acceptedFiles) => {
    onDropHandler(acceptedFiles);
  }, []);
  const handleRemoveFile = () => {
    onDropHandler(null);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv, .json, .CSV, .JSON',
  });

  return (
    <Box>
      {!file ? (
        <>
          <div
            {...getRootProps({ 'data-cy': 'file-drop-zone' })}
            className={classnames('file-drop-container', classes.dropContainer, {
              'file-drag-container': isDragActive,
            })}
          >
            <input {...getInputProps()} />
            <div className={classes.uploadBox}>
              {uploadSVG()}
              <Typography variant="body1" className={classes.dropText}>
                {DRAG_AND_DROP_TEXT}
              </Typography>
            </div>
          </div>
          <Typography variant="body1" className={classes.dropText}>
            {infoIcon()} {MAX_SIZE_TEXT}
          </Typography>
        </>
      ) : (
        <Box>
          <Box className={classes.FlexFile}>
            <Typography className={classes.fileNameText}>{file.name}</Typography>
            <Box onClick={handleRemoveFile}>{deleteSVG()}</Box>
          </Box>
          <Divider />
        </Box>
      )}
    </Box>
  );
}
