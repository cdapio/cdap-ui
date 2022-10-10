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
import { Accordion, Button, TextField } from '@material-ui/core';
import styled from 'styled-components';
import AccordionSummary, { AccordionSummaryProps } from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import React from 'react';

export const CaretContainer = styled.div`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 25px;
`;

export const CheckboxItemContainer = styled.div`
  display: inline-block;
  width: 33%;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ErrorText = styled.div`
  color: #d15668;
`;

export const PipelineName = styled.div`
  display: inline-block;
  max-width: 230px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const HelperText = styled.div`
  margin: 5px 0;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
`;

export const EventsList = styled(CheckboxContainer)`
  margin-bottom: 10px;
`;

export const PipelineDescription = styled.div`
  margin: 5px;
`;

export const PipelineTriggerButton = styled(Button)`
  background: white;
`;

export const PipelineListHeader = styled.div`
  font-weight: bold;
  border-bottom: 1px solid #dedede;
  padding: 5px 0;
  margin: 5px 0 0 23px;
  text-decoration: underline;
`;

export const PipelineTriggerHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TextCenter = styled.div`
  text-align: center !important;
`;

export const LoadingIconStyle = styled.span`
  margin: 0 80px 0 10px;
`;

export const StyledNameSpace = styled.div`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 100px;
`;

export const StyledNameSpaceHeader = styled(StyledNameSpace)`
  text-decoration: underline;
`;

export const StyledTypeHeader = styled(StyledNameSpace)`
  opacity: 1;
  text-decoration: underline;
`;

export const StyledAccordion = styled(Accordion)`
  border-bottom: 1px solid #dedede;
  margin-top: -1px;
  &.Mui-expanded {
    margin: 0px;
    overflow: scroll;
  }
`;

export const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary expandIcon={<ArrowRightIcon />} {...props} />
))(() => ({
  flexDirection: 'row-reverse',
  'margin-left': '-15px',
  'min-height': '0',
  padding: '0',
  '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: '5px',
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    fontWeight: 'bold',
  },
}));

export const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 5px;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  flex-direction: column;
  background-color: #efefef;
`;

export const PipelineCount = styled.div`
  font-style: italic;
  margin-bottom: 10px;
`;

export const TriggersTab = styled.div`
  padding: 15px;
`;

export const StyledPipelineName = styled(PipelineName)`
  width: calc(100% - 125px);
`;

export const StyledPipelineNameHeader = styled(StyledPipelineName)`
  text-decoration: underline;
`;

export const PipelineLink = styled.a`
  margin-left: 10px;
`;

export const PipelineListContainer = styled.div`
  padding-right: 7px;
`;

export const TriggerCardButton = styled(Button)`
  color: #5a84e4;
`;

export const SearchTriggerTextField = styled(TextField)`
  width: 100%;
  && {
    margin: 10px 0;
    vertical-align: inherit;
    .MuiInput-underline:after {
      border-bottom: 2px solid black;
    }
  }
`;
