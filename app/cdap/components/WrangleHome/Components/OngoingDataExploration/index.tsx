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

import { Box } from '@material-ui/core/';
import MyDataPrepApi from 'api/dataprep';
import { IResponseData } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import { generateDataForExplorationCard } from 'components/WrangleHome/Components/OngoingDataExploration/utils';
import OngoingDataExplorationCard from 'components/WrangleHome/Components/OngoingDataExplorationCard';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { switchMap } from 'rxjs/operators';
import { getCurrentNamespace } from 'services/NamespaceStore';

export default function OngoingDataExploration() {
  const [ongoingExpDatas, setOngoingExpDatas] = useState([]);
  const [finalArray, setFinalArray] = useState([]);

  const getOngoingData = () => {
    // Getting the workspace name, path ,workspaceId and name from MyDataPrepApi.getWorkspaceList API and
    //  using these in params and requestBody to get Data quality from MyDataPrepApi.execute API
    MyDataPrepApi.getWorkspaceList({
      context: 'default',
    })
      .pipe(
        switchMap((res: IResponseData) => {
          const workspaces = res.values.map((item) => {
            const params = {
              context: 'default',
              workspaceId: item.workspaceId,
            };
            const requestBody = {
              directives: item.directives,
              limit: 1000,
              insights: {
                name: item.sampleSpec.connectionName,
                workspaceName: item.workspaceName,
                path: item?.sampleSpec?.path,
                visualization: {},
              },
            };

            setOngoingExpDatas((current) => [
              ...current,
              {
                connectionName:
                  item?.sampleSpec?.connectionName === undefined
                    ? 'Upload'
                    : item?.sampleSpec?.connectionName,
                workspaceName: item.workspaceName,
                recipeSteps: item.directives.length,
                dataQuality: null,
                workspaceId: item.workspaceId,
              },
            ]);
            return MyDataPrepApi.execute(params, requestBody);
          });
          return forkJoin(workspaces);
        })
      )
      .subscribe((responses) => {
        responses.forEach((workspace, index) => {
          let dataQuality = 0;
          workspace.headers.forEach((element) => {
            const general = workspace.summary.statistics[element].general;
            const { empty: empty = 0, 'non-null': nonEmpty = 100 } = general;
            const nonNull = Math.floor((nonEmpty - empty) * 10) / 10;
            dataQuality = dataQuality + nonNull;
          });
          const totalDataQuality = dataQuality / workspace.headers.length;
          setOngoingExpDatas((current) => [
            ...current.slice(0, index),
            {
              ...current[index],
              dataQuality: totalDataQuality,
            },
            ...current.slice(index + 1),
          ]);
        });
      });
  };

  useEffect(() => {
    getOngoingData();
  }, []);

  useEffect(() => {
    const final = generateDataForExplorationCard(ongoingExpDatas);
    setFinalArray(final);
  }, [ongoingExpDatas]);

  return (
    <Box data-testid="ongoing-data-explore-parent">
      {finalArray.map((item, index) => {
        return (
          <Link
            to={{
              pathname: `/ns/${getCurrentNamespace()}/wrangler-grid/${`${item[4].workspaceId}`}`,
              state: {
                from: T.translate('features.WranglerNewUI.Breadcrumb.labels.wrangleHome'),
                path: T.translate('features.WranglerNewUI.Breadcrumb.params.wrangeHome'),
              },
            }}
            style={{ textDecoration: 'none' }}
          >
            {index <= 1 && <OngoingDataExplorationCard item={item} index={index} />}
          </Link>
        );
      })}
    </Box>
  );
}
