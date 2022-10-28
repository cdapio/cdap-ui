/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import React from 'react';
import { IRecords } from 'components/GridTable/types';

export interface ITableSampleCanSampleProps {
  label: string;
  entity: IRecords;
  initialConnectionId: string;
  toggleLoader: (value: boolean, isError?: boolean) => void;
  setToaster: React.Dispatch<React.SetStateAction<IMessageState>>;
}

export interface IMessageState {
  open: boolean;
  message: string;
  isSuccess: boolean;
}

export interface ISnackbarToast {
  open: boolean;
  message?: string;
  isSuccess?: boolean;
}
