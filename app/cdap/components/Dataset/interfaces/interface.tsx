export interface IConnectorTypes {
  name: string;
  type: string;
  category: string;
  description: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
}
export interface ConnectionTabSidePanel {
  connectorTypes: IConnectorTypes[];
  //  mapOfConnectorPluginProperties: { [key: string]: any };
}

export interface Idata {
  type: string;
  canSample: boolean;
  canBrowse: boolean;
  name: string;
  properties: {
    group: { value: string; type: string };
    lastModified: { value: string; type: string };
    owner: { value: string; type: string };
    permission: { value: string; type: string };
  };
  path: string;
}
