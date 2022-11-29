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
import FunctionNameWidget from 'components/WranglerGrid/AddTransformationPanel/FunctionNameWidget';
import SelectColumnsWidget from 'components/WranglerGrid/AddTransformationPanel/SelectColumnsWidget';
import SelectedColumnCountWidget from 'components/WranglerGrid/SelectColumnPanel/CountWidget';
import {
  getDirective,
  applyButtonEnabled,
} from 'components/WranglerGrid/AddTransformationPanel/utils';
import { Box, Divider } from '@material-ui/core';
import styled from 'styled-components';
import { enableDoneButton } from 'components/WranglerGrid/SelectColumnPanel/utils';
import { IStatistics } from 'components/GridTable/types';
import SelectColumnDrawerHeader from 'components/WranglerGrid/SelectColumnPanel/DrawerHeader';
import { StyledDrawer, DrawerContainerBox } from 'components/WranglerGrid/SelectColumnPanel';
import AddTransformationDrawerHeader from 'components/WranglerGrid/AddTransformationPanel/DrawerHeader';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import { TRANSFORMATION_COMPONENTS } from 'components/WranglerGrid/TransformationComponents/constants';
import TransformationContent from 'components/WranglerGrid/TransformationComponents';

const CountWidgetWrapper = styled(Box)`
  padding: 10px 0;
`;

const transformationComponentDefaultValues = {
  radioOption: '',
  customInput: '',
  startValue: '',
  endValue: '',
  nDigit: '',
  extractOptionSelected: '',
};

interface IAddTransformationProps {
  transformationDataType: string[];
  transformationName: string;
  columnsList: IHeaderNamesList[];
  missingItemsList: IStatistics;
  onCancel: () => void;
  applyTransformation: (directive: string) => void;
  transformationLink: string;
  onCustomSelection?: (column: string) => void;
}

export default function({
  transformationDataType,
  transformationName,
  columnsList,
  missingItemsList,
  onCancel,
  applyTransformation,
  transformationLink,
  onCustomSelection,
}: IAddTransformationProps) {
  const [drawerStatus, setDrawerStatus] = useState<boolean>(true);
  const [columnsPopup, setColumnsPopup] = useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = useState<IHeaderNamesList[]>([]);
  const [dataQualityValue, setDataQualityValue] = useState<IDataQualityItem[]>([]);
  const [transformationComponentValues, setTransformationComponentsValue] = useState<
    ITransformationComponentValues
  >(transformationComponentDefaultValues);

  const closeClickHandler = () => {
    onCancel();
    setDrawerStatus(false);
  };

  const closeSelectColumnsPopup = () => {
    if (
      transformationName === 'mask-data-custom-selection' ||
      transformationName === 'extract-using-positions'
    ) {
      setColumnsPopup(false);
      setDrawerStatus(false);
      onCustomSelection(selectedColumns[0].label);
    } else {
      setColumnsPopup(false);
      setDrawerStatus(true);
    }
  };

  const closeSelectColumnsPopupWithoutColumn = () => {
    setColumnsPopup(false);
    setSelectedColumns([]);
    setDrawerStatus(true);
  };

  const handleSelectColumn = () => {
    setColumnsPopup(true);
  };

  const handleApply = () => {
    const directive: string = getDirective(
      transformationName,
      selectedColumns[0].label,
      transformationComponentValues
    );
    applyTransformation(directive);
    setDrawerStatus(false); // TODO process of sending value || or directive of function selected
  };

  useEffect(() => {
    const getPreparedDataQuality: IDataQualityItem[] = getDataQuality(
      missingItemsList,
      columnsList
    );
    setDataQualityValue(getPreparedDataQuality);
  }, []);

  const isComponentAvailable = TRANSFORMATION_COMPONENTS.some(
    (item) => item.type === transformationName
  );

  return (
    <Fragment>
      <StyledDrawer data-testid="add-transformation-drawer" anchor="right" open={drawerStatus}>
        <DrawerContainerBox role="presentation" data-testid="add-transformation-drawer">
          <AddTransformationDrawerHeader closeClickHandler={closeClickHandler} />
          <AddTransformationWrapper>
            <AddTransformationBodyWrapper>
              <CountWidgetWrapper>
                <SelectedColumnCountWidget selectedColumnsCount={selectedColumns?.length} />
              </CountWidgetWrapper>
              <Divider />
              <FunctionNameWidget
                transformationName={transformationName}
                transformationLink={transformationLink}
              />
              <SelectColumnsWidget
                handleSelectColumn={handleSelectColumn}
                selectedColumns={selectedColumns}
                transformationName={transformationName}
              />
              {isComponentAvailable && (
                <TransformationContent
                  setTransformationComponentsValue={setTransformationComponentsValue}
                  transformationComponent={TRANSFORMATION_COMPONENTS}
                  transformationComponentValues={transformationComponentValues}
                  transformationName={transformationName}
                  transformationDataType={transformationDataType}
                  columnsList={columnsList}
                  missingItemsList={missingItemsList}
                  onCancel={onCancel}
                  applyTransformation={applyTransformation}
                />
              )}
            </AddTransformationBodyWrapper>
            <AddTransformationButton
              disabled={applyButtonEnabled(
                transformationName,
                transformationComponentValues,
                selectedColumns
              )}
              color="primary"
              data-testid="apply-step-button"
              onClick={handleApply}
            >
              {T.translate(`${ADD_TRANSFORMATION_PREFIX}.applyStep`)}
            </AddTransformationButton>
          </AddTransformationWrapper>
        </DrawerContainerBox>
      </StyledDrawer>
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
    </Fragment>
  );
}
