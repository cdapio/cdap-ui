/*
 * Copyright © 2024 Cask Data, Inc.
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

import { useRef, useEffect } from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

// This react hook is intended to be used in place of $scope.$watch function
// when migrating code from angularjs to react. It's not recommended to use
// this hook for any other purpose. Components in react should not require
// any separate mechanism to respond to state changes than the useEffect hook.
// Also, updating state inside an effect is generally a bad idea, it can get
// out of hand pretty quick.

export type ChangeCallback<T> = (newState?: T, oldState?: T) => void;

interface Watcher<T> {
  id: number;
  path: string;
  callback: ChangeCallback<T>;
}

type WatchFn<T> = (path: string, callback: ChangeCallback<T>) => () => void;

export default function useWatchers<T>(state: T): WatchFn<T> {
  const idCounter = useRef<number>(0);
  const oldState = useRef<T>(state);
  const watchers = useRef<Array<Watcher<T>>>([]);

  function applyWatcher(oldState: T, newState: T, watcher: Watcher<T>): void {
    const oldValue = _get(oldState, watcher.path);
    const newValue = _get(newState, watcher.path);

    if (!_isEqual(oldValue, newValue)) {
      watcher.callback(newState, oldState);
    }
  }

  useEffect(() => {
    for (const watcher of watchers.current) {
      applyWatcher(oldState.current, state, watcher);
    }

    oldState.current = state;
  }, [state]);

  function watch(path: string, callback: ChangeCallback<T>) {
    const id = idCounter.current;
    idCounter.current += 1;

    const watcher = { id, path, callback };
    watchers.current.push(watcher);

    // return the unwatch function, i.e. the function to remove the watcher
    return () => {
      const index = watchers.current.indexOf(watcher);
      watchers.current.splice(index, 1);
    };
  }

  return watch;
}
