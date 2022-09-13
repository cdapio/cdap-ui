import React from 'react';
import FilterComponent from './FilterComponent';
import ParseCSVComponent from './ParseComponent/ParseCSVComponent';
import ParseDateTimeComponent from './ParseComponent/ParseDateTimeComponent';
import ParseFixedLengthComponent from './ParseComponent/ParseFixedLengthComponent';
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
  {
    type: 'parseDateTime',
    component: ParseDateTimeComponent,
  },
  {
    type: 'parseFixedLength',
    component: ParseFixedLengthComponent,
  },
];

export const PLEASE_SELECT_THE_LOGS_FORMAT = 'Please select the logs format';
export const PLEASE_SELECT_THE_DATE_FORMAT = 'Please select the date format';
export const PARSE_AS_FIXED_LENGTH = 'Parse as Fixed length';
export const COLUMN_WIDTHS = 'Column widths';
export const PADDING = 'Padding';
export const COLUMN_WIDTHS_PLACEHOLDER = 'e.g. 3, 5, 2, 5, 15';
export const PADDING_PLACEHOLDER = 'Optional padding parameter';
