/*
 * Copyright © 2021 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

export interface ISearchParams {
  namespace: string;
  entityId: string;
  entityType: string;
}

export interface ISearchMetadata {
  properties: IProperty[];
  tags: IProperty[];
}

interface IProperty {
  name: string;
  scope: string;
  value: string;
}

interface IProperties {
  system: { [key: string]: string | string[] };
  user: { [key: string]: string };
  isUserEmpty: boolean;
  isSystemEmpty: boolean;
}

export interface IPropertiesResponse {
  systemTags: string[];
  hasExternalDataset: boolean;
  activePropertyTab: number;
  properties: IProperties;
}

/**
 * Method to parse the API response of metadata properties.
 *
 * @param response - API response.
 * @returns Processed properties response.
 */
export function processProperties(response: ISearchMetadata): IPropertiesResponse {
  const systemProperties = {
    type: '',
  };
  const userProperties = {};
  const processedResponse = {
    systemTags: [],
    hasExternalDataset: false,
    activePropertyTab: 0,
    properties: {
      system: {},
      user: {},
      isUserEmpty: false,
      isSystemEmpty: false,
    },
  };
  response.properties.forEach((property) => {
    if (property.scope === 'SYSTEM') {
      systemProperties[property.name] = property.value;
    } else {
      userProperties[property.name] = property.value;
    }
  });

  processedResponse.systemTags = response.tags
    .filter((tag) => tag.scope === 'SYSTEM')
    .map((tag) => tag.name);

  processedResponse.properties = {
    system: systemProperties,
    user: userProperties,
    isUserEmpty: false,
    isSystemEmpty: false,
  };

  processedResponse.hasExternalDataset = systemProperties.type === 'externalDataset';

  if (Object.keys(userProperties).length === 0) {
    processedResponse.activePropertyTab = 1;
    processedResponse.properties.isUserEmpty = true;
  }

  processedResponse.properties.isSystemEmpty = Object.keys(systemProperties).length === 0;
  return processedResponse;
}
