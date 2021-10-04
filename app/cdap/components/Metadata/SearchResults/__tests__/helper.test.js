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

import {
    parseResult,
    getMatchedFiltersCount,
    applyFilter,
    METADATA_FILTERS,
    getResultCount,
} from 'components/Metadata/SearchResults/helper';
import { Operations } from 'components/Metadata/SearchResults/Filters';
jest.disableAutomock();

describe("Metadata search helper", () => {
    const entities = [
        {
            entity: {
                details: { namespace: 'default', dataset: 'logs_data_sink' },
                type: 'dataset',
            },
            metadata: {
                properties: [
                    { scope: 'SYSTEM', name: 'creation-time', value: '1631803810545' },
                    { scope: 'SYSTEM', name: 'schema', value: '{"type":"record","name":"etlSchemaBody","fields":[{"name":"body","type":"logs"}]}' },
                    { scope: 'SYSTEM', name: 'type', value: 'externalDataset' },
                    { scope: 'SYSTEM', name: 'entity-name', value: 'logs_data_sink' },
                    { scope: 'SYSTEM', name: 'description', value: 'logs' },
                ],
                tags: [{ scope: 'SYSTEM', name: 'logs' }, { scope: 'USER', name: 'logs' }],
            },
        },
        {
            entity: {
                details: { namespace: 'default', dataset: 'logs_data_source' },
                type: 'dataset',
            },
            metadata: {
                properties: [
                    { scope: 'SYSTEM', name: 'creation-time', value: '1631803807712' },
                    { scope: 'SYSTEM', name: 'schema', value: '{"type":"record","name":"etlSchemaBody","fields":[{"name":"body","type":"string"}]}' },
                    { scope: 'SYSTEM', name: 'type', value: 'externalDataset' },
                    { scope: 'SYSTEM', name: 'entity-name', value: 'logs_data_source' },
                    { scope: 'USER', name: 'entity-name', value: 'logs_data_source' },
                ],
                tags: [{ scope: 'SYSTEM', name: 'batch' }, { scope: 'SYSTEM', name: 'explore' }],
            },
        },
    ];
    const entityFilters = [
        {
            name: 'Datasets',
            isActive: true,
            filter: 'Dataset',
            count: 0,
        },
    ];
    const metadataFilters =
        METADATA_FILTERS.map((name) => ({
            name,
            isActive: true,
            filter: '',
            count: 0,
        }));
    const metaDataFiltersWithCount = [
        {
            name: 'Name',
            isActive: true,
            count: 1,
            filter: '',
        },
        {
            name: 'Description',
            isActive: true,
            count: 0,
            filter: '',
        },
        {
            name: 'User tags',
            isActive: true,
            count: 4,
            filter: '',
        },
        {
            name: 'System tags',
            isActive: false,
            count: 10,
            filter: '',
        },
    ];
    const resultSink = {
        name: 'logs_data_sink',
        type: 'Dataset',
        entityTypeState: 'datasets',
        icon: 'icon-datasets',
        datasetExplorable: false,
        queryFound: [
            "Name",
            "Description",
            "User tags",
            "System tags",
            "System properties",
            "Schema",
        ],
        description: "logs",
        createDate: '1631803810545',
        datasetType: 'externalDataset',
    };
    const resultSource = {
        name: 'logs_data_source',
        type: 'Dataset',
        entityTypeState: 'datasets',
        icon: 'icon-datasets',
        datasetExplorable: true,
        queryFound: [
            "Name",
            "User properties",
            "System properties",
        ],
        description: "features.MetadataSearch.noDescription",
        createDate: '1631803807712',
        datasetType: 'externalDataset',
    };
    const searchResults = [resultSink, resultSource];

    describe("'parseResult' should", () => {
        it('return parsed results and count', () => {
            expect(parseResult('logs', entities, metadataFilters)).toStrictEqual({ results: searchResults, count: 2, });
        });
    });

    describe("'getMatchedFiltersCount' should", () => {
        it('return right filters count', () => {
            expect(getMatchedFiltersCount(metaDataFiltersWithCount)).toBe(3);
        });
    });

    describe("'applyFilter' should", () => {
        it('select all results', () => {
            const filteredResults = {
                entityFilters: entityFilters,
                metadataFilters: [
                    { count: 2, filter: "", isActive: true, name: "Name" },
                    { count: 1, filter: "", isActive: true, name: "Description" },
                    { count: 1, filter: "", isActive: true, name: "User tags" },
                    { count: 1, filter: "", isActive: true, name: "System tags" },
                    { count: 1, filter: "", isActive: true, name: "User properties" },
                    { count: 2, filter: "", isActive: true, name: "System properties" },
                    { count: 1, filter: "", isActive: true, name: "Schema" },
                ],
                results: searchResults,
            };
            expect(applyFilter(Operations.All, {}, true, searchResults, entityFilters, metadataFilters)).toStrictEqual(filteredResults);
        });

        it('select only given filter', () => {
            const filter = { count: 1, filter: "", isActive: true, name: "User properties" };
            const filteredResults = {
                "entityFilters": entityFilters,
                "metadataFilters": [
                    { "count": 2, "filter": "", "isActive": false, "name": "Name" },
                    { "count": 1, "filter": "", "isActive": false, "name": "Description" },
                    { "count": 1, "filter": "", "isActive": false, "name": "User tags" },
                    { "count": 1, "filter": "", "isActive": false, "name": "System tags" },
                    { "count": 1, "filter": "", "isActive": true, "name": "User properties" },
                    { "count": 2, "filter": "", "isActive": false, "name": "System properties" },
                    { "count": 1, "filter": "", "isActive": false, "name": "Schema" },
                ],
                "results": [resultSource],
            };
            expect(applyFilter(Operations.Only, filter, true, searchResults, entityFilters, metadataFilters)).toStrictEqual(filteredResults);
        });

        it('toggle a given filter', () => {
            const filter = { count: 1, filter: "", isActive: true, name: "User properties" };
            const filteredResults = {
                entityFilters: entityFilters,
                metadataFilters: [
                    { count: 2, filter: "", isActive: false, name: "Name" },
                    { count: 1, filter: "", isActive: false, name: "Description" },
                    { count: 1, filter: "", isActive: false, name: "User tags" },
                    { count: 1, filter: "", isActive: false, name: "System tags" },
                    { count: 1, filter: "", isActive: false, name: "User properties" },
                    { count: 2, filter: "", isActive: false, name: "System properties" },
                    { count: 1, filter: "", isActive: false, name: "Schema" },
                ],
                results: [],
            };
            expect(applyFilter(Operations.Toggle, filter, true, searchResults, entityFilters, metadataFilters)).toStrictEqual(filteredResults);

            const toggledResults = {
                entityFilters: entityFilters,
                metadataFilters: [
                    { count: 2, filter: "", isActive: false, name: "Name" },
                    { count: 1, filter: "", isActive: false, name: "Description" },
                    { count: 1, filter: "", isActive: false, name: "User tags" },
                    { count: 1, filter: "", isActive: false, name: "System tags" },
                    { count: 1, filter: "", isActive: true, name: "User properties" },
                    { count: 2, filter: "", isActive: false, name: "System properties" },
                    { count: 1, filter: "", isActive: false, name: "Schema" },
                ],
                results: [resultSource],
            };
            expect(applyFilter(Operations.Toggle, filter, true, searchResults, entityFilters, metadataFilters)).toStrictEqual(toggledResults);
        });
    });

    describe("'getResultCount' should", () => {
        it('handle empty results', () => {
            expect(getResultCount(1, 0, 10)).toBe('0');
        });

        it('show page info for first page', () => {
            expect(getResultCount(1, 45, 10)).toBe('1-10');
        });

        it('show page info for second page', () => {
            expect(getResultCount(2, 45, 10)).toBe('11-20');
        });

        it('show page info for last page', () => {
            expect(getResultCount(5, 45, 10)).toBe('41-45');
        });
    });
});
