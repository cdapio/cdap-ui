/*
 * Copyright © 2017 Cask Data, Inc.
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

import PropTypes from 'prop-types';
import React from 'react';
require('./AuthorizationMessage.scss');
import NamespaceStore from 'services/NamespaceStore';
import Cookies from 'universal-cookie';
import RedirectToLogin from 'services/redirect-to-login';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';
import { isAuthSetToProxyMode } from 'services/helpers';
import { Theme } from 'services/ThemeHelper';
import T from 'i18n-react';
import If from 'components/shared/If';

const cookie = new Cookies();
const CDF_USE_RBAC_DOC_URL =
  'https://cloud.google.com/data-fusion/docs/how-to/create-role-based-access-control';
const CDF_RBAC_ROLES_DOC_URL =
  'https://cloud.google.com/data-fusion/docs/concepts/rbac-roles-and-permissions';

export default function AuthorizationErrorMessage({ message }) {
  const resolvedMessage = message || T.translate('features.AuthorizationMessage.mainMessage');
  const isProxyAuth = isAuthSetToProxyMode();
  const isCloudDataFusion =
    typeof Theme.productName === 'string' && Theme.productName.includes('Data Fusion');
  let eventEmitter = ee(ee);
  const logout = () => {
    cookie.remove('show-splash-screen-for-session', { path: '/' });
    RedirectToLogin({ statusCode: 401 });
  };
  const openNamespaceCreateWizard = () => {
    eventEmitter.emit(globalEvents.CREATENAMESPACE);
  };
  let username = NamespaceStore.getState().username;
  return (
    <div className="auth-error-message">
      <h3>
        <span className="fa fa-exclamation-triangle" />
        <span>{resolvedMessage}</span>
      </h3>
      <div className="cta-section">
        {isProxyAuth ? (
          <ul>
            <li>
              <span>
                {T.translate(
                  isCloudDataFusion
                    ? 'features.AuthorizationMessage.rbacCallToAction1'
                    : 'features.AuthorizationMessage.callToAction1'
                )}
              </span>
            </li>
            {isCloudDataFusion && (
              <li>
                <span>{T.translate('features.AuthorizationMessage.rbacDocsMessage.prefix')}</span>
                <a
                  className="link"
                  href={CDF_USE_RBAC_DOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {T.translate('features.AuthorizationMessage.rbacDocsMessage.useRbacLabel')}
                </a>
                <span>
                  {T.translate('features.AuthorizationMessage.rbacDocsMessage.conjunction')}
                </span>
                <a
                  className="link"
                  href={CDF_RBAC_ROLES_DOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {T.translate(
                    'features.AuthorizationMessage.rbacDocsMessage.rolesAndPermissionsLabel'
                  )}
                </a>
                <span>{T.translate('features.AuthorizationMessage.rbacDocsMessage.suffix')}</span>
              </li>
            )}
          </ul>
        ) : (
          <ul>
            <li>
              <span>{T.translate('features.AuthorizationMessage.callToAction1')}</span>
            </li>
            <li>
              <If condition={username}>
                <span>
                  {T.translate('features.AuthorizationMessage.callToAction2.message1', {
                    username,
                  })}
                </span>
              </If>
              <span className="link" onClick={logout}>
                {T.translate('features.AuthorizationMessage.callToAction2.loginLabel')}
              </span>
              <span>{T.translate('features.AuthorizationMessage.callToAction2.message2')}</span>
            </li>
            <li>
              <span className="link" onClick={openNamespaceCreateWizard}>
                {T.translate('features.AuthorizationMessage.callToAction3.message1')}
              </span>
              <span>{T.translate('features.AuthorizationMessage.callToAction3.message2')}</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

AuthorizationErrorMessage.propTypes = {
  message: PropTypes.string,
};
