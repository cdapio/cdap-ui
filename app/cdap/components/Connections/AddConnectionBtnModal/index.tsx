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

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CreateConnectionModal from 'components/Connections/CreateConnectionModal';
import { makeStyles } from '@material-ui/core/styles';
// todo update this package and fix type CDAP-20180
// @ts-ignore
import clsx from 'clsx';

const useStyle = makeStyles(() => {
  return {
    root: {
      backgroundColor: 'white',
    },
  };
});

export default function AddConnectionBtnModal({ onCreate, className = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyle();

  function toggleConnectionCreate() {
    setIsOpen(!isOpen);
  }

  function onCreateHandler() {
    if (typeof onCreate === 'function') {
      onCreate();
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        className={clsx(className, classes.root)}
        onClick={toggleConnectionCreate}
      >
        Add Connection
      </Button>

      <CreateConnectionModal
        isOpen={isOpen}
        onToggle={toggleConnectionCreate}
        onCreate={onCreateHandler}
      />
    </>
  );
}
