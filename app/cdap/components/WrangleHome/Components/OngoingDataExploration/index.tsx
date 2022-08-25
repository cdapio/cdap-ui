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

import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core/';
import { generateDataForExplorationCard } from './utils';
import MyDataPrepApi from 'api/dataprep';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import OngoingDataExplorationCard from '../OngoingDataExplorationCard';

const OngoingDataExploration = (props) => {
  const [ongoingExpDatas, setOngoingExpDatas] = useState<any>([]);
  const [finalArray, setFinalArray] = useState([]);

  const getOngoingData = () => {
    MyDataPrepApi.getWorkspaceList({
      context: 'default',
    }).subscribe((res) => {
      res.values.forEach((item) => {
        const params = {
          context: 'default',
          workspaceId: item.workspaceId,
        };
        const requestBody = {
          directives: item.directives,
          limit: 1000,
          insights: {
            name: item.name,
            workspaceName: item.workspaceName,
            path: item?.sampleSpec?.path,
            visualization: {},
          },
        };

        MyDataPrepApi.execute(params, requestBody).subscribe((response) => {
          let dataQuality = 0;
          response.headers.forEach((head) => {
            const general = response.summary.statistics[head].general;
            const { empty: empty = 0, 'non-null': nonEmpty = 100 } = general;
            const nonNull = Math.floor((nonEmpty - empty) * 10) / 10;
            dataQuality = dataQuality + nonNull;
          });

          const totalDataQuality = dataQuality / response.headers.length;

          setOngoingExpDatas((current) => [
            ...current,
            {
              connectionName:
                item?.sampleSpec?.connectionName === undefined
                  ? 'Upload'
                  : item?.sampleSpec?.connectionName,
              workspaceName: item.workspaceName,
              recipeSteps: item.directives.length,
              dataQuality: totalDataQuality,
            },
          ]);
        });
      });
    });
    props.toggleLoader;
  };

  useEffect(() => {
    getOngoingData();
  }, []);

  useEffect(() => {
    const final = generateDataForExplorationCard(ongoingExpDatas);
    setFinalArray(final);
    props.toggleLoader;
  }, [ongoingExpDatas]);

  return (
    <Box data-testid="ongoing-data-explore-parent">
      {finalArray.map((item, index) => {
        return (
          <Link
            to={`/ns/${getCurrentNamespace()}/wrangler-grid/:${`${'testDataset'}`}`}
            style={{ textDecoration: 'none' }}
          >
            {index <= 2 && <OngoingDataExplorationCard item={item} />}
          </Link>
        );
      })}
    </Box>
  );
};
export default OngoingDataExploration;
