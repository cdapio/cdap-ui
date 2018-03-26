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
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentNamespace} from 'services/NamespaceStore';
import NamespacesPopover from 'components/NamespacesPicker/NamespacesPopover';

require('./NamespacesPicker.scss');

function NamespacesPickerView({namespacesPick}) {
  let monitorTitle;

  if (namespacesPick.length === 0) {
    monitorTitle = (
      <div className="namespace-list-monitor">
        Monitor Namespace {`'${getCurrentNamespace()}'`}
      </div>
    );
  } else {
    let namespacesList = [getCurrentNamespace()].concat(namespacesPick);

    let text = namespacesList.map((ns) => `'${ns}'`).join('; ');
    let title = namespacesList.join('\n');

    monitorTitle = (
      <div
        className="namespace-list-monitor"
        title={title}
      >
        Monitor {namespacesPick.length + 1} Namespaces {text}
      </div>
    );
  }

  return (
    <div className="namespace-picker float-xs-right">
      {monitorTitle}

      <div className="monitor-more text-xs-right">
        <div className="d-inline-block">
          <NamespacesPopover />
        </div>
      </div>
    </div>
  );
}

NamespacesPickerView.propTypes = {
  namespacesPick: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    namespacesPick: state.namespaces.namespacesPick
  };
};

const NamespacesPicker = connect(
  mapStateToProps
)(NamespacesPickerView);

export default NamespacesPicker;
