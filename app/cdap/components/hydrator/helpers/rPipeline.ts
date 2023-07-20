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
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';

const fetchPipeline = function(namespace, pipeline) {
  return fetch(`/api/v3/namespaces/${namespace}/apps/${pipeline}`).then((res) => res.json());
};

const fetchPipelineVersion = function(namespace, pipeline, version) {
  return fetch(`/api/v3/namespaces/${namespace}/apps/${pipeline}/version/${version}`).then((res) => res.json());
};


export const rPipelineDetails = function(namespace, myAlertOnValium) {
  const pipeline = window.location.pathname.split('view/')[1];


  if (window.localStorage.getItem('pipelineHistoryVersion') !== null) {
    const version = window.localStorage.getItem('pipelineHistoryVersion');
    return fetchPipelineVersion(namespace, pipeline, version)
      .then(
        (pipelineDetail) => {
          let config = pipelineDetail.configuration;
          window.localStorage.removeItem('pipelineHistoryVersion');
          try {
            config = JSON.parse(config);
          } catch (e) {
            myAlertOnValium.show({
              type: 'danger',
              content: 'Unable to parse the selected version JSON'
            });
            throw(e);
          }
          if (!config.stages) {
            myAlertOnValium.show({
              type: 'danger',
              content: 'Pipeline is created using older version of hydrator. Please upgrage the pipeline to newer version(3.4) to view in UI.'
            });
            throw(new Error('old pipe'));
          }
          return pipelineDetail;
        },(err) => {
            window.localStorage.removeItem('pipelineHistoryVersion');
            (window as any).CaskCommon.ee.emit(
              (window as any).CaskCommon.globalEvents.PAGE_LEVEL_ERROR, err);
          }
      );
  }
  

  return fetchPipeline(namespace, pipeline) 
    .then(
      (pipelineDetail) => {
        let config = pipelineDetail.configuration;
        try {
          config = JSON.parse(config);
        } catch (e) {
          myAlertOnValium.show({
            type: 'danger',
            content: 'Invalid configuration JSON.'
          });
          // FIXME: We should not have done this. But ui-router when rejected on a 'resolve:' function takes it to the parent state apparently
          // and in our case the parent state is 'hydrator and since its an abstract state it goes to home.'
          window.location.href = getHydratorUrl ({
            stateName: 'hydrator.list',
            stateParams: {
              namespace: namespace
            },
          });
          throw(e);
        }
        if (!config.stages) {
          myAlertOnValium.show({
            type: 'danger',
            content: 'Pipeline is created using older version of hydrator. Please upgrage the pipeline to newer version(3.4) to view in UI.'
          });
          // FIXME: We should not have done this. But ui-router when rejected on a 'resolve:' function takes it to the parent state apparently
          // and in our case the parent state is 'hydrator and since its an abstract state it goes to home.'
          window.location.href = getHydratorUrl({
            stateName: 'hydrator.list',
            stateParams: {
              namespace: namespace
            },
          });
          throw(new Error('old pipe'));
        }
        return pipelineDetail;
      }, (err) => {
          (window as any).CaskCommon.ee.emit(
            (window as any).CaskCommon.globalEvents.PAGE_LEVEL_ERROR, err);
        }
    );
};