export const prepareDataQualtiy = (statistics, columnList) => {
  const dataQualityToArray = Object.entries(statistics);
  const dataQuality = [];
  columnList.map((columnName) => {
    dataQualityToArray.forEach(([key, value]) => {
      if (columnName.name == key) {
        const generalValues = Object.entries(value);
        generalValues.forEach(([vKey, vValue]) => {
          if (vKey == 'general') {
            if (vValue.null) {
              const nullCount = vValue.null || 0;
              const totalNullEmpty = nullCount;
              dataQuality.push({
                label: key,
                value: totalNullEmpty,
              });
            } else {
              dataQuality.push({
                label: key,
                value: 0,
              });
            }
          }
        });
      }
    });
  });
  return dataQuality;
};
