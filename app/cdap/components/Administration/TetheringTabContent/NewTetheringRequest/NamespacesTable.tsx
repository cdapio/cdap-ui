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
import styled from 'styled-components';
import { Grid, GridHeader, GridBody, GridRow, GridCell, StyledCheckbox } from '../shared.styles';
import { getScrollableColTemplate, trimMemoryLimit } from '../utils';
import { INamespace } from '../types';
import { TETHERED_NS_COLUMN_TEMPLATE, TETHERED_NS_TABLE_HEADERS } from './constants';

interface INameSpacesTableProps {
  tableData: INamespace[];
  selectedNamespaces: string[];
  broadcastChange: (ns: string) => void;
}

const StyledGrid = styled(Grid)`
  padding: 0;
  margin-bottom: 10px;
`;

const StyledGridBody = styled(GridBody)`
  max-height: 150px;
  overflow: auto;
`;

const renderTableHeader = (tableData: INamespace[]) => {
  const columnTemplate =
    tableData.length > 5
      ? getScrollableColTemplate(TETHERED_NS_COLUMN_TEMPLATE)
      : TETHERED_NS_COLUMN_TEMPLATE;
  return (
    <GridHeader>
      <GridRow columnTemplate={columnTemplate}>
        {TETHERED_NS_TABLE_HEADERS.map((header, i) => {
          return <GridCell key={i}>{header.label}</GridCell>;
        })}
      </GridRow>
    </GridHeader>
  );
};

const renderTableBody = (
  data: INamespace[],
  renderRowFn: (req: INamespace, idx: number) => React.ReactNode
) => <StyledGridBody>{data.map((req, idx) => renderRowFn(req, idx))}</StyledGridBody>;

const NameSpacesTable = ({
  tableData,
  selectedNamespaces,
  broadcastChange,
}: INameSpacesTableProps) => {
  const renderRow = (req: INamespace, idx: number) => {
    const { namespace, cpuLimit, memoryLimit } = req;
    const isLast = idx === tableData.length - 1;

    const handleCheckboxChange = (event) => {
      broadcastChange(event.target.value);
    };

    return (
      <GridRow columnTemplate={TETHERED_NS_COLUMN_TEMPLATE} border={!isLast} key={idx}>
        <GridCell>
          <StyledCheckbox
            data-testid="tethering-ns-chk-box"
            checked={selectedNamespaces.includes(namespace)}
            color="primary"
            value={namespace}
            onChange={handleCheckboxChange}
          />
        </GridCell>
        <GridCell>{namespace}</GridCell>
        <GridCell>{cpuLimit}</GridCell>
        <GridCell>{trimMemoryLimit(memoryLimit)}</GridCell>
      </GridRow>
    );
  };

  return (
    <StyledGrid>
      {renderTableHeader(tableData)}
      {renderTableBody(tableData, renderRow)}
    </StyledGrid>
  );
};

export default NameSpacesTable;
