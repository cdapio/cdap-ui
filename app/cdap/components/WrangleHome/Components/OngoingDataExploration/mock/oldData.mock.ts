import { ImportDatasetIcon } from '../../WrangleCard/iconStore/ImportDatasetIcon';

export const arg = [
  {
    connectionName: 'postgres1',
    workspaceName: 'sql_implementation_info',
    recipeSteps: 0,
    dataQuality: 63.32000000000001,
    workspaceId: '0cbc0f7b-c554-4bbb-ad3a-74fe147dfe3b',
  },
];

export const result = [
  [
    {
      icon: ImportDatasetIcon,
      label: 'postgres1',
      type: 'iconWithText',
    },
    {
      label: 'sql_implementation_info',
      type: 'text',
    },
    {
      label: '0 Recipe steps',
      type: 'text',
    },
    {
      label: 63,
      percentageSymbol: '%',
      subText: 'Data Quality',
      type: 'percentageWithText',
    },
    {
      workspaceId: '0cbc0f7b-c554-4bbb-ad3a-74fe147dfe3b',
    },
  ],
];
