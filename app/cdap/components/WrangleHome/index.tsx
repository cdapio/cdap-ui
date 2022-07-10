import { Box } from '@material-ui/core';
import ConnectorTypesComponent from 'components/ConnectorTypes';
import ConnectionTabsCaller from 'components/Dataset/ConnectionTabsCaller';
import * as React from 'react';

const WrangleHome: React.FC = () => {
  return (
    <Box>
      {/* <ConnectorTypesComponent /> */}
      <ConnectionTabsCaller />
    </Box>
  );
};

export default WrangleHome;
