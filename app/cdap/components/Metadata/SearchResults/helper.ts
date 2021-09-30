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

import intersection from 'lodash/intersection';
import { IFilterItem, Operations } from 'components/Metadata/SearchResults/Filters';
import T from 'i18n-react';
import { objectQuery } from 'services/helpers';

const I18N_PREFIX = 'features.MetadataSearch';

interface ISearchEntityDetails {
  namespace: string;
  dataset: string;
}

interface ISearchEntity {
  details: ISearchEntityDetails;
  type: string;
}

interface ISearchMetadata {
  properties: IProperty[];
  tags: IProperty[];
}

export interface ISearchResponse {
  entity: ISearchEntity;
  metadata: ISearchMetadata;
}

export interface ISearchResult {
  name: string;
  type: string;
  entityTypeState: string;
  icon: string;
  datasetExplorable: boolean;
  queryFound: string[];
  description: string;
  createDate: string;
  datasetType: string;
}

export interface IParsedResult {
  results: ISearchResult[];
  count: number;
}

interface IProperty {
  name: string;
  scope: string;
  value: string;
}

export const METADATA_FILTERS = [
  'Name',
  'Description',
  'User tags',
  'System tags',
  'User properties',
  'System properties',
  'Schema',
];

/**
 * Method to parse the API response and categorize them based on metadata filters.
 *
 * @param searchQuery - Search query
 * @param entities - Search API response for given search query.
 * @param metadataFiltersList - Metadata filters list.
 * @returns Parsed search results and entity filter count.
 */
export function parseResult(
  searchQuery: string,
  entities: ISearchResponse[],
  metadataFiltersList: IFilterItem[]
): IParsedResult {
  let count = 0;
  // Removing special characters from search query
  const replaceRegex = new RegExp('[^a-zA-Z0-9_-]', 'g');
  const searchTerm = searchQuery.replace(replaceRegex, '');
  const regex = new RegExp(searchTerm, 'ig');
  const results = entities.map((entityObj) => {
    const result = {
      name: objectQuery(entityObj, 'entity', 'details', 'dataset') || '-',
      type: 'Dataset',
      entityTypeState: 'datasets',
      icon: 'icon-datasets',
      datasetExplorable: false,
      queryFound: [],
      description: T.translate(`${I18N_PREFIX}.noDescription`),
      createDate: null,
      datasetType: null,
    };
    entityObj.metadata.properties.forEach((property: IProperty) => {
      switch (property.name) {
        case 'description':
          result.description = property.value;
          break;
        case 'creation-time':
          result.createDate = property.value;
          break;
        case 'type':
          result.datasetType = property.value;
          break;
      }
    });
    if (
      entityObj.metadata.tags.find(
        (tag: IProperty) => tag.name === 'explore' && tag.scope === 'SYSTEM'
      )
    ) {
      result.datasetExplorable = true;
    }
    result.queryFound = findQueries(regex, entityObj, result as ISearchResult, metadataFiltersList);
    count += 1;
    return result as ISearchResult;
  });
  return { results, count };
}

function convertToObject(arr: [{ name: string; value: string }]) {
  const returnObj = {};
  arr.forEach((pair) => {
    returnObj[pair.name] = pair.value;
  });
  return returnObj;
}

function findQueries(
  regex: RegExp,
  entityObj,
  parsedEntity: ISearchResult,
  metadataFiltersList: IFilterItem[]
) {
  const foundIn = [];

  // Name
  if (parsedEntity.name.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[0]);
    metadataFiltersList[0].count++;
  }

  // Description
  const description = entityObj.metadata.properties.find(
    (property: IProperty) => property.name === 'description' && property.scope === 'SYSTEM'
  );
  if (description && description.value.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[1]);
    metadataFiltersList[1].count++;
  }

  // Tags
  let userTags = entityObj.metadata.tags
    .filter((tag: IProperty) => tag.scope === 'USER')
    .map((tag: IProperty) => tag.name);
  userTags = userTags.toString();
  let systemTags = entityObj.metadata.tags
    .filter((tag: IProperty) => tag.scope === 'SYSTEM')
    .map((tag: IProperty) => tag.name);
  systemTags = systemTags.toString();

  if (userTags.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[2]);
    metadataFiltersList[2].count++;
  }
  if (systemTags.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[3]);
    metadataFiltersList[3].count++;
  }

  // Properties
  let userProperties = entityObj.metadata.properties.filter(
    (property: IProperty) => property.scope === 'USER'
  );
  userProperties = JSON.stringify(convertToObject(userProperties));
  let systemProperties = entityObj.metadata.properties.filter(
    (property: IProperty) => property.scope === 'SYSTEM' && property.name !== 'schema'
  );
  systemProperties = JSON.stringify(convertToObject(systemProperties));
  if (userProperties.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[4]);
    metadataFiltersList[4].count++;
  }
  if (systemProperties.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[5]);
    metadataFiltersList[5].count++;
  }

  // Schema
  const schema = entityObj.metadata.properties.find(
    (property: IProperty) => property.name === 'schema' && property.scope === 'SYSTEM'
  );
  if (schema && schema.value.search(regex) > -1) {
    foundIn.push(METADATA_FILTERS[6]);
    metadataFiltersList[6].count++;
  }

  return foundIn;
}

function filterResults(
  fullResults: ISearchResult[],
  entityFilters: IFilterItem[],
  metadataFilters: IFilterItem[]
) {
  const filter = [];
  entityFilters.forEach((entity) => {
    if (entity.isActive) {
      filter.push(entity.filter);
    }
  });

  const entitySearchResults = fullResults.filter((result) => {
    return filter.indexOf(result.type) > -1 ? true : false;
  });

  const metadataFilter = [];
  metadataFilters.forEach((metadata) => {
    if (metadata.isActive) {
      metadataFilter.push(metadata.name);
    }
  });

  return entitySearchResults.filter((result) => {
    if (result.queryFound.length === 0) {
      return true;
    }
    return intersection(metadataFilter, result.queryFound).length > 0;
  });
}

/**
 * Method to filter out the search results based on given metadata filter.
 *
 * @param operation - Filter operations 'all', 'only' & 'toggle'.
 * @param filter - Filter to 'toggle' or apply 'only'.
 * @param isMetadata - Flag to filter based on metadata or entity.
 * @param results - Full set of search results.
 * @param entityFilters - Entity filters.
 * @param metadataFilters - Metadata filters.
 * @returns Filtered search results.
 */
export function applyFilter(
  operation: Operations,
  filter: IFilterItem,
  isMetadata: boolean,
  results: ISearchResult[],
  entityFilters: IFilterItem[],
  metadataFilters: IFilterItem[]
) {
  const filterObj = isMetadata ? metadataFilters : entityFilters;
  switch (operation) {
    case Operations.All:
      filterObj.forEach((entity) => {
        entity.isActive = true;
      });
      break;
    case Operations.Only:
      filterObj.forEach((entity) => {
        entity.isActive = entity.name === filter.name;
      });
      break;
    case Operations.Toggle:
      const entityToToggle = filterObj.find((entity) => entity.name === filter.name);
      entityToToggle.isActive = !entityToToggle.isActive;
      break;
    default:
  }
  return {
    results: filterResults(results, entityFilters, metadataFilters),
    entityFilters,
    metadataFilters,
  };
}

/**
 * Method to get pagination information based on given current page number, size and total pages.
 *
 * @param currentPage - Current page number.
 * @param total - Total number of pages.
 * @param pageSize - Page size.
 * @returns Pagination start and end numbers.
 */
export function getResultCount(currentPage: number, total: number, pageSize: number) {
  const lowerLimit = (currentPage - 1) * pageSize + 1;
  let upperLimit = (currentPage - 1) * pageSize + pageSize;
  upperLimit = upperLimit > total ? total : upperLimit;
  return total === 0 ? '0' : `${lowerLimit}-${upperLimit}`;
}

/**
 * Method to get count of metadata filters which has results.
 *
 * @param metadataFiltersList - Metadata filters list.
 * @returns Filters count.
 */
export function getMatchedFiltersCount(metadataFiltersList: IFilterItem[]) {
  return metadataFiltersList.reduce((total, metadata) => (metadata.count > 0 ? ++total : total), 0);
}
