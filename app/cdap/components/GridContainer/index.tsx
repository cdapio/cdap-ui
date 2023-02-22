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

import React, { useState } from 'react';
import { connect, Provider } from 'react-redux';
import DataPrepStore from 'components/DataPrep/store';
import { execute } from 'components/DataPrep/store/DataPrepActionCreator';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import GridTable from 'components/GridTable';
import { DATATYPE_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/datatypeOptions';

function GridContainerComponent({ storeData }) {
  const [transformationPayload, setTransformationPayload] = useState<
    Record<string, string | boolean>
  >({
    function: false,
    column: false,
  }); // whether i should apply transformation now or should pass data to add transformation step

  const handleTransformationUpload = (valueToUpdate: string, newValue) => {
    // valueToUpdate; // 'function', 'column'

    setTransformationPayload((prev) => ({
      function: valueToUpdate === 'function' ? newValue : prev.function,
      column: valueToUpdate === 'column' ? newValue : prev.column,
    }));

    // check if both function and column are selected
    if (
      (valueToUpdate == 'function' && transformationPayload.column) ||
      (valueToUpdate == 'column' && transformationPayload.function)
    ) {
      // if yes, then do applyDirective
      const directive = getDirective(newValue.option, transformationPayload.column);
      // addDirectives()
      execute([directive]).subscribe(
        () => {},
        (error) => {
          DataPrepStore.dispatch({
            type: DataPrepActions.setError,
            payload: {
              message: error.message || error.response.message,
            },
          });
        }
      );
    }
    // if no then return, do nothing
  };

  const getDirective = (functionName: string, selectedColumnName: string | boolean) => {
    if (DATATYPE_OPTIONS.some((eachOption) => eachOption.value === functionName)) {
      return `set-type :${selectedColumnName} ${functionName}`;
    }
  };

  return (
    <Provider store={DataPrepStore}>
      <GridTable handleTransformationUpload={handleTransformationUpload} storeData={storeData} />
    </Provider>
  );
}

const ConnectedGridContainer = connect((state) => ({ storeData: state }))(GridContainerComponent);

export default function GridContainer() {
  return (
    <Provider store={DataPrepStore}>
      <ConnectedGridContainer />
    </Provider>
  );
}
