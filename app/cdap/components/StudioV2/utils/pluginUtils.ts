/*
 * Copyright © 2025 Cask Data, Inc.
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

import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';
import { IArtifactSummary, IPlugin } from '../types';

export function getPluginIcon(pluginName: string): string {
  const iconMap = {
    script: 'icon-script',
    scriptfilter: 'icon-scriptfilter',
    twitter: 'icon-twitter',
    cube: 'icon-cube',
    data: 'fa-database',
    database: 'icon-database',
    table: 'icon-table',
    kafka: 'icon-kafka',
    jms: 'icon-jms',
    projection: 'icon-projection',
    amazonsqs: 'icon-amazonsqs',
    datagenerator: 'icon-datagenerator',
    validator: 'icon-validator',
    corevalidator: 'corevalidator',
    logparser: 'icon-logparser',
    file: 'icon-file',
    kvtable: 'icon-kvtable',
    s3: 'icon-s3',
    s3avro: 'icon-s3avro',
    s3parquet: 'icon-s3parquet',
    snapshotavro: 'icon-snapshotavro',
    snapshotparquet: 'icon-snapshotparquet',
    tpfsavro: 'icon-tpfsavro',
    tpfsparquet: 'icon-tpfsparquet',
    sink: 'icon-sink',
    hive: 'icon-hive',
    structuredrecordtogenericrecord: 'icon-structuredrecord',
    cassandra: 'icon-cassandra',
    teradata: 'icon-teradata',
    elasticsearch: 'icon-elasticsearch',
    hbase: 'icon-hbase',
    mongodb: 'icon-mongodb',
    pythonevaluator: 'icon-pythonevaluator',
    csvformatter: 'icon-csvformatter',
    csvparser: 'icon-csvparser',
    clonerecord: 'icon-clonerecord',
    compressor: 'icon-compressor',
    decompressor: 'icon-decompressor',
    encoder: 'icon-encoder',
    decoder: 'icon-decoder',
    jsonformatter: 'icon-jsonformatter',
    jsonparser: 'icon-jsonparser',
    hdfs: 'icon-hdfs',
    hasher: 'icon-hasher',
    javascript: 'icon-javascript',
    deduper: 'icon-deduper',
    distinct: 'icon-distinct',
    naivebayestrainer: 'icon-naivebayestrainer',
    groupbyaggregate: 'icon-groupbyaggregate',
    naivebayesclassifier: 'icon-naivebayesclassifier',
    azureblobstore: 'icon-azureblobstore',
    xmlreader: 'icon-XMLreader',
    xmlparser: 'icon-XMLparser',
    ftp: 'icon-FTP',
    joiner: 'icon-joiner',
    deduplicate: 'icon-deduplicator',
    valuemapper: 'icon-valuemapper',
    rowdenormalizer: 'icon-rowdenormalizer',
    ssh: 'icon-ssh',
    sshaction: 'icon-sshaction',
    copybookreader: 'icon-COBOLcopybookreader',
    excel: 'icon-excelinputsource',
    encryptor: 'icon-Encryptor',
    decryptor: 'icon-Decryptor',
    hdfsfilemoveaction: 'icon-filemoveaction',
    hdfsfilecopyaction: 'icon-filecopyaction',
    sqlaction: 'icon-SQLaction',
    impalahiveaction: 'icon-impalahiveaction',
    email: 'icon-emailaction',
    kinesissink: 'icon-Amazon-Kinesis',
    bigquerysource: 'icon-Big-Query',
    tpfsorc: 'icon-ORC',
    groupby: 'icon-groupby',
    sparkmachinelearning: 'icon-sparkmachinelearning',
    solrsearch: 'icon-solr',
    sparkstreaming: 'icon-sparkstreaming',
    rename: 'icon-rename',
    archive: 'icon-archive',
    wrangler: 'icon-DataPreparation',
    normalize: 'icon-normalize',
    xmlmultiparser: 'icon-XMLmultiparser',
    xmltojson: 'icon-XMLtoJSON',
    decisiontreepredictor: 'icon-decisiontreeanalytics',
    decisiontreetrainer: 'icon-DesicionTree',
    hashingtffeaturegenerator: 'icon-HashingTF',
    ngramtransform: 'icon-NGram',
    tokenizer: 'icon-tokenizeranalytics',
    skipgramfeaturegenerator: 'icon-skipgram',
    skipgramtrainer: 'icon-skipgramtrainer',
    logisticregressionclassifier: 'icon-logisticregressionanalytics',
    logisticregressiontrainer: 'icon-LogisticRegressionclassifier',
    hdfsdelete: 'icon-hdfsdelete',
    hdfsmove: 'icon-hdfsmove',
    windowssharecopy: 'icon-windowssharecopy',
    httppoller: 'icon-httppoller',
    window: 'icon-window',
    run: 'icon-Run',
    oracleexport: 'icon-OracleDump',
    snapshottext: 'icon-SnapshotTextSink',
    errorcollector: 'fa-exclamation-triangle',
    mainframereader: 'icon-MainframeReader',
    fastfilter: 'icon-fastfilter',
    trash: 'icon-TrashSink',
    staterestore: 'icon-Staterestore',
    topn: 'icon-TopN',
    wordcount: 'icon-WordCount',
    datetransform: 'icon-DateTransform',
    sftpcopy: 'icon-FTPcopy',
    sftpdelete: 'icon-FTPdelete',
    validatingxmlconverter: 'icon-XMLvalidator',
    wholefilereader: 'icon-Filereader',
    xmlschemaaction: 'icon-XMLschemagenerator',
    s3toredshift: 'icon-S3toredshift',
    redshifttos3: 'icon-redshifttoS3',
    verticabulkexportaction: 'icon-Verticabulkexport',
    verticabulkimportaction: 'icon-Verticabulkload',
    loadtosnowflake: 'icon-snowflake',
    kudu: 'icon-apachekudu',
    orientdb: 'icon-OrientDB',
    recordsplitter: 'icon-recordsplitter',
    scalasparkprogram: 'icon-spark',
    scalasparkcompute: 'icon-spark',
    cdcdatabase: 'icon-database',
    cdchbase: 'icon-hbase',
    cdckudu: 'icon-apachekudu',
    changetrackingsqlserver: 'icon-database',
    conditional: 'fa-question-circle-o',
  };

  const actualPluginName = pluginName ? pluginName.toLowerCase() : '';
  const icon = iconMap[actualPluginName] ? iconMap[actualPluginName] : 'fa-plug';
  return icon;
}

export function getDefaultVersionForPlugin(
  plugin: IPlugin = {},
  defaultVersionMap: { [key: string]: IArtifactSummary } = {},
) {
  if (Object.keys(plugin).length === 0) {
    return {};
  }

  const defaultVersionsList = Object.keys(defaultVersionMap);
  const key = `${plugin.name}-${plugin.type}-${plugin.artifact.name}`;
  const isDefaultVersionExists = defaultVersionsList.includes(key);
  const isArtifactExistsInBackend = (plugin.allArtifacts || []).filter((plug) =>
    _isEqual(plug.artifact, defaultVersionMap[key])
  );

  if (!isDefaultVersionExists || isArtifactExistsInBackend.length === 0) {
    const highestVersion = findHighestVersion(
      plugin.allArtifacts.map((plugin) => plugin.artifact.version),
      true
    );
    const latestPluginVersion = plugin.allArtifacts.find(
      (plugin) => plugin.artifact.version === highestVersion
    );
    return _get(latestPluginVersion, 'artifact');
  }

  return _cloneDeep(defaultVersionMap[key]);
}
export const getTemplatesWithAddedInfo = (templates = [], extension = '') => templates.map((template) => ({
  ...template,
  nodeClass: 'plugin-templates',
  name: template.pluginTemplate,
  pluginName: template.pluginName,
  type: extension,
  icon: getPluginIcon(template.pluginName),
  allArtifacts: [template.artifact],
}));
