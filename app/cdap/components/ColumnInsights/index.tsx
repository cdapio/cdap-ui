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

import DrawerWidget from 'components/DrawerWidget';
import React, { useEffect, useState } from 'react';
import ColumnDataDistribution from 'components/ColumnInsights/Components/ColumnDataDistribution';
import ColumnDataQuality, {
  IColumnInfo,
} from 'components/ColumnInsights/Components/ColumnDataQuality';
import ColumnDetails from 'components/ColumnInsights/Components/ColumnDetails';
import styled from 'styled-components';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';

const PREFIX = 'features.WranglerNewUI.ColumnInsights';
interface IColumnInsightsProps {
  columnData: IColumnData;
  renameColumnNameHandler: (oldColumnName: string, newColumnName: string) => void;
  dataTypeHandler: (dataType: string) => void;
  columnType: string;
  onClose: () => void;
}

interface IColumnData {
  open: boolean;
  columnName: string;
  distinctValues: number;
  characterCount: Record<'min' | 'max', number>;
  dataQuality: IDataQuality;
  dataQualityBar: IColumnInfo;
  dataTypeString: string;
  dataDistributionGraphData: IGraphData[];
  columnNamesList: string[];
}

interface IGraphData {
  text: string;
  value: number;
}

interface IDataQuality {
  nullValueCount: number;
  nullValuePercentage: number;
  emptyValueCount: number;
  emptyValuePercentage: number;
}

const ColumnInsightsContainer = styled(Box)`
  padding-right: 10px;
`;

export default function({
  columnData,
  renameColumnNameHandler,
  dataTypeHandler,
  columnType,
  onClose,
}: IColumnInsightsProps) {
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [columnDetail, setColumnDetail] = useState(columnData);

  useEffect(() => {
    setColumnDetail(columnData);
  }, [columnData]);

  const closeClickHandler = () => {
    setDrawerStatus(false);
    onClose();
  };
  return (
    <DrawerWidget
      headingText={T.translate(`${PREFIX}.columnInsightsHeadingText`).toString()}
      openDrawer={drawerStatus}
      anchor="left"
      headerActionTemplate={<></>}
      closeClickHandler={closeClickHandler}
      showBackIcon={false}
      showDivider={false}
      dataTestId={'column-insights-panel'}
    >
      <ColumnInsightsContainer>
        <ColumnDetails
          columnName={columnDetail?.columnName}
          dataTypeHandler={dataTypeHandler}
          columnType={columnType}
          renameColumnNameHandler={renameColumnNameHandler}
          distinctValues={columnDetail?.distinctValues}
          characterCount={`${columnDetail?.characterCount?.min}-${columnDetail?.characterCount?.max}`}
          dataTypeString={columnDetail?.dataTypeString}
          columnHeaderList={columnData.columnNamesList}
        />
        <ColumnDataQuality
          dataQuality={columnDetail?.dataQuality}
          columnInfo={columnDetail?.dataQualityBar}
        />
        <ColumnDataDistribution
          graphData={columnDetail?.dataDistributionGraphData}
          columnName={columnDetail?.columnName}
          distinctValues={columnDetail?.distinctValues}
        />
      </ColumnInsightsContainer>
    </DrawerWidget>
  );
}
