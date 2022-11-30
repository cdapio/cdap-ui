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

import React from 'react';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import { IStatistics } from 'components/GridTable/types';

export interface ITransformationContentParams {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponent: ITransformationComponentType[];
  transformationComponentValues: ITransformationComponentValues;
  transformationName: string;
  transformationDataType: string[];
  columnsList: IHeaderNamesList[];
  missingItemsList: IStatistics;
  onCancel: () => void;
  applyTransformation: (directive: string) => void;
}

export interface ITransformationComponentType {
  type: string;
  component: (props) => JSX.Element;
}

export default function({
  transformationComponent,
  transformationName: type,
  transformationName,
  transformationComponentValues,
  setTransformationComponentsValue,
  columnsList,
  ...props
}: ITransformationContentParams) {
  const Component = transformationComponent.find((item) => item?.type === type)?.component;

  return (
    <Component
      transformationName={transformationName}
      transformationComponentValues={transformationComponentValues}
      setTransformationComponentsValue={setTransformationComponentsValue}
      columnsList={columnsList}
      {...props}
    />
  );
}
