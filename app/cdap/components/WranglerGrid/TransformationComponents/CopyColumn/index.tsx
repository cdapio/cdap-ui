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

import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import NewColumnInput from 'components/common/TransformationInputComponents/NewColumnInput';
import styled from 'styled-components';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';

interface ICalculateProps {
  transformationName: string;
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const CopyColumnWrapper = styled(Box)`
  margin: 10px 0 0;
`;

export default function({
  transformationName,
  setTransformationComponentsValue,
  transformationComponentValues,
}: ICalculateProps) {
  const [column, setColumnName] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    if (
      transformationComponentValues?.columnNames?.filter((name: string) => name === column).length
    ) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setTransformationComponentsValue({ ...transformationComponentValues, copyColumnName: column });
  }, [column]);

  return (
    <CopyColumnWrapper data-testid="copy-column-parent-wrapper">
      <NewColumnInput column={column} setColumnName={setColumnName} isError={isError} />
    </CopyColumnWrapper>
  );
}
