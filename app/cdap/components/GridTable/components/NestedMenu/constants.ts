export const MENU_OPTIONS = [
  {
    key: 'changeDatatype',
    label: 'Change data type',
    options: [
      { key: 'string', label: 'string' },
      { key: 'boolean', label: 'boolean' },
      { key: 'integer', label: 'integer' },
      { key: 'long', label: 'long' },
      { key: 'short', label: 'short' },
      { key: 'float', label: 'float' },
      { key: 'double', label: 'double' },
      { key: 'decimal', label: 'decimal' },
      { key: 'bytes', label: 'bytes' },
    ],
  },
  {
    key: 'setQualifiler',
    label: 'Set qualifier',
  },
  {
    key: 'divider',
  },
  {
    key: 'text',
    label: 'Text',
    options: [
      { key: 'heading', label: 'Remove' },
      { key: 'letters', label: 'Letters' },
      { key: 'numbers', label: 'Numbers' },
      { key: 'specialCharacters', label: 'Special Characters' },
      { key: 'numbers', label: 'Leading white spaces' },
      { key: 'numbers', label: 'Trailing White spaces' },
      { key: 'divider' },
      { key: 'heading', label: 'Format' },
      { key: 'numbers', label: 'UPPERCASE' },
      { key: 'numbers', label: 'Lowercase' },
      { key: 'numbers', label: 'Title Case' },
    ],
  },
  {
    key: 'dateAndTime',
    label: 'Date and Time',
  },
  {
    key: 'findAndReplace',
    label: 'Find and Replace',
  },
  {
    key: 'filter',
    label: 'Filter',
  },
];
