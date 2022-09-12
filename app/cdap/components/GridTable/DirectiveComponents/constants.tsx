import React from 'react';
import FilterComponent from './FilterComponent';
import ParseCSVComponent from './ParseComponent/ParseCSVComponent';
import ParseLogComponent from './ParseComponent/ParseLogComponent';
import ParseSimpleDateComponent from './ParseComponent/ParseSimpleDateComponent';

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
  {
    type: 'parseSimpleDate',
    component: ParseSimpleDateComponent,
  },
];

export const PLEASE_SELECT_THE_LOGS_FORMAT = 'Please select the logs format';
export const PLEASE_SELECT_THE_DATE_FORMAT = 'Please select the date format';
