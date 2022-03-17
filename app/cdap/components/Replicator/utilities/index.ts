/*
 * Copyright © 2020 Cask Data, Inc.
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

import { getCurrentNamespace } from 'services/NamespaceStore';
import { Observable } from 'rxjs/Observable';
import { MyPipelineApi } from 'api/pipeline';
import { MyReplicatorApi } from 'api/replicator';
import { bucketPlugins } from 'services/PluginUtilities';
import { Map, Set, fromJS } from 'immutable';
import {
  ITableObj,
  IColumn,
  DML,
  ITablesStore,
  IColumnsStore,
  IDMLStore,
  ITable,
  ITableImmutable,
  ITableInfo,
} from 'components/Replicator/types';
import { fetchPluginWidget } from 'services/PluginUtilities';
import { ICreateState } from 'components/Replicator/Create';
import { objectQuery, truncateNumber } from 'services/helpers';
import { PluginType } from 'components/Replicator/constants';

// TODO: can more of these functions move & generalize into PluginUtilities without adding complexity?
export function fetchPluginInfo(
  parentArtifact,
  artifactName,
  artifactScope,
  pluginName,
  pluginType
) {
  const pluginParams = {
    namespace: getCurrentNamespace(),
    parentArtifact: parentArtifact.name,
    version: parentArtifact.version,
    extension: pluginType,
    pluginName,
    scope: parentArtifact.scope,
    artifactName,
    artifactScope,
    limit: 1,
    order: 'DESC',
  };

  return MyPipelineApi.getPluginProperties(pluginParams).map(([res]) => {
    return res;
  });
}

export function fetchPluginsAndWidgets(parentArtifact, pluginType) {
  const observable$ = Observable.create((observer) => {
    const params = {
      namespace: getCurrentNamespace(),
      parentArtifact: parentArtifact.name,
      version: parentArtifact.version,
      scope: parentArtifact.scope,
      pluginType,
    };

    MyReplicatorApi.getPlugins(params).subscribe(
      (res) => {
        const pluginsBucket = bucketPlugins(res);

        // convert plugins buckets into array with only latest version
        const plugins = Object.keys(pluginsBucket).map((pluginName) => {
          return pluginsBucket[pluginName][0];
        });

        const widgetRequestBody = plugins.map((plugin) => {
          const propertyKey = `${plugin.name}-${plugin.type}`;
          const pluginReqBody = {
            ...plugin.artifact,
            properties: [`widgets.${propertyKey}`],
          };
          return pluginReqBody;
        });

        MyReplicatorApi.batchGetPluginsWidgets(
          { namespace: getCurrentNamespace() },
          widgetRequestBody
        ).subscribe(
          (widgetRes) => {
            const processedWidgetMap = {};

            widgetRes.forEach((plugin) => {
              Object.keys(plugin.properties).forEach((propertyName) => {
                const pluginKey = propertyName.split('.')[1];

                let widget = {};
                try {
                  widget = JSON.parse(plugin.properties[propertyName]);
                } catch (e) {
                  // tslint:disable-next-line: no-console
                  console.log('Failed to parse widget JSON', e);
                }

                processedWidgetMap[pluginKey] = widget;
              });
            });

            observer.next({
              plugins,
              widgetMap: processedWidgetMap,
            });
            observer.complete();
          },
          (err) => {
            observer.error(err);
          }
        );
      },
      (err) => {
        observer.error(err);
      }
    );
  });

  return observable$;
}

/**
 * Generates a unique column key for each table based on
 * database, schema and table names.
 * @param row
 * @returns {String} unique table string
 */

export function generateTableKey(row) {
  let database = row.database;
  let table = row.table;
  let schema = row.schema;
  if (Map.isMap(row)) {
    database = row.get('database');
    table = row.get('table');
    schema = row.get('schema');
  }

  if (schema) {
    return `db-${database}-schema-${schema}-table-${table}`;
  } else {
    return `db-${database}-table-${table}`;
  }
}

/**
 * Gets the table Info from the immutable table row
 * @param row
 * @returns tableInfo
 */
export const getTableInfoFromImmutable = (row: ITableImmutable): ITableInfo => {
  const database = row.get('database');
  const table = row.get('table');
  const schema = row.get('schema');
  return {
    database,
    table,
    schema,
  };
};

export function constructTablesSelection(tables, columns, dmlBlacklist) {
  if (!tables) {
    return [];
  }

  const tablesArr = [];

  /**
   * {
   *    database,
   *    table
   *    schema
   * }
   */

  tables.toList().forEach((row) => {
    const database = row.get('database');
    const table = row.get('table');

    const tableObj: ITableObj = {
      database,
      table,
    };

    const schemaName = row.get('schema');

    if (schemaName) {
      tableObj.schema = schemaName;
    }

    const tableKey = generateTableKey(tableObj);
    const selectedColumns = columns.get(tableKey);

    if (selectedColumns && selectedColumns.size > 0) {
      const tableColumns = [];
      selectedColumns.forEach((column) => {
        const columnObj: IColumn = {
          name: column.get('name'),
          type: column.get('type'),
        };

        if (column.get('suppressWarning')) {
          columnObj.suppressWarning = true;
        }

        tableColumns.push(columnObj);
      });

      tableObj.columns = tableColumns;
    }

    const tableDML = dmlBlacklist.get(tableKey);
    if (tableDML && tableDML.size > 0) {
      tableObj.dmlBlacklist = tableDML.toArray();
    }

    tablesArr.push(tableObj);
  });

  return tablesArr;
}

export async function convertConfigToState(rawConfig, parentArtifact) {
  const newState: Partial<ICreateState> = {
    loading: false,
    name: rawConfig.label || rawConfig.name || '',
    description: objectQuery(rawConfig, 'config', 'description') || '',
    activeStep: 1,
    offsetBasePath: objectQuery(rawConfig, 'config', 'offsetBasePath') || '',
    numInstances: objectQuery(rawConfig, 'config', 'parallelism', 'numInstances') || 1,
  };

  const stages = objectQuery(rawConfig, 'config', 'stages') || [];

  // SOURCE
  const source = stages.find((stage) => {
    const stageType = objectQuery(stage, 'plugin', 'type');
    return stageType === PluginType.source;
  });

  if (source) {
    const sourceArtifact = objectQuery(source, 'plugin', 'artifact') || {};

    const sourcePluginInfo = await fetchPluginInfo(
      parentArtifact,
      sourceArtifact.name,
      sourceArtifact.scope,
      source.plugin.name,
      source.plugin.type
    ).toPromise();

    newState.sourcePluginInfo = sourcePluginInfo;
    newState.sourceConfig = objectQuery(source, 'plugin', 'properties') || {};

    try {
      const sourcePluginWidget = await fetchPluginWidget(
        sourceArtifact.name,
        sourceArtifact.version,
        sourceArtifact.scope,
        sourcePluginInfo.name,
        sourcePluginInfo.type
      ).toPromise();

      newState.sourcePluginWidget = sourcePluginWidget;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Cannot fetch source plugin widget', e);
      // no-op
    }

    if (Object.keys(newState.sourceConfig).length > 0) {
      newState.activeStep = 2;
    }
  }

  // TABLES & COLUMNS
  const tables = objectQuery(rawConfig, 'config', 'tables');
  if (tables) {
    let selectedTables: ITablesStore = Map();

    let columns: IColumnsStore = Map();
    let dmlBlacklist: IDMLStore = Map();
    tables.forEach((table) => {
      const tableKey = generateTableKey(table);

      const tableInfo: ITable = {
        database: table.database,
        table: table.table,
      };

      if (table.schema) {
        tableInfo.schema = table.schema;
      }

      selectedTables = selectedTables.set(tableKey, fromJS(tableInfo));

      const tableColumns = objectQuery(table, 'columns') || [];
      const columnList = fromJS(tableColumns);

      columns = columns.set(tableKey, columnList);

      const tableDML = objectQuery(table, 'dmlBlacklist') || [];
      dmlBlacklist = dmlBlacklist.set(tableKey, Set<DML>(tableDML));
    });

    newState.tables = selectedTables;
    newState.columns = columns;
    newState.dmlBlacklist = dmlBlacklist;

    if (selectedTables.size > 0) {
      newState.activeStep = 3;
    }
  }

  // TARGET
  const target = stages.find((stage) => {
    const stageType = objectQuery(stage, 'plugin', 'type');
    return stageType === PluginType.target;
  });

  if (target) {
    const targetArtifact = objectQuery(target, 'plugin', 'artifact') || {};

    const targetPluginInfo = await fetchPluginInfo(
      parentArtifact,
      targetArtifact.name,
      targetArtifact.scope,
      target.plugin.name,
      target.plugin.type
    ).toPromise();

    newState.targetPluginInfo = targetPluginInfo;
    newState.targetConfig = objectQuery(target, 'plugin', 'properties') || {};

    try {
      const targetPluginWidget = await fetchPluginWidget(
        targetArtifact.name,
        targetArtifact.version,
        targetArtifact.scope,
        targetPluginInfo.name,
        targetPluginInfo.type
      ).toPromise();

      newState.targetPluginWidget = targetPluginWidget;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Cannot fetch target plugin widget', e);
      // no-op
    }

    if (Object.keys(newState.targetConfig).length > 0) {
      newState.activeStep = 5;
    }
  }

  return newState;
}

export function formatNumber(num, threshold = 999) {
  if (num < threshold) {
    return num;
  }
  const PRECISION = 2;
  return truncateNumber(num, PRECISION);
}

export function getFullyQualifiedTableName(tableInput) {
  let tableInfo = tableInput;
  if (Map.isMap(tableInput)) {
    tableInfo = tableInput.toJS();
  }

  let tableName = tableInfo.database;
  if (tableInfo.schema) {
    tableName = `${tableName}.${tableInfo.schema}`;
  }

  tableName = `${tableName}.${tableInfo.table}`;
  return tableName;
}

export function getTableDisplayName(row) {
  if (!row) {
    return '';
  }

  let table = row.table;
  let schema = row.schema;

  if (Map.isMap(row)) {
    table = row.get('table');
    schema = row.get('schema');
  }

  let displayName = table;
  if (schema) {
    displayName = `${schema}.${displayName}`;
  }

  return displayName;
}

/**
 * Returns detail url for replicator
 * @param name name of the replicator
 * @returns URL
 */
export function createReplicatorDetailUrl(name: string): string {
  return `/ns/${getCurrentNamespace()}/replication/detail/${name}`;
}

/**
 * Identifes the entity as a replicator instance
 * @param metadata metadata about the entity
 * @returns boolean
 */
export function identifyReplicatorEntityFromMetadata(metadata: {
  type?: string;
  program?: string;
}): boolean {
  return metadata.type === 'Worker' && metadata.program === 'DeltaWorker';
}

/**
 * Returns Table, column and error message from table assessment for transformations
 * Message always comes in this format:
 * Failed to apply transformations on the schema for the table : ORDERS and column : PRICE with error : Field name QTY already exists.
 * so we just need to split the string on colons etc.
 * @param string description of the error
 * @returns [table, column, error message]
 */
export function parseErrorMessageForTransformations(message: string) {
  const [_, tablePiece, columnPiece, messagePiece] = message.split(' : ');
  const table = tablePiece.split(' ')[0];
  const column = columnPiece.split(' ')[0];
  const errorMessage = messagePiece;

  return [table, column, errorMessage];
}
