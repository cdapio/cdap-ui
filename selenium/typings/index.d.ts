export interface INodeInfo {
  nodeName: string;
  nodeType: string;
}

export interface INodeIdentifier extends INodeInfo {
  nodeId: string;
}

export interface IgetNodeIDOptions {
  [key: string]: any
}

