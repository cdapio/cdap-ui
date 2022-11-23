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

import React, { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';
import { useStyles } from 'components/ImportDataset/styles';
import DrawerWidget from 'components/DrawerWidget';
import DatasetBody from 'components/ImportDataset/Components/ImportDatasetBody';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import UploadFile from 'services/upload-file';
import isNil from 'lodash/isNil';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';
import PositionedSnackbar from 'components/SnackbarComponent';
import T from 'i18n-react';
import { IImportDataset } from 'components/ImportDataset/types';

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
const cookie = new Cookies();

export default function({ handleClosePanel }: IImportDataset) {
  const classes = useStyles();
  const [drawerStatus, setDrawerStatus] = useState<boolean>(true);
  const [file, setFile] = useState<File>(null);
  const [recordDelimiter, setRecordDelimiter] = useState<string>('\\n');
  const [workspaceId, setWorkspaceId] = useState<string>(null);
  const [error, setError] = useState<string>(null);
  const { onWorkspaceCreate } = useContext(ConnectionsContext);

  useEffect(() => {
    setDrawerStatus(true);
  }, []);

  const closeClickHandler = () => {
    setDrawerStatus(false);
    handleClosePanel();
  };

  const onDropHandler = (e) => {
    if (e) {
      const isJSONOrXML = e[0]?.type === 'application/json' || e[0]?.type === 'text/xml';
      if (e[0]?.size > FILE_SIZE_LIMIT) {
        setError(T.translate('features.NewWranglerUI.ImportData.fileSizeError').toString());
      } else {
        setFile(e[0]);
        setRecordDelimiter(isJSONOrXML ? '' : '\\n');
      }
    } else {
      setFile(null);
    }
  };

  const uploadWrangle = () => {
    if (!file) {
      return;
    }

    const delimiter = recordDelimiter;
    const namespace = getCurrentNamespace();
    const fileName = file.name;

    const url = `/namespaces/system/apps/dataprep/services/service/methods/v2/contexts/${namespace}/workspaces/upload`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/data-prep',
      'X-Archive-Name': fileName,
      file: fileName,
    };

    if (window?.CDAP_CONFIG?.securityEnabled) {
      const token = cookie.get('CDAP_Auth_Token');
      if (!isNil(token)) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (delimiter) {
      headers.recorddelimiter = delimiter;
    }

    UploadFile({ url, fileContents: file, headers }).subscribe(
      (res) => {
        try {
          const workspace = JSON.parse(res);
          if (onWorkspaceCreate) {
            return onWorkspaceCreate(res);
          }
          setWorkspaceId(workspace);
        } catch (e) {
          setError(e);
        }
      },
      (err) => {
        setError(err);
      }
    );
  };
  if (workspaceId) {
    return (
      <Redirect
        to={{
          pathname: `/ns/${getCurrentNamespace()}/wrangler-grid/${workspaceId}`,
          state: {
            from: T.translate('features.WranglerNewUI.ConnectionsList.labels.dataSources'),
            path: 'Select Dataset',
          },
        }}
      />
    );
  }
  const componentToRender = (
    <DrawerWidget
      headingText={T.translate('features.WranglerNewUI.ImportData.referenceLabel')}
      openDrawer={drawerStatus}
      showDivider={true}
      closeClickHandler={closeClickHandler}
    >
      <Box className={classes.bodyWrapper}>
        <Box className={classes.panelbody}>
          <DatasetBody file={file} onDropHandler={onDropHandler} />
        </Box>
        {file && (
          <Box className={classes.buttonWrapper}>
            <Button
              variant="contained"
              className={classes.wrangleButton}
              data-testid="upload-button"
              onClick={uploadWrangle}
            >
              {T.translate('features.WranglerNewUI.ConnectionsList.labels.loadToGrid')}
            </Button>
          </Box>
        )}
      </Box>
      {error && <PositionedSnackbar handleCloseError={() => setError(null)} />}
    </DrawerWidget>
  );

  return drawerStatus && componentToRender;
}
