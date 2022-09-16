export const parseDirective = (
  functionName,
  column,
  radioOption,
  inputValue,
  booleanValue,
  columnWidth?,
  optionPadding?
) => {
  let directive;
  if (functionName === 'parseCSV') {
    switch (radioOption) {
      case 'comma':
        directive = `parse-as-csv :${column} ',' ${booleanValue}`;
        break;
      case 'tab':
        directive = `parse-as-csv :${column} '\\t' ${booleanValue}`;
        break;
      case 'space':
        directive = `parse-as-csv :${column} '' ${booleanValue}`;
        break;
      case 'pipe':
        directive = `parse-as-csv :${column} '\\|' ${booleanValue}`;
        break;
      case 'capA':
        directive = `parse-as-csv :${column} '\\u0001' ${booleanValue}`;
        break;
      case 'capD':
        directive = `parse-as-csv :${column} '\\u0004' ${booleanValue}`;
        break;
      case 'customDelimiter':
        directive = `parse-as-csv :${column} '${inputValue}' ${booleanValue}`;
        break;
    }
    return directive;
  } else if (functionName === 'parseExcel') {
    return `parse-as-excel :${column} '${inputValue}' ${booleanValue}`;
  } else if (functionName === 'parseJSON') {
    return `parse-as-json :${column} ${inputValue}`;
  } else if (functionName === 'parseXML') {
    return `parse-xml-to-json :${column} ${inputValue}`;
  } else if (functionName === 'parseLog') {
    if (radioOption === 'custom') {
      return `parse-as-log :${column} '${inputValue}'`;
    } else {
      return `parse-as-log :${column} '${radioOption}'`;
    }
  } else if (functionName === 'parseSimpleDate') {
    if (radioOption === 'customFormat') {
      return `parse-as-simple-date  :${column} ${inputValue}`;
    } else {
      return `parse-as-simple-date  :${column} ${radioOption}`;
    }
  } else if (functionName === 'parseDateTime') {
    if (radioOption === 'customFormat') {
      return `parse-as-datetime  :${column} \"${inputValue}\"`;
    } else {
      return `parse-as-datetime  :${column} \"${radioOption}\"`;
    }
  } else if (functionName === 'parseFixedLength') {
    return `parse-as-fixed-length :${column} ${columnWidth} ${optionPadding}`;
  }
};
