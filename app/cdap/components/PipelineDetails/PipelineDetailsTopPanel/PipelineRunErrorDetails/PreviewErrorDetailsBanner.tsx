/*
 * Copyright © 2025 Cask Data, Inc.
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
import { IErrorEntry } from './types';
import PreviewDataFetcher from 'components/LogViewer/DataFetcher/PreviewDataFetcher';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyPreviewApi } from 'api/preview';
import { delay } from '@cdap-ui/utils/time';
import { RETRY_DELAY_MS } from './constants';
import { PREVIEW_STATUS } from 'services/PreviewStatus';
import ErrorDetailsBanner from './ErrorDetailsBanner';

export interface IPreviewErrorDetailsBannerProps {
  previewId?: string | null;
  previewStatus?: string | null;
  setErrorDetails(errors?: IErrorEntry[]): void;
  errorDetails?: IErrorEntry[] | null;
}

export default function PreviewErrorClassificationBanner({
  previewId,
  previewStatus,
  errorDetails,
  setErrorDetails,
}: IPreviewErrorDetailsBannerProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const dataFetcher = new PreviewDataFetcher({
    namespace: getCurrentNamespace(),
    previewId,
  });

  // TODO [CDAP-21109](https://cdap.atlassian.net/browse/CDAP-21109): add feature flag here
  const improvementSurveyEnabled = false;

  function fetchErrorDetails() {
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorDetails(null);
    MyPreviewApi.getErrorDetails({
      namespace: getCurrentNamespace(),
      previewId,
    }).subscribe(
      (res: IErrorEntry[]) => {
        setErrorDetails(res);
        setLoading(false);
      },
      async (err) => {
        // In case of API error, wait 10s before retrying
        setErrorDetails(null);
        await delay(RETRY_DELAY_MS);
        setLoading(false);
      }
    );
  }

  useEffect(() => {
    if (!errorDetails?.length && !loading && previewStatus === PREVIEW_STATUS.RUN_FAILED) {
      fetchErrorDetails();
    }
  }, [previewId, previewStatus, errorDetails, loading]);

  if (!(previewId && previewStatus)) {
    return null;
  }

  if (previewStatus !== PREVIEW_STATUS.RUN_FAILED || loading) {
    return null;
  }

  return (
    <ErrorDetailsBanner
      hasSurvey={improvementSurveyEnabled}
      dataFetcher={dataFetcher}
      errorDetails={errorDetails}
      previewId={previewId}
    />
  );
}
