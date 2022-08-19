import { ImportDatasetIcon } from '../WrangleCard/iconStore/ImportDatasetIcon';

export const updatedData = (olddata: any) => {
  const parentarr = [];

  if (olddata && Array.isArray(olddata) && olddata.length) {
    olddata.forEach((eachItem: any) => {
      const childarr = [];

      Object.keys(eachItem).map((keys) => {
        const obj = {} as any;

        if (keys === 'connectionName') {
          obj.icon = ImportDatasetIcon;
          obj.label = eachItem[keys];
          obj.type = 'iconWithText';
        } else if (keys === 'workspaceName') {
          obj.label = eachItem[keys];
          obj.type = 'text';
        } else if (keys === 'recipeSteps') {
          obj.label = `${eachItem[keys]} Recipe steps`;
          obj.type = 'text';
        } else if (keys === 'dataQuality') {
          obj.label = parseInt(eachItem[keys]);
          obj.percentageSymbol = '%';
          obj.subText = 'Data Quality';
          obj.type = 'percentageWithText';
        }
        childarr.push(obj);
      });

      parentarr.push(childarr);
    });
  }

  return parentarr;
};
