import { DATATYPE_OPTIONS } from './components/NestedMenu/constants';

export const getDirective = (option, column) => {
  if (DATATYPE_OPTIONS.some((item) => item.value === option)) {
    return `set-type :${column} ${option}`;
  } else if (option === 'delete') {
    return `drop ${column}`;
  } else if (option === 'keep') {
    return `keep ${column}`;
  } else if (option === 'uppercase') {
    return `uppercase :${column}`;
  } else if (option === 'lowercase') {
    return `lowercase :${column}`;
  } else if (option === 'titlecase') {
    return `titlecase :${column}`;
  } else if (option === 'ltrim') {
    return `ltrim :${column}`;
  } else if (option === 'rtrim') {
    return `rtrim :${column}`;
  } else if (option === 'trim') {
    return `trim :${column}`;
  } else {
    null;
  }
};

export const getDirectiveOnTwoInputs = (option, column, value) => {
  if (option === 'delimited-text') {
    return `split-to-rows :${column} ${value}`;
  } else if (option === 'using-patterns') {
    return `extract-regex-groups :${column} ${value}`;
  } else if (option === 'using-delimiters') {
    return `split-to-columns :${column} ${value}`;
  } else if (option === 'copy-column') {
    return `copy :${column} :${value} true`;
  } else if (option === 'findAndReplace') {
    return `find-and-replace :${column} ${value}`;
  } else if (option === 'concatenate') {
    return `set-column :${column} ${value}`;
  } else if (option === 'custom-transform') {
    return `set-column :${column} ${value}`;
  } else if (option === 'filter') {
    return value;
  } else if (option === 'define-variable') {
    return value;
  } else if (option === 'parseCSV') {
    return value;
  } else if (option === 'parseExcel') {
    return value;
  } else if (option === 'parseJSON') {
    return value;
  } else {
    null;
  }
};

export const getDirectiveOnMultipleInputs = (option, column, value_1, value_2) => {
  if (option === 'hash') {
    return `hash :${column} ${value_1} ${value_2}`;
  } else {
    return null;
  }
};
