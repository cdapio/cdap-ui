export const parseDirective = (functionName, column, radioValue, customInput, checkBoxValue) => {
  let directive;
  if (functionName === 'parseCSV') {
    switch (radioValue) {
      case 'comma':
        directive = `parse-as-csv :${column} ',' ${checkBoxValue}`;
        break;
      case 'tab':
        directive = `parse-as-csv :${column} '\\t' ${checkBoxValue}`;
        break;
      case 'space':
        directive = `parse-as-csv :${column} '' ${checkBoxValue}`;
        break;
      case 'pipe':
        directive = `parse-as-csv :${column} '\\|' ${checkBoxValue}`;
        break;
      case 'capA':
        directive = `parse-as-csv :${column} '\\u0001' ${checkBoxValue}`;
        break;
      case 'capD':
        directive = `parse-as-csv :${column} '\\u0004' ${checkBoxValue}`;
        break;
      case 'customDelimiter':
        directive = `parse-as-csv :${column} '${customInput}' ${checkBoxValue}`;
        break;
    }
    return directive;
  } else if (functionName === 'parseExcel') {
    return `parse-as-excel :${column} '${customInput}' ${checkBoxValue}`;
  } else if (functionName === 'parseJSON') {
    return `parse-as-json :${column} ${customInput}`;
  }
};
