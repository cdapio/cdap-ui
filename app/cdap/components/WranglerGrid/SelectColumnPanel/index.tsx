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

import { IGeneralStatistics } from 'components/GridTable/types';
import ColumnsList from 'components/WranglerGrid/SelectColumnPanel/ColumnsList';
import {
  MULTI_SELECTION_COLUMN,
  PREFIX,
} from 'components/WranglerGrid/SelectColumnPanel/constants';
import {
  PanelContainer,
  StyledButton,
  Wrapper,
} from 'components/WranglerGrid/SelectColumnPanel/styles';
import {
  IHeaderNamesList,
  IMultipleSelectedFunctionDetail,
} from 'components/WranglerGrid/SelectColumnPanel/types';
import { getDataQuality } from 'components/WranglerV2/DataQualityCircularProgressBar';
import DrawerWidget from 'components/WranglerV2/DrawerWidget';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';

interface ISelectColumnPanelProps {
  transformationDataType: string[];
  transformationName: string;
  columnsList: IHeaderNamesList[];
  missingItemsList: Record<string, IGeneralStatistics>;
  onCancel: () => void;
}

/**
 * @param transformationDataType - list of data types that are supported by the selected transformation
 * @param columnsList - list of all existing columns
 * @return - of column based on the transformation/option selected
 * i.e. transformationDataType = "ADD" can be performed on column whose datatype is either int, float or double.
 * so this function will return only those columns whose dataype is either int, float or double
 */
export const getFilteredColumn = (
  transformationName: string,
  transformationDataType: string[],
  columnsList: IHeaderNamesList[]
) => {
  if (transformationDataType.length && transformationDataType.includes('all')) {
    return columnsList.filter((eachColumn) => {
      const lowercaseTypes = eachColumn.type.map((eachType) => eachType.toLowerCase());

      return !lowercaseTypes.includes(transformationName.toLowerCase());
    });
  }

  return columnsList.filter((columnDetail: IHeaderNamesList) =>
    transformationDataType.some((dataTypeCollection: string) =>
      dataTypeCollection.includes(columnDetail.type[0].toLowerCase())
    )
  );
};

/**
 * @param transformationName - name of the selected transformation
 * @param selectedColumns - list of selected columns
 * @return - enabled or disabled state of Done button
 * following is the criteria
 * 1. atleast one column is selected
 * 2. in case of join and swap transformation functions, two column needs to be selected while
 */
export const enableDoneButton = (
  transformationName: string,
  selectedColumns: IHeaderNamesList[]
) => {
  const isTwoColumnSelectionMode = MULTI_SELECTION_COLUMN.some(
    (functionNameDetail: IMultipleSelectedFunctionDetail) =>
      functionNameDetail.value === transformationName && !functionNameDetail.isMoreThanTwo
  );
  if (isTwoColumnSelectionMode) {
    return selectedColumns.length !== 2; // implies that the button should be enabled on when two columns are selected
  }
  return !selectedColumns.length; // in any case, atleast one column must be selected
};

/**
 * @param transformationName - name of the selected transformation
 * @return - whether selected transformation can be applied on single column or multiple column must be selected
 */
export const getIsSingleSelectionCheck = (transformationName: string) =>
  !MULTI_SELECTION_COLUMN.some(
    (functionDetail: IMultipleSelectedFunctionDetail) =>
      functionDetail.value.toLowerCase() === transformationName.toLowerCase()
  );

export default function SelectColumnPanel({
  transformationDataType,
  transformationName,
  columnsList,
  missingItemsList,
  onCancel,
}: ISelectColumnPanelProps) {
  const [columnsPopup, setColumnsPopup] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<IHeaderNamesList[]>([]);
  const [dataQualityValue, setDataQualityValue] = useState<Array<Record<string, string | number>>>(
    []
  );

  const filteredColumnsOnTransformationType: IHeaderNamesList[] = getFilteredColumn(
    transformationName,
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

  const getHeadingText = () => {
    if (isSingleSelection) {
      return T.translate(`${PREFIX}.selectColumnHeading`);
    }
    return T.translate(`${PREFIX}.selectMultiColumnsHeading`);
  };

  useEffect(() => {
    const getPreparedDataQuality = getDataQuality(missingItemsList, columnsList);
    setDataQualityValue(getPreparedDataQuality);
  }, []);

  return (
    <DrawerWidget
      anchor="right"
      closeClickHandler={closeSelectColumnsPopupWithoutColumn}
      headingText={getHeadingText()}
      showBackIcon={true}
      onBackIconClick={closeSelectColumnsPopupWithoutColumn}
      showDivider={false}
      open={columnsPopup}
      dataTestId="select-column-drawer"
      showHeaderSeparator={false}
    >
      <PanelContainer>
        <Wrapper>
          <ColumnsList
            selectedColumnsCount={selectedColumns.length}
            setSelectedColumns={setSelectedColumns}
            dataQuality={dataQualityValue}
            transformationDataType={transformationDataType}
            transformationName={transformationName}
            selectedColumns={selectedColumns}
            filteredColumnsOnTransformationType={filteredColumnsOnTransformationType}
            isSingleSelection={isSingleSelection}
          />
        </Wrapper>
        <StyledButton
          disabled={enableDoneButton(transformationName, selectedColumns)}
          color="primary"
          data-testid="button-done"
          onClick={closeSelectColumnsPopup}
        >
          {T.translate(`${PREFIX}.done`)}
        </StyledButton>
      </PanelContainer>
    </DrawerWidget>
  );
}
