// import React from 'react';
import { fetchConnectors } from '../Connections/Create/reducer';

// const Test = () => {
//   const init = async () => {
//     const connectorTypes = await fetchConnectors();
//     // tslint:disable-next-line: no-console
//     console.log(connectorTypes);
//   };
//   init();
//   return <div>Test</div>;
// };

// export default Test;
import React from 'react';

export const ApiTest = () => {
  const init = async () => {
    const connectorTypes = await fetchConnectors();
    // tslint:disable-next-line: no-console
    console.log(connectorTypes);
  };
  init();
  return <div>Test</div>;
};
