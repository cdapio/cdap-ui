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

import { IMenuItem } from 'components/GridTable/components/MenuItemComponent/types';
import React from 'react';

export interface IMenuComponentProps {
  anchorElement: HTMLElement;
  menuOptions: IMenuItem[];
  setAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement[]>>;
  submitOption: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, item: IMenuItem) => void;
  columnType: string;
  setMenuComponentOptions: React.Dispatch<React.SetStateAction<IMenuItem[][]>>;
}
