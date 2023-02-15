/*
 * Copyright © 2023 Cask Data, Inc.
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

import { useState, useEffect, useRef } from 'react';

interface ApiResponse<T> {
  response: T;
  error: Record<string, unknown>;
}

export default function useFetch<T>(service, params, requestBody?): ApiResponse<T> {
  const [response, setResponse] = useState<T>(null);
  const [error, setError] = useState<Record<string, unknown>>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    /*
     * here to avoid the API calling for the first time when useEffect is called
     * we are using a ref with default value true
     * and when this useEffect is called for the first time we are making this value false
     * and returning without calling an API so that unnecessary API call will not happen for the first time
     */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setResponse(null);
    setError(null);
    service(params, requestBody ?? {}).subscribe(
      (res) => {
        const apiResponse = res || true;
        setResponse(apiResponse);
      },
      (err: Record<string, unknown>) => {
        setError(err);
      }
    );
  }, [params]);

  return { response, error };
}
