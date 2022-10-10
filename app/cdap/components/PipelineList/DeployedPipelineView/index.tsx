/*
 * Copyright © 2018 Cask Data, Inc.
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

import * as React from 'react';
import { useEffect } from 'react';
import PipelineTable from 'components/PipelineList/DeployedPipelineView/PipelineTable';
import {
  reset,
  setPipelines,
  nextPage,
  prevPage,
  setDrafts,
} from 'components/PipelineList/DeployedPipelineView/store/ActionCreator';
import PipelineCount from 'components/PipelineList/DeployedPipelineView/PipelineCount';
import SearchBox from 'components/PipelineList/DeployedPipelineView/SearchBox';
import { Provider } from 'react-redux';
import Store from 'components/PipelineList/DeployedPipelineView/store';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import If from 'components/shared/If';
import { categorizeGraphQlErrors } from 'services/helpers';
import ErrorBanner from 'components/shared/ErrorBanner';
import T from 'i18n-react';

import './DeployedPipelineView.scss';
const I18N_PREFIX = 'features.PipelineList.DeployedPipelineView';

import PaginationStepper from 'components/shared/PaginationStepper';
import styled from 'styled-components';
import { MyPipelineApi } from 'api/pipeline';

const PaginationContainer = styled.div`
  margin-right: 50px;
`;

const Pagination = ({}) => {
  const { prevDisabled, nextDisabled, shouldDisplay } = useSelector(({ deployed }) => ({
    prevDisabled: !deployed.previousTokens.length,
    nextDisabled: !deployed.nextPageToken,
    shouldDisplay: deployed.hasMultiple,
  }));

  if (!shouldDisplay) {
    return null;
  }

  return (
    <PaginationContainer className="float-right">
      <PaginationStepper
        onNext={nextPage}
        onPrev={prevPage}
        nextDisabled={nextDisabled}
        prevDisabled={prevDisabled}
      />
    </PaginationContainer>
  );
};

const checkError = (error) => {
  if (error) {
    const errorMap = categorizeGraphQlErrors(error);
    // Errors thrown here will be caught by error boundary
    // and will show error to the user within pipeline list view

    // Each error type could have multiple error messages, we're using the first one available
    if (errorMap.hasOwnProperty('pipelines')) {
      throw new Error(errorMap.pipelines[0]);
    } else if (errorMap.hasOwnProperty('network')) {
      throw new Error(errorMap.network[0]);
    } else if (errorMap.hasOwnProperty('generic')) {
      throw new Error(errorMap.generic[0]);
    } else {
      if (Object.keys(errorMap).length > 1) {
        // If multiple services are down
        const message = T.translate(`${I18N_PREFIX}.graphQLMultipleServicesDown`).toString();
        throw new Error(message);
      } else {
        // Pick one of the leftover errors to show in the banner;
        const errs = Object.values(errorMap);
        return errs ? errs[0][0] : 'Unknown error';
      }
    }
  }
  // no error, no message
  return '';
};

const DeployedPipeline: React.FC = () => {
  const QUERY = gql`
    query Query(
      $namespace: String
      $pageSize: Int
      $token: String
      $nameFilter: String
      $orderBy: String
    ) {
      pipelines(
        namespace: $namespace
        pageSize: $pageSize
        pageToken: $token
        nameFilter: $nameFilter
        orderBy: $orderBy
      ) {
        applications {
          name
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
          version
        }
        nextPageToken
      }
    }
  `;

  // on unmount
  React.useEffect(() => {
    return () => {
      reset();
    };
  }, []);
  const { ready, search, pageToken, sortOrder, pageLimit } = useSelector(
    ({ deployed }) => deployed
  );
  const { loading, error, data, refetch, networkStatus } = useQuery(QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      nameFilter: search || undefined,
      orderBy: sortOrder.toUpperCase(),
      token: pageToken || undefined,
      pageSize: pageLimit,
      namespace: getCurrentNamespace(),
    },
  });
  const bannerMessage = checkError(error);

  useEffect(() => {
    MyPipelineApi.getDrafts({ context: getCurrentNamespace() }).subscribe((res) => {
      setDrafts(res);
    });
  }, []);

  useEffect(() => {
    if (loading || networkStatus === 4) {
      return;
    }
    setPipelines({
      pipelines: data.pipelines.applications,
      nextPageToken: data.pipelines.nextPageToken,
    });
  }, [loading, networkStatus, data]);

  if (!data && (loading || networkStatus === 4)) {
    return <LoadingSVGCentered />;
  }

  return (
    <>
      {!ready && <LoadingSVGCentered />}
      <div className="pipeline-deployed-view pipeline-list-content">
        <div className="deployed-header">
          <SearchBox />
          <PipelineCount pipelinesLoading={loading} />
          <Pagination />
        </div>

        <If condition={!!error && !!bannerMessage}>
          <ErrorBanner canEditPageWhileOpen error={bannerMessage} />
        </If>
        {ready && <PipelineTable refetch={refetch} />}
      </div>
    </>
  );
};

const DeployedPipelineOuter = () => (
  <Provider store={Store}>
    <DeployedPipeline />
  </Provider>
);

export default DeployedPipelineOuter;
