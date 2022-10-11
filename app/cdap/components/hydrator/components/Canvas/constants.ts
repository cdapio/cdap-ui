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

export const PLUGIN_TYPES = {
  // source
  BATCH_SOURCE: 'batchsource',
  // transform
  TRANSFORM: 'transform',
  SPLITTER_TRANSFORM: 'splittertransform',
  // analytics
  BATCH_AGGREGATOR: 'batchaggregator',
  SPARK_COMPUTE: 'sparkcompute',
  SPARK_PROGRAM: 'sparkprogram',
  BATCH_JOINER: 'batchjoiner',
  // sink
  BATCH_SINK: 'batchsink',
  // conditions and actions
  CONDITION: 'condition',
  ACTION: 'action',
  // error handlers and alerts
  ALERT_PUBLISHER: 'alertpublisher',
  ERROR_TRANSFORM: 'errortransform',
};
