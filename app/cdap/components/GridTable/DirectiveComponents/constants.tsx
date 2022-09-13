import React from 'react';
import FilterComponent from './FilterComponent';
import ParseCSVComponent from './ParseComponent/ParseCSVComponent';
import ParseDateTimeComponent from './ParseComponent/ParseDateTimeComponent';
import ParseExcelComponent from './ParseComponent/ParseExcelComponent';
import ParseFixedLengthComponent from './ParseComponent/ParseFixedLengthComponent';
import ParseLogComponent from './ParseComponent/ParseLogComponent';
import ParseSimpleDateComponent from './ParseComponent/ParseSimpleDateComponent';
import ParseXMLToJSONComponent from './ParseComponent/ParseXMLToJSONComponent';

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
  {
    type: 'parseXML',
    component: ParseXMLToJSONComponent,
  },
  {
    type: 'parseJSON',
    component: ParseXMLToJSONComponent,
  },
  {
    type: 'parseExcel',
    component: ParseExcelComponent,
  },
];

export const PLEASE_SELECT_THE_LOGS_FORMAT = 'Please select the logs format';
export const PLEASE_SELECT_THE_DATE_FORMAT = 'Please select the date format';
export const PARSE_AS_FIXED_LENGTH = 'Parse as Fixed length';
export const COLUMN_WIDTHS = 'Column widths';
export const PADDING = 'Padding';
export const COLUMN_WIDTHS_PLACEHOLDER = 'e.g. 3, 5, 2, 5, 15';
export const PADDING_PLACEHOLDER = 'Optional padding parameter';
export const PARSE_AS_XML_TO_JSON = 'Parse as XML to JSON';
export const DEPTH = 'Depth';
export const DEPTH_PLACEHOLDER = 'Enter depth';
export const CHOOSE_SHEET_IN_EXCEL =
  'Choose how you would like to specify the sheet in your Excel file';
export const SHEET_NUMBER_PLACEHOLDER = 'Sheet number';
export const SHEET_NAME_PLACEHOLDER = 'Sheet name';
export const PLEASE_SELECT_THE_DELIMITER = 'Please select the delimiter';
export const COMMA = 'Comma';
export const TAB = 'Tab';
export const SPACE = 'Space';
export const PIPE = 'Pipe';
export const CAP_A = '^A';
export const CAP_D = '^D';
export const CUSTOM_DELIMITER = 'Custom delimiter';
export const SET_FIRST_ROW_AS_HEADER = 'Set first row as header';
