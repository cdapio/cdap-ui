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

import { MyPipelineApi } from 'api/pipeline';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import React, { useEffect, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';
import T from 'i18n-react';
import { PipelineHistoryTable } from './PipelineHistoryTable';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PaginationStepper from 'components/shared/PaginationStepper';
import { Provider, useSelector } from 'react-redux';
import Store, {
  nextPage,
  prevPage,
  reset,
  setPageLimit,
  setVersions,
} from './PipelineHistoryStore';
import SelectWithOptions from 'components/shared/SelectWithOptions';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel/LoadingAppLevel';

const PREFIX = 'features.PipelineHistory';

interface IPipelineHistoryProps {
  isOpen: boolean;
  toggle: () => void;
  anchorEl: any;
  pipelineName: string;
}

const QUERY = gql`
  query Query($namespace: String, $pageSize: Int, $token: String, $nameFilter: String) {
    pipelines(
      namespace: $namespace
      pageSize: $pageSize
      pageToken: $token
      nameFilter: $nameFilter
    ) {
      applications {
        name
        version
        artifact {
          name
        }
        runs {
          status
          starting
        }
        totalRuns
        nextRuntime {
          id
          time
        }
      }
      nextPageToken
    }
  }
`;

const PaginationContainer = styled.div`
  margin-right: 20px;
  display: block;
  div {
    display: inline-block;
    margin-right: 10px;
  }
`;

const PipelineHistory = ({ isOpen, toggle, anchorEl, pipelineName }: IPipelineHistoryProps) => {
  const { ready, pageToken, pageLimit, pipelineVersions } = useSelector(({ versions }) => versions);
  const [isRestoreLoading, setIsRestoreLoading] = useState(false);

  const { loading, error, data, refetch, networkStatus } = useQuery(QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      nameFilter: pipelineName || undefined,
      token: pageToken || undefined,
      pageSize: pageLimit,
      namespace: getCurrentNamespace(),
    },
  });

  const Pagination = ({}) => {
    const { prevDisabled, nextDisabled, pageLimit, pageCount, pageIndex } = useSelector(
      ({ versions }) => ({
        prevDisabled: !versions.previousTokens.length,
        nextDisabled: !versions.nextPageToken,
        pageLimit: versions.pageLimit,
        pageCount: versions.pipelineVersions.length,
        pageIndex: versions.previousTokens.length,
      })
    );

    const onChange = (e) => {
      setPageLimit(e.target.value);
    };

    return (
      <PaginationContainer className="float-right">
        <div>Rows per page: </div>
        <div>
          <SelectWithOptions value={pageLimit} onChange={onChange} options={[4, 5, 6, 7, 8, 9]} />
        </div>
        <div>{`${pageIndex * pageLimit + 1} - ${pageIndex * pageLimit + pageCount}`}</div>
        <div>
          <PaginationStepper
            onNext={nextPage}
            onPrev={prevPage}
            nextDisabled={nextDisabled}
            prevDisabled={prevDisabled}
          />
        </div>
      </PaginationContainer>
    );
  };

  useEffect(() => {
    if (loading || networkStatus === 4) {
      return;
    }
    setVersions({
      pipelineVersions: data.pipelines.applications.map((app) => app.version),
      nextPageToken: data.pipelines.nextPageToken,
    });
  }, [loading, networkStatus, data]);

  return (
    <>
      <LoadingAppLevel message={'Restoring Version ...'} isopen={isRestoreLoading} />
      <PipelineModeless
        open={isOpen}
        onClose={toggle}
        anchorEl={anchorEl}
        title={T.translate(`${PREFIX}.header`) + ` "${pipelineName}"`}
      >
        <div className="grid-wrapper pipeline-history-list-table">
          {ready && (
            <PipelineHistoryTable
              pipelineName={pipelineName}
              appVersions={pipelineVersions}
              setRestoreLoading={setIsRestoreLoading}
            />
          )}
          <Pagination />
        </div>
      </PipelineModeless>
    </>
  );
};

const PipelineHistoryOuter = ({ isOpen, toggle, anchorEl, pipelineName }) => (
  <Provider store={Store}>
    <PipelineHistory
      isOpen={isOpen}
      toggle={toggle}
      anchorEl={anchorEl}
      pipelineName={pipelineName}
    />
  </Provider>
);

export default PipelineHistoryOuter;
