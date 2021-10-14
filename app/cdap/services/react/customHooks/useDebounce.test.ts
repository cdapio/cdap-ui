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

import { renderHook, act } from '@testing-library/react-hooks';
import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

describe('useDebounce tests', () => {
  it('verifies it should return the correct value', async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      const [value, setValue] = useState('');
      const val = useDebounce(value, 50);
      return { val, setValue: useCallback(setValue, []) };
    });

    expect(result.current.val).toBe('');
    act(() => {
      result.current.setValue('test val');
    });

    await waitForNextUpdate();
    expect(result.current.val).toBe('test val');

    act(() => {
      result.current.setValue('should not set');
    });

    expect(result.current.val).toBe('test val');

    act(() => {
      result.current.setValue('should set');
    });

    await waitForNextUpdate();
    expect(result.current.val).toBe('should set');
  });
});
