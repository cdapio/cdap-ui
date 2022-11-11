/*
 * Copyright © 2019-2020 Cask Data, Inc.
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

import { constructUrl } from 'server/url-helper';
import { getCDAPConfig } from 'server/cdap-config';
import { getGETRequestOptions, requestPromiseWrapper } from 'gql/resolvers-common';
import { orderBy } from 'natural-orderby';
import { ApolloError } from 'apollo-server';

let cdapConfig;
getCDAPConfig().then(function(value) {
  cdapConfig = value;
});

export async function queryTypePipelinesResolver(parent, args, context) {
  const namespace = args.namespace;
  const options = getGETRequestOptions();

  const pipelineArtifacts = ['cdap-data-pipeline', 'cdap-data-streams', 'cdap-sql-pipeline'];

  const params = {
    artifactName: pipelineArtifacts.join(','),
    pageToken: args.pageToken,
    pageSize: args.pageSize,
    orderBy: args.orderBy,
    nameFilter: args.nameFilter,
    latestOnly: args.latestOnly,
    nameFilterType: args.nameFilterType,
    sortCreationTime: args.sortCreationTime
  };
  for (let key in params) {
    if (params[key] === undefined) {
      delete params[key];
    }
  }

  let path = `/v3/namespaces/${namespace}/apps?${new URLSearchParams(params)}`;

  options.url = constructUrl(cdapConfig, path);
  context.namespace = namespace;

  const errorModifiersFn = (error, statusCode) => {
    return new ApolloError(error, statusCode, { errorOrigin: 'pipelines' });
  };

  const apps = await requestPromiseWrapper(options, context, null, errorModifiersFn);
  return apps;
}
