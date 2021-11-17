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

import React, { useContext, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import UploadFile from 'services/upload-file';
import FileDnD from 'components/FileDnD';
import Cookies from 'universal-cookie';
import isNil from 'lodash/isNil';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import PropertyRow from 'components/shared/ConfigurationGroup/PropertyRow';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Redirect } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import If from 'components/shared/If';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';

const useStyle = makeStyles((theme) => {
  return {
    container: {
      padding: '10px',
    },
    fileDropContainer: {
      padding: '75px',
    },
    helperText: {
      marginLeft: '25px',
    },
    uploadAction: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});

const PREFIX = 'features.DataPrepConnections.UploadComponent';
const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
const cookie = new Cookies();

export default function Upload() {
  const classes = useStyle();
  const [file, setFile] = useState<File>();
  const [recordDelimiter, setRecordDelimiter] = useState('\\n');
  const [error, setError] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const { onWorkspaceCreate } = useContext(ConnectionsContext);

  function fileHandler(e) {
    const isJSONOrXML = e[0].type === 'application/json' || e[0].type === 'text/xml';

    setFile(e[0]);
    setRecordDelimiter(isJSONOrXML ? '' : '\\n');

    if (e[0].size > FILE_SIZE_LIMIT) {
      setError('File size must be less than 10MB');
    }
  }

  function upload() {
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

    if (window.CDAP_CONFIG.securityEnabled) {
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
            return onWorkspaceCreate(workspace);
          }
          setWorkspaceId(workspace);
        } catch (e) {
          setError(e);
        }
      },
      (err) => {
        setError(err.message);
      }
    );
  }

  if (workspaceId) {
    return <Redirect to={`/ns/${getCurrentNamespace()}/wrangler/${workspaceId}`} />;
  }

  const uploadDisabled = !file || file.size > FILE_SIZE_LIMIT;

  return (
    <div className={classes.container}>
      <div>
        <FileDnD className={classes.fileDropContainer} onDropHandler={fileHandler} file={file} />
      </div>

      <div className={classes.uploadAction}>
        <div>
          <Button variant="contained" color="primary" onClick={upload} disabled={uploadDisabled}>
            {T.translate(`${PREFIX}.uploadButton`)}
          </Button>

          <span className={classes.helperText}>{T.translate(`${PREFIX}.helperText`)}</span>
        </div>

        <div>
          <PropertyRow
            widgetProperty={{
              'widget-type': 'textbox',
              label: T.translate(`${PREFIX}.recordDelimiter`).toString(),
              name: 'recordDelimiter',
            }}
            pluginProperty={{
              name: 'recordDelimiter',
              macroSupported: false,
              required: false,
            }}
            value={recordDelimiter}
            onChange={(v) => setRecordDelimiter(v.recordDelimiter)}
            disabled={false}
            extraConfig={{ properties: {} }}
          />
        </div>
      </div>

      <If condition={!!error}>
        <Alert severity="error">{error}</Alert>
      </If>
    </div>
  );
}
