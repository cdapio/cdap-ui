import {
  CAP_A,
  CAP_D,
  COMMA,
  CUSTOM_DELIMITER,
  PIPE,
  SPACE,
  TAB,
} from './ParseComponent/ParseCSVComponent/constants';

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

export const PARSE_LOG_OPTIONS = [
  {
    value: 'common',
    label: 'Common',
  },
  {
    value: 'combined',
    label: 'Combined',
  },
  {
    value: 'combinedio',
    label: 'Combinedio',
  },
  {
    value: 'referer',
    label: 'Referer',
  },
  {
    value: 'agent',
    label: 'Agent',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
];

export const PARSE_SIMPLE_DATE_OPTIONS = [
  {
    label: 'MM/dd/yyyy',
    value: 'MM/dd/yyyy',
  },
  {
    label: 'dd/MM/yyyy',
    value: 'dd/MM/yyyy',
  },
  {
    label: 'MM-dd-yyyy',
    value: 'MM-dd-yyyy',
  },
  {
    label: 'MM-dd-yy',
    value: 'MM-dd-yy',
  },
  {
    label: 'yyyy-MM-dd',
    value: 'yyyy-MM-dd',
  },
  {
    label: 'yyyy-MM-dd HH:mm:ss',
    value: 'yyyy-MM-dd HH:mm:ss',
  },
  {
    label: "MM-dd-yyyy 'at' HH:mm:ss z",
    value: "MM-dd-yyyy 'at' HH:mm:ss z",
  },
  {
    label: 'dd/MM/yy HH:mm:ss',
    value: 'dd/MM/yy HH:mm:ss',
  },
  {
    label: "yyyy,MM.dd'T'HH:mm:ss.SSSZ",
    value: "yyyy,MM.dd'T'HH:mm:ss.SSSZ",
  },
  {
    label: 'MM.dd.yyyy HH:mm:ss.SSS',
    value: 'MM.dd.yyyy HH:mm:ss.SSS',
  },
  {
    label: 'EEE, d MMM yyyy HH:mm:ss',
    value: 'EEE, d MMM yyyy HH:mm:ss',
  },
  {
    label: "EEE, MMM d, ''yy",
    value: "EEE, MMM d, ''yy",
  },
  {
    label: 'h:mm a',
    value: 'h:mm a',
  },
  {
    label: 'H:mm a, z',
    value: 'H:mm a, z',
  },
  {
    label: 'Custom Format',
    value: 'customFormat',
  },
];
