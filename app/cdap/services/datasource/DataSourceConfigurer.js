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
import DataSourceWebsockets from 'services/datasource/DataSourceWebsockets';
import DataSourceHttp from 'services/datasource/DataSourceHttp';
import RedirectToLogin from 'services/redirect-to-login';
import { objectQuery } from 'services/helpers';

export function isHttpEnabled() {
  const featureFlags = objectQuery(window, 'CDAP_CONFIG', 'featureFlags');
  if (featureFlags && featureFlags['network.client.useHttp'] === 'false') {
    return false;
  }
  return true;
}

const DatasourceConfigurer = {
  getInstance(handlers = []) {
    if (Array.isArray(handlers)) {
      let dataSource;
      if (isHttpEnabled()) {
        dataSource = new DataSourceHttp([...handlers, RedirectToLogin]);
      } else {
        dataSource = new DataSourceWebsockets(([...handlers, RedirectToLogin]));
      }
      return dataSource;
    } else {
      console.trace();
      throw "'handlers' for Datasource should be an array";
    }
  },
};

export default DatasourceConfigurer;
