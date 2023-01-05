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

import T from 'i18n-react';
import React, { useState, useEffect } from 'react';
import ColumnsList from 'components/WranglerGrid/SelectColumnPanel/ColumnsList';
import {
  IAddTransformationProps,
  IHeaderNamesList,
} from 'components/WranglerGrid/SelectColumnPanel/types';
import { getDataQuality } from 'components/common/DataQualityCircularProgressBar/utils';
import { ADD_TRANSFORMATION_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import {
  AddTransformationBodyWrapper,
  AddTransformationWrapper,
} from 'components/common/BoxContainer';
import { AddTransformationButton } from 'components/common/ButtonWidget';
import styled from 'styled-components';
import { Container, Drawer } from '@material-ui/core';
import {
  enableDoneButton,
  getFilteredColumn,
  getIsSingleSelectionCheck,
} from 'components/WranglerGrid/SelectColumnPanel/utils';
import DrawerHeader from 'components/WranglerGrid/SelectColumnPanel/DrawerHeader';

export const DrawerContainer = styled(Container)`
  width: 500px;
  height: 100%;
  padding-left: 30px;
`;

export const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    top: 46px;
    height: calc(100vh - 47px);
  }
`;

export default function SelectColumnPanel({
  transformationDataType,
  transformationName,
  columnsList,
  missingItemsList,
  onCancel,
}: IAddTransformationProps) {
  const [columnsPopup, setColumnsPopup] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<IHeaderNamesList[]>([]);
  const [dataQualityValue, setDataQualityValue] = useState<Array<Record<string, string | number>>>(
    []
  );
  const filteredColumnsOnTransformationType: IHeaderNamesList[] = getFilteredColumn(
    transformationDataType,
    columnsList
  );
  const isSingleSelection = getIsSingleSelectionCheck(transformationName);

  const closeSelectColumnsPopup = () => {
    setColumnsPopup(false);
    onCancel();
  };

  const closeSelectColumnsPopupWithoutColumn = () => {
    setColumnsPopup(false);
    setSelectedColumns([]);
    onCancel();
  };

  useEffect(() => {
    const getPreparedDataQuality: Array<Record<string, string | number>> = getDataQuality(
      missingItemsList,
      columnsList
    );
    setDataQualityValue(getPreparedDataQuality);
  }, []);

  return (
    <StyledDrawer open={columnsPopup} data-testid="select-column-panel" anchor="right">
      <DrawerContainer data-testid="select-column-drawer">
        <DrawerHeader
          closeClickHandler={closeSelectColumnsPopupWithoutColumn}
          isSingleSelection={isSingleSelection}
        />
        <AddTransformationWrapper>
          <AddTransformationBodyWrapper>
            <ColumnsList
              columnsList={columnsList}
              selectedColumnsCount={selectedColumns.length}
              setSelectedColumns={setSelectedColumns}
              dataQuality={dataQualityValue}
              transformationDataType={transformationDataType}
              transformationName={transformationName}
              selectedColumns={selectedColumns}
              filteredColumnsOnTransformationType={filteredColumnsOnTransformationType}
              isSingleSelection={isSingleSelection}
            />
          </AddTransformationBodyWrapper>
          <AddTransformationButton
            disabled={enableDoneButton(transformationName, selectedColumns)}
            color="primary"
            data-testid="button-done"
            onClick={closeSelectColumnsPopup}
          >
            {T.translate(`${ADD_TRANSFORMATION_PREFIX}.done`)}
          </AddTransformationButton>
        </AddTransformationWrapper>
      </DrawerContainer>
    </StyledDrawer>
  );
}
