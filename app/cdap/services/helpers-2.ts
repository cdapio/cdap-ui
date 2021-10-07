/*
 * Copyright © 2021 Cask Data, Inc.
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

import { useEffect, useRef, useState } from 'react';

/**
 * Wrapper for useEffect that ensures the latest version of the callback will be used, unlike useEffect
 * @param unmountHandler function to call before "unmounting"
 */
export function useOnUnmount(unmountHandler: () => any): void {
  const unmountRef = useRef(unmountHandler);
  unmountRef.current = unmountHandler;
  useEffect(() => {
    return () => {
      unmountRef.current();
    };
  }, [unmountRef]);
}

/**
 * Custom hook to return a debounced value
 * @param value - value to return after the delay
 * @param delay [delay=300] - delay in ms for debounce to wait
 * @returns debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [dVal, setDVal] = useState<T>(value);

  useEffect(() => {
    const delayedCall = setTimeout(() => {
      setDVal(value);
    }, delay);

    return () => {
      clearTimeout(delayedCall);
    };
  }, [value]);

  return dVal;
}
