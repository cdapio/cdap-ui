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
