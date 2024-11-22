/*
 * Copyright © 2024 Cask Data, Inc.
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

import React from 'react';
import { Dialog } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { UiActions } from '../store/uistate/actions';

export default function StudioModalsManager() {
  const { modalShown, modalToRender, modalOnClose } = useSelector((state) => state.uiState);
  const dispatch = useDispatch();

  function handleClose() {
    if (modalOnClose) {
      modalOnClose();
    }
    dispatch({ type: UiActions.CLOSE_MODAL });
  }

  return (
    <Dialog open={modalShown} onClose={handleClose}>
      {modalToRender}
    </Dialog>
  );
}
