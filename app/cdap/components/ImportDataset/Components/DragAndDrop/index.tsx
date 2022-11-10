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
import { useStyles } from 'components/ImportDataset/styles';
import { Box, Divider, Typography } from '@material-ui/core';
import { UploadSVG } from 'components/ImportDataset/IconStore/UploadSVG';
import { InfoIcon } from 'components/ImportDataset/IconStore/InfoIcon';
import { DeleteSVG } from 'components/ImportDataset/IconStore/DeleteSVG';
import T from 'i18n-react';
import { IDragAndDrop } from 'components/ImportDataset/types';

export default function({ file, onDropHandler }: IDragAndDrop) {
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
            <input {...getInputProps()} data-testid="file-drop-zone" />
            <div className={classes.uploadBox}>
              <UploadSVG />
              <Typography variant="body1" className={classes.dropText} component="div">
                {T.translate('features.WranglerNewUI.ImportData.dragAndDropTextLine1')}
                <br />
                {T.translate('features.WranglerNewUI.ImportData.dragAndDropTextLine2')}
              </Typography>
            </div>
          </div>
          <div className={classes.infoIconText}>
            <div className={classes.infoIcon}>
              <InfoIcon />
            </div>
            <Typography variant="body1" className={classes.infoText} component="span">
              {T.translate('features.WranglerNewUI.ImportData.maxSizeText')}
            </Typography>
          </div>
        </>
      ) : (
        <Box>
          <Box className={classes.FlexFile}>
            <Typography className={classes.fileNameText} data-testid="file-name" component="span">
              {file.name}
            </Typography>
            <Box
              className={classes.delete_cursor_pointer}
              data-testid="delete-svg"
              onClick={handleRemoveFile}
            >
              <DeleteSVG />
            </Box>
          </Box>
          <Divider />
        </Box>
      )}
    </Box>
  );
}
