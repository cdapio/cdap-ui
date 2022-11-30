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

import { Box, IconButton, Modal } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import RenderLabel from 'components/ColumnInsights/Components/common/RenderLabel';
import { BarChart } from 'react-easy-chart';
import blue from '@material-ui/core/colors/blue';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import T from 'i18n-react';
import { grey } from '@material-ui/core/colors';
import { useEffect, useState } from 'react';

export const PREFIX = 'features.WranglerNewUI.ColumnInsightsChart';

interface IColumnInsightsChartProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  graphData: IGraphData[];
  columnName: string;
  distinctValues: number;
}

interface IGraphData {
  text: string;
  value: number;
}

const CustomizedModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 400px;
  background-color: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 3px 4px 15px rgba(33, 150, 243, 0.15);
  outline: none !important;
`;

const ModalHeading = styled(Box)`
  border-bottom: 1px solid ${grey[300]};
  padding: 4px 9px 20px 10px;
  display: flex;
  justify-content: space-between;
`;

const DistributionData = styled(Box)`
  padding: 20px 10px 40px 10px;
  min-height: 90px;
  display: flex;
  gap: 40px;
`;

const GraphContainer = styled(Box)`
  position: relative;
  height: 225px;
  overflow-x: scroll;
  padding-left: 10px;
  & .bar {
    fill: ${blue[500]} !important;
    background: ${blue[500]} !important;
    width: 40px !important;
  }
  &:hover .bar {
    fill: ${blue[500]} !important;
    background: ${blue[500]} !important;
    opacity: 0.5 !important;
  }
  & .bar:hover {
    fill: ${blue[500]} !important;
    background: ${blue[500]} !important;
    opacity: 1 !important;
  }
`;

const ToolTipDiv = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2), 0px 9px 10px rgba(0, 0, 0, 0.14),
    0px 5px 14px rgba(0, 0, 0, 0.12);
  font-size: 12px;
  line-height: 150%;
  color: ${grey[900]};
  top: ${({ top }) => (top ? top : '0')};
  left: ${({ left }) => (left ? left : '0')};
  position: absolute;
  padding: 10px;
`;

export default function({
  open,
  setOpen,
  graphData,
  columnName,
  distinctValues,
}: IColumnInsightsChartProps) {
  const handleClose = () => setOpen(false);
  const [barData, setBarData] = useState([]);
  const [toolTipData, setToolTipData] = useState({
    showToolTip: false,
    top: '',
    left: '',
    y: '',
    x: '',
  });

  useEffect(() => {
    const updatedBarData = [];
    graphData?.map((item) => {
      updatedBarData.push({
        x: item.text,
        y: item.value,
      });
    });
    setBarData(updatedBarData);
  }, []);
  const barChartProps = {
    width: distinctValues,
    height: 150,
  };
  const mouseOverHandler = (d, e) => {
    console.log('d, e', d, e);
    setToolTipData({
      showToolTip: true,
      top: `${e.offsetY - 10}px`,
      left: `${e.offsetX + 10}px`,
      y: d.y,
      x: d.x,
    });
  };
  const mouseMoveHandler = (e) => {
    // setToolTipData({
    //   showToolTip: false,
    //   top: ``,
    //   left: ``,
    //   y: '',
    //   x: ''
    // })
  };
  const mouseOutHandler = () => {
    setToolTipData({
      showToolTip: false,
      top: ``,
      left: ``,
      y: '',
      x: '',
    });
  };

  console.log('graphData', graphData, toolTipData);

  return (
    <Modal open={open} onClose={handleClose} data-testid="view-full-chart-modal">
      <CustomizedModalContent data-testid="view-full-chart-modal-content">
        <ModalHeading>
          <RenderLabel fontSize={20} dataTestId="distribution">
            <>{T.translate(`${PREFIX}.distribution`)}</>
          </RenderLabel>
          <IconButton onClick={handleClose} data-testid="close-icon-button">
            <CloseRoundedIcon />
          </IconButton>
        </ModalHeading>
        <DistributionData>
          <RenderLabel dataTestId="column-name">
            <>
              {T.translate(`${PREFIX}.columnName`)}
              {columnName}
            </>
          </RenderLabel>
          <RenderLabel dataTestId="distinct-values">
            <>{T.translate(`${PREFIX}.distinct`) + `${distinctValues}`}</>
          </RenderLabel>
        </DistributionData>
        <GraphContainer>
          <BarChart
            height={150}
            width={50 * distinctValues}
            axisLabels={{ x: '', y: `${T.translate(`${PREFIX}.barChartYLabel`)}` }}
            // yAxis={`${T.translate(`${PREFIX}.barChartYLabel`)}`}
            data={barData}
            mouseOverHandler={mouseOverHandler}
            mouseOutHandler={mouseOutHandler}
          />
          {toolTipData.showToolTip && (
            <ToolTipDiv
              top={toolTipData.top}
              left={toolTipData.left}
            >{`${toolTipData.x} : ${toolTipData.y}`}</ToolTipDiv>
          )}
        </GraphContainer>
      </CustomizedModalContent>
    </Modal>
  );
}
