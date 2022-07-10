import React from 'react';
import GridHeaderCell from './GridHeaderCell';
import Box from '@material-ui/core/Box';
import GridKPICell from './GridKPICell';
import GridTextCell from './GridTextCell';
import BasicTable from './DataTable';

const GridView = () => {
  return (
    <Box>
      <GridHeaderCell />
      <GridKPICell />
      <GridTextCell />
      <BasicTable />
    </Box>
  );
};

export default GridView;
