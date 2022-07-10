import { Box } from '@material-ui/core';
import ConnectionContainer from 'components/ConnectionList';
import * as React from 'react';

const WrangleHome: React.FC = () => {
  return (
    <Box>
      <ConnectionContainer />
    </Box>
  );
};

export default WrangleHome;
