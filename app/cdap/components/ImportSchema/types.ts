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

import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface IParsingHeaderActionTemplateProps {
  setSuccessUpload: Dispatch<SetStateAction<ITransformationMessage>>;
  handleSchemaUpload: (ISchemaProps) => void;
  setErrorOnTransformation: Dispatch<SetStateAction<ITransformationMessage>>;
}
export interface ITransformationMessage {
  open: boolean;
  message: string;
}

export interface ISchemaProps {
  type: string;
  name: string;
  fields: Ifields;
}
interface Ifields {
  name: string;
  type: string[];
}

export interface ISchemaValue {
  fields: ISchemaFields[];
  name: string;
  type: string;
}

export interface ISchemaFields {
  name: string;
  type: string[];
}

export interface IDefaultErrorOnTransformations {
  open?: boolean;
  message?: string;
}
