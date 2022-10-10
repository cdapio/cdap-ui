/*
 * Copyright © 2022 Cask Data, Inc.
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
import dagre from 'dagre';

const defaultConnectionStyle = {
  paintStyle: {
    strokeStyle: '#4e5568',
    lineWidth: 2,
    outlineColor: 'transparent',
    outlineWidth: 4,
  },
  hoverPaintStyle: {
    strokeStyle: '#58b7f6',
    lineWidth: 4,
    dashstyle: 'solid',
  },
};

const defaultConnectionStyleSettings = {
  PaintStyle: defaultConnectionStyle.paintStyle,
  HoverPaintStyle: defaultConnectionStyle.hoverPaintStyle,
};

const selectedConnectionStyle = {
  paintStyle: {
    strokeStyle: '#58b7f6',
    lineWidth: 4,
    outlineColor: 'transparent',
    outlineWidth: 4,
    dashstyle: 'solid',
  },
};

const solidConnectionStyle = {
  paintStyle: { dashstyle: 'solid' },
};

const dashedConnectionStyle = {
  paintStyle: { dashstyle: '2 4' },
};

const conditionTrueConnectionStyle = {
  strokeStyle: '#0099ff',
  lineWidth: 2,
  outlineColor: 'transparent',
  outlineWidth: 4,
  dashstyle: '2 4',
};

const conditionTrueEndpointStyle = {
  anchor: 'Right',
  cssClass: 'condition-endpoint condition-endpoint-true',
  isSource: true,
  connectorStyle: conditionTrueConnectionStyle,
  overlays: [
    [
      'Label',
      { label: 'Yes', id: 'yesLabel', location: [0.5, -0.55], cssClass: 'condition-label' },
    ],
  ],
};

const conditionFalseConnectionStyle = {
  strokeStyle: '#999999',
  lineWidth: 2,
  outlineColor: 'transparent',
  outlineWidth: 4,
  dashstyle: '2 4',
};

const conditionFalseEndpointStyle = {
  anchor: [0.5, 1, 0, 1, 2, 0], // same as Bottom but moved right 2px
  cssClass: 'condition-endpoint condition-endpoint-false',
  isSource: true,
  connectorStyle: conditionFalseConnectionStyle,
  overlays: [
    ['Label', { label: 'No', id: 'noLabel', location: [0.5, -0.55], cssClass: 'condition-label' }],
  ],
};

const splitterEndpointStyle = {
  isSource: true,
  // [x, y , dx, dy, offsetx, offsety]
  // x, y - position of the anchor.
  // dx, dy - orientation of the curve incident on the anchor
  // offsetx, offsety - offset for the anchor
  anchor: [0.9, 0.65, 1, 0, 2, 0],
};

const alertEndpointStyle = {
  anchor: [0.5, 1, 0, 1, 2, 0], // same as Bottom but moved right 2px
  scope: 'alertScope',
};

const errorEndpointStyle = {
  anchor: [0.5, 1, 0, 1, 3, 0], // same as Bottom but moved right 3px
  scope: 'errorScope',
};

const targetNodeOptions = {
  isTarget: true,
  dropOptions: { hoverClass: 'drag-hover' },
  anchor: 'ContinuousLeft',
  allowLoopback: false,
};

const defaultDagSettings = {
  ...defaultConnectionStyleSettings,
  Anchor: [1, 0.5, 1, 0, 0, 2], // same as Right but moved down 2px
  Endpoint: 'Dot',
  EndpointStyle: { radius: 10 },
  MaxConnections: -1,
  Connector: [
    'Flowchart',
    { stub: [10, 15], alwaysRespectStubs: true, cornerRadius: 20, midpoint: 0.2 },
  ],
  ConnectionOverlays: [
    [
      'Arrow',
      {
        location: 1,
        id: 'arrow',
        length: 14,
        foldback: 0.8,
      },
    ],
  ],
  Container: 'dag-container',
};

export function getSettings() {
  return {
    defaultDagSettings,
    defaultConnectionStyle,
    selectedConnectionStyle,
    conditionTrueConnectionStyle,
    conditionTrueEndpointStyle,
    conditionFalseConnectionStyle,
    conditionFalseEndpointStyle,
    splitterEndpointStyle,
    alertEndpointStyle,
    errorEndpointStyle,
    dashedConnectionStyle,
    solidConnectionStyle,
    targetNodeOptions,
  };
}

export function getIcon(plugin) {
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

  const pluginName = plugin ? plugin.toLowerCase() : '';
  const icon = iconMap[pluginName] ? iconMap[pluginName] : 'fa-plug';
  return icon;
}

export function getNodesMap(nodes) {
  const nodesMap = {};
  nodes.forEach((node) => {
    nodesMap[node.name] = node;
  });
  return nodesMap;
}

function customGraphLayout(graph, nodes, connections) {
  const graphNodes = graph._nodes;
  const nodesMap = getNodesMap(nodes);

  nodes.forEach((node) => {
    const location = graphNodes[node.name];
    let locationX = location.x;
    let locationY = location.y;

    if (node.type === 'alertpublisher' || node.type === 'errortransform') {
      const connToThisNode = connections.find((conn) => conn.to === node.name);
      if (connToThisNode) {
        const sourceNode = connToThisNode.from;
        let nonErrorsAlertsConnCount = 0;
        for (let i = 0; i < connections.length; i++) {
          const conn = connections[i];
          if (conn.from === sourceNode) {
            const targetNode = nodesMap[conn.to];
            if (targetNode.type !== 'alertpublisher' && targetNode.type !== 'errortransform') {
              nonErrorsAlertsConnCount += 1;
              if (nonErrorsAlertsConnCount > 1) {
                break;
              }
            }
          }
        }

        // If the node connecting to this alert publisher/error transform node only has connections
        // to these types of nodes, then have to push the alert publisher/error transform down a bit more
        if (nonErrorsAlertsConnCount === 0) {
          locationY += 200;

          // Else if there's one non error or alert connection then push down a little bit.
          // Don't have to push down if there are 2 or more non error alert connections, since
          // the error and alert nodes will be pushed down automatically by dagre.
        } else if (nonErrorsAlertsConnCount === 1) {
          locationY += 70;
        }

        locationX -= 150;
      }
    }

    graph._nodes[node.name].x = locationX;
    graph._nodes[node.name].y = locationY;
  });
}

export function getGraphLayout(nodes, connections, separation, rankingAlgo = 'network-simplex') {
  const rankSeparation = separation || 200;

  const graph = new dagre.graphlib.Graph();
  graph.setGraph({
    nodesep: 90,
    ranksep: rankSeparation,
    rankdir: 'LR',
    marginx: 0,
    marginy: 0,
    ranker: rankingAlgo,
  });
  graph.setDefaultEdgeLabel(() => {
    return {};
  });

  nodes.forEach((node) => {
    const id = node.name || node.id;

    if (!graph.node(id)) {
      graph.setNode(id, { label: node.label, width: 100, height: 100 });
    }

    if (node.type === 'errortransform' || node.type === 'alertpublisher') {
      const connectionsToAlertOrError = connections.filter((conn) => conn.to === id);
      // If a node is connected to an alert publisher or error collector, then need to
      // increase the width and height here, to not make connections look screwed up
      connectionsToAlertOrError.forEach((conn) => {
        const fromNode = conn.from;
        if (graph.node(fromNode)) {
          graph.node(fromNode).width = 300;
          graph.node(fromNode).height += 250;
        } else {
          graph.setNode(fromNode, { label: fromNode, width: 300, height: 350 });
        }
      });
    }
  });

  connections.forEach((connection) => {
    if (connection.port) {
      graph.setEdge(connection.from, connection.to, { minlen: 1.5 });
    } else {
      graph.setEdge(connection.from, connection.to);
    }
  });

  dagre.layout(graph);
  customGraphLayout(graph, nodes, connections);
  return graph;
}
