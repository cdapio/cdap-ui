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

import { SettingsApi } from 'api/settings';
import _set from 'lodash/set';
import _get from 'lodash/get';
import { getCurrentNamespace } from 'services/NamespaceStore';
import Defer from './defer';

export default class MySettingsService {
  static instance: MySettingsService = null;

  static getInstance() {
    if (!MySettingsService.instance) {
      MySettingsService.instance = new MySettingsService();
    }
    
    return MySettingsService.instance;
  }

  data: any;
  pending: Promise<any>;

  constructor () {
    if (MySettingsService.instance) return MySettingsService.instance;
    this.data = {};
    this.pending = null;
    MySettingsService.instance = this;
  }

  set = (key: string, value) => {
    const defefred =  new Defer();
    this.data = _set(this.data, key, value);
    SettingsApi.updateUserSettings({ namespace: getCurrentNamespace() }, this.data).subscribe(
      (res) => {
        defefred.resolve(res);
      },
      (err) => {
        defefred.reject(err);
      }
    );

    return defefred.promise;
  }

  get = async (key: string, force?: boolean) => {
    const val = _get(this.data, key);
    if (!force && val) {
      return val;
    }

    if (this.pending) {
      await this.pending;
      return _get(this.data, key);
    }

    const deferred = new Defer();
    this.pending = deferred.promise;
    SettingsApi.getUserSettings({ namespace: getCurrentNamespace() }).subscribe(
      (res) => {
        this.data = res.property;
        deferred.resolve(_get(this.data, key));
      },
      (err) => {
        deferred.reject(err);
      },
    );

    try {
      const val = await this.pending;
      this.pending = null;
      return val;
    } catch (err) {
      this.pending = null;
      return undefined;
    }
  }
}