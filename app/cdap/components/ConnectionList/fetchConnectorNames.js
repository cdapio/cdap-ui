import { fetchConnectors } from '../Connections/Create/reducer';

export const getConnectorNames = async () => {
  let connectorsData = [];
  let connectorNames = [];
  connectorsData = await fetchConnectors();

  connectorNames = connectorsData.map((connector) => connector.name);
  return connectorNames;
};
