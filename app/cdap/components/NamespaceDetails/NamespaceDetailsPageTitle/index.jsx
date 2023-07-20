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
import Helmet from 'react-helmet';
import T from 'i18n-react';
import { connect } from 'react-redux';
import { Theme } from 'services/ThemeHelper';

const NAMESPACE_I18N_PREFIX = 'features.NamespaceDetails';

function NamespaceDetailsPageTitle({ namespace_name }) {
  return (
    <Helmet
      title={T.translate(`${NAMESPACE_I18N_PREFIX}.pageTitle`, {
        namespace_name,
        productName: Theme.productName,
      })}
    />
  );
}
NamespaceDetailsPageTitle.propTypes = {
  namespace_name: PropTypes.string,
};
const mapStateToProps = (state) => ({
  namespace_name: state.name,
});
const ConnectedNamespaceDetailsPageTitle = connect(mapStateToProps)(
  NamespaceDetailsPageTitle
);
export default ConnectedNamespaceDetailsPageTitle;
