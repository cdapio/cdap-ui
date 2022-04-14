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

import React, { useState, useRef } from 'react';
import CreateConnectionModal from 'components/Connections/CreateConnectionModal';
import Button from '@material-ui/core/Button';
import { objectQuery } from 'services/helpers';
import Alert from 'components/shared/Alert';
import If from 'components/shared/If';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles(() => {
  return {
    hidden: {
      display: 'none !important', // beating specificity. The file input needs to be hidden at all times
    },
  };
});

export default function ImportConnectionBtn({ onCreate, className = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [initConnConfig, setInitConnConfig] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>();

  const classes = useStyle();

  // This makes sure the onChange hook will fire for same file
  function handleFileClear() {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  function handleFile(event) {
    if (!objectQuery(event, 'target', 'files', 0)) {
      return;
    }
    const uploadedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(uploadedFile, 'UTF-8');

    reader.onload = (evt) => {
      try {
        const config = JSON.parse(evt.target.result.toString());
        setInitConnConfig(config);
        toggleConnectionCreate();
      } catch (e) {
        setParseError(`Error parsing imported file: ${e.message}`);
        if (fileInputRef && fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      }
    };
  }

  function handleCreate() {
    if (typeof onCreate === 'function') {
      onCreate();
    }
  }

  function toggleConnectionCreate() {
    const newState = !isOpen;
    setIsOpen(newState);

    if (!newState) {
      setInitConnConfig(null);
    }
  }

  return (
    <>
      <Button color="primary" component="label" className={className}>
        Import
        <input
          type="file"
          accept=".json"
          onClick={handleFileClear}
          onChange={handleFile}
          ref={fileInputRef}
          className={classes.hidden}
        />
      </Button>

      <CreateConnectionModal
        isOpen={isOpen}
        onToggle={toggleConnectionCreate}
        initialConfig={initConnConfig}
        onCreate={handleCreate}
      />

      {!!parseError && (
        <Alert
          message={parseError}
          type="error"
          showAlert={true}
          onClose={() => setParseError(null)}
        />
      )}
    </>
  );
}
