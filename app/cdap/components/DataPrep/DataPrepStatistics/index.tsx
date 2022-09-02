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
import { useSelector } from 'react-redux';
import T from 'i18n-react';
import { Paper, Grid, Snackbar, Alert, AlertTitle } from '@mui/material';
import DataPrepStore from 'components/DataPrep/store';
import DataType from 'components/DataPrep/DataPrepTable/DataType';
import uuidV4 from 'uuid/v4';
import DataPrepChart from './DataPrepCharts';
import DataPrepInfo from './DataPrepInfo';
import { Provider } from 'react-redux';
require('./DataPrepStatistics.scss');
const PREFIX = 'features.DataPrep.DataPrepStatistics';

function DataPrepStatisticsContent() {
  const [showSnackbar, setShowSnackbar] = useState(true);
  const data = useSelector((state) =>
    state.dataprep.data.map((d, i) => Object.assign({}, d, { uniqueId: uuidV4(), scrollId: i }))
  );
  const dataPrep = DataPrepStore.getState().dataprep;
  const headers = dataPrep.headers;
  const types = dataPrep.types;

  const renderCards = () => {
    return (
      <Grid container spacing={3} justifyContent="space-evenly" alignItems="flex-start">
        {headers.map((name) => {
          return (
            <Grid item xs="auto" key={name}>
              <Paper elevation={5}>
                <DataPrepChart fieldName={name} dataType={types && types[name]} values={data} />
                <DataType columnName={name} />
                <div className="header-text-wrapper">
                  <span className="header-text">{name}</span>
                </div>
                <DataPrepInfo fieldName={name} dataType={types && types[name]} values={data} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <div className="dataprep-statistics">
      {renderCards()}
      <Snackbar open={showSnackbar} onClose={() => setShowSnackbar(false)}>
        <Alert severity="warning" onClose={() => setShowSnackbar(false)}>
          <AlertTitle>{T.translate(`${PREFIX}.warningTitle`)}</AlertTitle>
          {T.translate(`${PREFIX}.warning`, { numRows: data.length })}
        </Alert>
      </Snackbar>
    </div>
  );
}

const DataPrepStatistics = () => {
  return (
    <Provider store={DataPrepStore}>
      <DataPrepStatisticsContent />
    </Provider>
  );
};

export default DataPrepStatistics;
