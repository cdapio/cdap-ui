import { Box } from '@material-ui/core';
import ConnectorTypesComponent from 'components/ConnectorTypes';
import Dataset from 'components/Dataset';

import * as React from 'react';

const WrangleHome: React.FC = () => {
  return (
    <Box>
      {/* <ConnectorTypesComponent /> */}
      <Dataset />
    </Box>
  );
};

export default WrangleHome;
