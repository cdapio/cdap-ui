import React from 'react';
import FilterComponent from './FilterComponent';
import ParseCSVComponent from './ParseComponent/ParseCSVComponent';
import ParseLogComponent from './ParseComponent/ParseLogComponent';

export const DIRECTIVE_COMPONENTS = [
  {
    type: 'filter',
    component: FilterComponent,
  },
  {
    type: 'parseCSV',
    component: ParseCSVComponent,
  },
  {
    type: 'parseLog',
    component: ParseLogComponent,
  },
];

export const PLEASE_SELECT_THE_LOGS_FORMAT = 'Please select the logs format';
