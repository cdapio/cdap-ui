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
import React, { Fragment, useState, useEffect } from 'react';
import SelectColumnsList from 'components/WranglerGrid/SelectColumnPanel/ColumnsList';
import {
  IAddTransformationProps,
  IHeaderNamesList,
  IDataQualityItem,
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
import { enableDoneButton } from 'components/WranglerGrid/SelectColumnPanel/utils';
import SelectColumnDrawerHeader from 'components/WranglerGrid/SelectColumnPanel/DrawerHeader';

export const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    top: 46px;
    height: calc(100vh - 47px);
  }
`;

export const DrawerContainerBox = styled(Container)`
  width: 460px;
  height: 100%;
  padding-left: 30px;
`;

export default function({
  transformationDataType,
  transformationName,
  columnsList,
  missingItemsList,
  onCancel,
}: IAddTransformationProps) {
  const [columnsPopup, setColumnsPopup] = useState<boolean>(true);
  const [selectedColumns, setSelectedColumns] = useState<IHeaderNamesList[]>([]);
  const [dataQualityValue, setDataQualityValue] = useState<IDataQualityItem[]>([]);

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
    const getPreparedDataQuality: IDataQualityItem[] = getDataQuality(
      missingItemsList,
      columnsList
    );
    setDataQualityValue(getPreparedDataQuality);
  }, []);

  return (
    <StyledDrawer open={columnsPopup} data-testid="select-column-panel" anchor="right">
      <DrawerContainerBox role="presentation" data-testid="select-column-drawer">
        <SelectColumnDrawerHeader closeClickHandler={closeSelectColumnsPopupWithoutColumn} />
        <AddTransformationWrapper>
          <AddTransformationBodyWrapper>
            <SelectColumnsList
              columnsList={columnsList}
              selectedColumnsCount={selectedColumns.length}
              setSelectedColumns={setSelectedColumns}
              dataQuality={dataQualityValue}
              transformationDataType={transformationDataType}
              transformationName={transformationName}
              selectedColumns={selectedColumns}
            />
          </AddTransformationBodyWrapper>
          <AddTransformationButton
            disabled={enableDoneButton(transformationName, selectedColumns)}
            color="primary"
            data-testid="button_done"
            onClick={closeSelectColumnsPopup}
          >
            {T.translate(`${ADD_TRANSFORMATION_PREFIX}.done`)}
          </AddTransformationButton>
        </AddTransformationWrapper>
      </DrawerContainerBox>
    </StyledDrawer>
  );
}
