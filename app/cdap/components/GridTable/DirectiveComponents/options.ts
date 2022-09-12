import {
  CAP_A,
  CAP_D,
  COMMA,
  CUSTOM_DELIMITER,
  PIPE,
  SPACE,
  TAB,
} from './ParseCSVComponent/constants';

export const PARSE_CSV_OPTIONS = [
  {
    value: 'comma',
    label: COMMA,
  },
  {
    value: 'tab',
    label: TAB,
  },
  {
    value: 'space',
    label: SPACE,
  },
  {
    value: 'pipe',
    label: PIPE,
  },
  {
    value: 'capA',
    label: CAP_A,
  },
  {
    value: 'capD',
    label: CAP_D,
  },
  {
    value: 'customDelimiter',
    label: CUSTOM_DELIMITER,
  },
];
