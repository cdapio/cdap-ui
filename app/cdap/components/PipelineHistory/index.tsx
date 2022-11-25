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

import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import React, { useEffect, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';
import T from 'i18n-react';
import { PipelineHistoryTable } from './PipelineHistoryTable';
import { useQuery } from '@apollo/react-hooks';
import PaginationStepper from 'components/shared/PaginationStepper';
import { Provider, useSelector } from 'react-redux';
import Store, {
  nextPage,
  prevPage,
  PIPELINE_HISTORY_QUERY,
  setPageLimit,
  setVersions,
} from './PipelineHistoryStore';
import SelectWithOptions from 'components/shared/SelectWithOptions';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import { PipelineHistoryTableDiv } from './styles';
import { MyPipelineApi } from 'api/pipeline';

const PREFIX = 'features.PipelineHistory';

interface IPipelineHistoryProps {
  isOpen: boolean;
  toggle: () => void;
  anchorEl: any;
  pipelineName: string;
}

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
  const [latestVersion, setLatestVersion] = useState(null);

  const { loading, error, data, refetch, networkStatus } = useQuery(PIPELINE_HISTORY_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      nameFilter: pipelineName || undefined,
      token: pageToken || undefined,
      pageSize: pageLimit,
      namespace: getCurrentNamespace(),
      orderBy: 'DESC',
      nameFilterType: 'EQUALS',
      sortCreationTime: 'true',
      latestOnly: 'false',
    },
  });

  const Pagination = ({}) => {
    const { prevDisabled, nextDisabled, pageCount, pageIndex, pageLimitOptions } = useSelector(
      ({ versions }) => ({
        prevDisabled: !versions.previousTokens.length,
        nextDisabled: !versions.nextPageToken,
        pageCount: versions.pipelineVersions.length,
        pageIndex: versions.previousTokens.length,
        pageLimitOptions: versions.pageLimitOptions,
      })
    );

    const onChange = (e) => {
      setPageLimit(e.target.value);
    };

    return (
      <PaginationContainer className="float-right">
        <div>{T.translate(`${PREFIX}.table.rowsPerPage`)}</div>
        <div>
          <SelectWithOptions value={pageLimit} onChange={onChange} options={pageLimitOptions} />
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
      pipelineVersions: data.pipelines.applications.map((app) => {
        return {
          version: app.version,
          description: app.change && app.change.description,
          date: app.change && new Date(parseInt(app.change.creationTimeMillis, 10)).toUTCString(),
        };
      }),
      nextPageToken: data.pipelines.nextPageToken,
    });
  }, [loading, networkStatus, data]);

  useEffect(() => {
    const params = {
      namespace: getCurrentNamespace(),
      appId: pipelineName,
    };
    MyPipelineApi.get(params).subscribe((res) => {
      setLatestVersion(res.appVersion);
    });
  }, []);

  return (
    <>
      <LoadingAppLevel message={'Restoring Version ...'} isopen={isRestoreLoading} />
      <PipelineModeless
        open={isOpen}
        onClose={toggle}
        anchorEl={anchorEl}
        title={T.translate(`${PREFIX}.header`) + ` "${pipelineName}"`}
      >
        <PipelineHistoryTableDiv className="grid-wrapper pipeline-history-list-table">
          {ready && (
            <PipelineHistoryTable
              pipelineName={pipelineName}
              pipelineVersions={pipelineVersions}
              setRestoreLoading={setIsRestoreLoading}
              latestVersion={latestVersion}
            />
          )}
          <Pagination />
        </PipelineHistoryTableDiv>
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
