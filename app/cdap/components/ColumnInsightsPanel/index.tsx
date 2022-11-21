import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';
import ColumnInsightsInlayWidget from 'components/ColumnInsightsWidget';
import ColumnDetails from 'components/ColumnInsightsWidget/Components/ColumnDetails';
import ColumnDataDistribution from 'components/ColumnInsights/Components/ColumnDataDistribution';
import ColumnDataQuality, {
  IColumnInfo,
} from 'components/ColumnInsightsWidget/Components/ColumnDataQuality';

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
  padding-right: 24px;
  padding-left: 30px !important;
`;

const PREFIX = 'features.NewWranglerUI.ColumnInsights';

export default function({
  columnData,
  renameColumnNameHandler,
  dataTypeHandler,
  columnType,
  onClose,
}: IColumnInsightsProps) {
  const [columnDetail, setColumnDetail] = useState(columnData);

  useEffect(() => {
    setColumnDetail(columnData);
  }, [columnData]);

  const closeClickHandler = () => {
    onClose();
  };

  return (
    <Fragment>
      <ColumnInsightsInlayWidget closeClickHandler={closeClickHandler}>
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
          <ColumnDataDistribution graphData={columnDetail?.dataDistributionGraphData} />
        </ColumnInsightsContainer>
      </ColumnInsightsInlayWidget>
    </Fragment>
  );
}
