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

import React, { useRef } from 'react';
import styled from 'styled-components';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { objectQuery } from 'services/helpers';

const HiddenInput = styled.input`
  &&& {
    display: none;
  }
`; // beating specificity. The file input needs to be hidden at all times

export default function ImportFileButton({ onFileSelect, ...props }) {
  const fileInputRef = useRef<HTMLInputElement>();

  // This makes sure the onChange hook will fire for same file
  const handleFileClear = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFile = (event) => {
    if (!objectQuery(event, 'target', 'files', 0)) {
      return;
    }
    const uploadedFile = event.target.files[0];

    if (onFileSelect) {
      onFileSelect(uploadedFile);
    }
  };

  return (
    <PrimaryTextButton component="label" {...props}>
      Import Schema
      <HiddenInput
        type="file"
        accept=".json"
        onClick={handleFileClear}
        onChange={handleFile}
        ref={fileInputRef}
      />
    </PrimaryTextButton>
  );
}
