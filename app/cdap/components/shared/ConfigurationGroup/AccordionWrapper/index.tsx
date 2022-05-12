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
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import IconSVG from 'components/shared/IconSVG';

const useStyles = makeStyles({
  nostyle: {
    all: 'unset',
  },
  summaryContent: {
    padding: '0',
    '& .MuiAccordionSummary-content': {
      display: 'block',
    },
    '& .MuiIconButton-edgeEnd': {
      marginRight: '5px',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: '0',
    },
  },
});

interface IAccordionProps {
  header: React.ReactNode;
  details: React.ReactNode;
}

const AccordionWrapper = ({ header, details }: IAccordionProps) => {
  const classes = useStyles();
  const expandedIcon = <IconSVG name={'icon-caret-down'} />;
  return (
    <Accordion className={classes.nostyle}>
      <AccordionSummary className={classes.summaryContent} expandIcon={expandedIcon}>
        {header}
      </AccordionSummary>
      <AccordionDetails className={classes.nostyle}>{details}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionWrapper;
