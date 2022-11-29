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
interface ISelectionRange {
  [key: string]: string;
}
export interface IUsingPosition {
  anchorEl: JSX.Element;
  setAnchorEl: React.Dispatch<React.SetStateAction<JSX.Element>>;
  textSelectionRange: ISelectionRange;
  columnSelected: string;
  applyTransformation: (value: string) => void;
  optionSelected: string;
  headers: string[];
  open: boolean;
  handleClose: () => void;
}
