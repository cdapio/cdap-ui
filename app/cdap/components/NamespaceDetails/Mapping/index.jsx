/*
 * Copyright © 2018 Cask Data, Inc.
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

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';
require('./Mapping.scss');

const PREFIX = 'features.NamespaceDetails.mapping';

const mapStateToProps = (state) => {
  return {
    hdfsRootDirectory: state.hdfsRootDirectory,
    hbaseNamespaceName: state.hbaseNamespaceName,
    hiveDatabaseName: state.hiveDatabaseName,
    schedulerQueueName: state.schedulerQueueName,
  };
};

const NamespaceDetailsMapping = ({
  hdfsRootDirectory,
  hbaseNamespaceName,
  hiveDatabaseName,
  schedulerQueueName,
}) => {
  if (Theme.showNamespaceMapping === false) {
    return null;
  }

  return (
    <React.Fragment>
      <hr className="more-margin-top" />
      <div className="namespace-details-mapping">
        <div className="namespace-details-section-label">
          <strong>{T.translate(`${PREFIX}.label`)}</strong>
        </div>
        <div className="mapping-values-group">
          <span className="mapping-values">
            <strong>{T.translate(`${PREFIX}.hdfsRootDirectory`)}</strong>
            <span title={hdfsRootDirectory}>{hdfsRootDirectory || '- -'}</span>
          </span>
          <span className="mapping-values">
            <strong>{T.translate(`${PREFIX}.hbaseNamespaceName`)}</strong>
            <span title={hbaseNamespaceName}>
              {hbaseNamespaceName || '- -'}
            </span>
          </span>
        </div>
        <div className="mapping-values-group">
          <span className="mapping-values">
            <strong>{T.translate(`${PREFIX}.hiveDatabaseName`)}</strong>
            <span title={hiveDatabaseName}>{hiveDatabaseName || '- -'}</span>
          </span>
          <span className="mapping-values">
            <strong>{T.translate(`${PREFIX}.schedulerQueueName`)}</strong>
            <span title={schedulerQueueName}>
              {schedulerQueueName || '- -'}
            </span>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

NamespaceDetailsMapping.propTypes = {
  hdfsRootDirectory: PropTypes.string,
  hbaseNamespaceName: PropTypes.string,
  hiveDatabaseName: PropTypes.string,
  schedulerQueueName: PropTypes.string,
};

const ConnectedNamespaceDetailsMapping = connect(mapStateToProps)(
  NamespaceDetailsMapping
);
export default ConnectedNamespaceDetailsMapping;
