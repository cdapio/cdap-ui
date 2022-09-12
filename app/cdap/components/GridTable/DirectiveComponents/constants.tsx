import React from 'react';
import FilterComponent from './FilterComponent';
import ParseCSVComponent from './ParseComponent/ParseCSVComponent';

export const DIRECTIVE_COMPONENTS = [
  {
    type: 'filter',
    component: FilterComponent,
  },
  {
    type: 'parseCSV',
    component: ParseCSVComponent,
  },
];
