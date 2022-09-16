import React from 'react';

export interface IConnectorArray {
  name: string;
  type: string;
  category: string;
  description: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
  SVG: JSX.Element;
}

export interface IConnectorDetailPayloadArray {
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

export interface IPluginProperties {
  [key: string]: [];
}
