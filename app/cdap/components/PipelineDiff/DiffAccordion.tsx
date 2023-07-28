/*
 * Copyright © 2023 Cask Data, Inc.
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

import React, { ComponentProps } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import { blue } from '@material-ui/core/colors';

const AccordionRoot = styled(Accordion)`
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 0;
  width: 100%;

  &.Mui-expanded {
    flex: 1;
    margin: 0;
  }
  .MuiAccordionSummary-content,
  .MuiAccordionSummary-content.Mui-expanded {
    margin: 5px 0;
  }
  & > .MuiCollapse-root.MuiCollapse-entered {
    flex: 1;
    .MuiCollapse-wrapper,
    .MuiCollapse-wrapperInner,
    .MuiCollapse-wrapperInner > div {
      height: 100%;
    }
  }
  .MuiAccordionSummary-expandIcon {
    padding: 0 10px;
  }
`;
const AccordionSummaryRoot = styled(AccordionSummary)`
  &&& {
    background-color: ${blue[50]};
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    min-height: 0;
    width: 100%;
  }
`;
const AccordionDetailsRoot = styled(AccordionDetails)`
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 0;
`;

interface IDiffAccordionProps extends ComponentProps<typeof Accordion> {
  title: string;
}

export const DiffAccordion = ({ children, title, ...props }: IDiffAccordionProps) => {
  return (
    <AccordionRoot {...props}>
      <AccordionSummaryRoot expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummaryRoot>
      <AccordionDetailsRoot>{children}</AccordionDetailsRoot>
    </AccordionRoot>
  );
};
