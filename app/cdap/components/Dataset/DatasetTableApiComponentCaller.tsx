import React from 'react';
import DatasetTableApiComponent from './DatasetTableApiComponent';

const DatasetTableApiComponentCaller = ({ initialConnectionId }) => {
  console.log(initialConnectionId);
  return (
    <div>
      <DatasetTableApiComponent initialConnectionId={initialConnectionId} />
    </div>
  );
};

export default DatasetTableApiComponentCaller;
