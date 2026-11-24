/*
 * Copyright © 2026 Cask Data, Inc.
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
import T from 'i18n-react';
import { cleanup, render } from 'test-utils';
import AuthorizationErrorMessage from 'components/AuthorizationErrorMessage';
import NamespaceStore from 'services/NamespaceStore';
import NamespaceActions from 'services/NamespaceStore/NamespaceActions';
import { Theme } from 'services/ThemeHelper';

const enText = require('text/text-en.yaml');
T.setTexts(enText);

describe('AuthorizationErrorMessage', () => {
  const originalCdapConfig = (window as any).CDAP_CONFIG;
  const originalProductName = Theme.productName;
  const originalUsername = NamespaceStore.getState().username;

  afterEach(() => {
    cleanup();
    (window as any).CDAP_CONFIG = originalCdapConfig;
    Theme.productName = originalProductName;
    NamespaceStore.dispatch({
      type: NamespaceActions.updateUsername,
      payload: { username: originalUsername },
    });
  });

  it('renders RBAC role guidance and both CDF doc links while hiding broken CTAs in CDF PROXY mode', () => {
    (window as any).CDAP_CONFIG = {
      securityEnabled: true,
      securityMode: 'PROXY',
    };
    Theme.productName = 'Cloud Data Fusion';

    const { getByText, queryByText } = render(<AuthorizationErrorMessage />);

    expect(
      getByText(/You are not authorized to access any existing namespace/)
    ).toBeInTheDocument();
    expect(
      getByText(
        'Contact your administrator to grant you a namespace role (Viewer, Developer, Operator, or Editor) or the Cloud Data Fusion Admin role (roles/datafusion.admin).'
      )
    ).toBeInTheDocument();

    const useRbacLink = getByText('Use role-based access control').closest('a');
    expect(useRbacLink).toHaveAttribute(
      'href',
      'https://cloud.google.com/data-fusion/docs/how-to/create-role-based-access-control'
    );
    expect(useRbacLink).toHaveAttribute('target', '_blank');
    expect(useRbacLink).toHaveAttribute('rel', 'noopener noreferrer');

    const rolesDocLink = getByText('RBAC roles and permissions').closest('a');
    expect(rolesDocLink).toHaveAttribute(
      'href',
      'https://cloud.google.com/data-fusion/docs/concepts/rbac-roles-and-permissions'
    );
    expect(rolesDocLink).toHaveAttribute('target', '_blank');
    expect(rolesDocLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(queryByText(/Create a new namespace/)).toBeNull();
    expect(queryByText(/as another user/)).toBeNull();
  });

  it('renders specific namespace message, falls back on null message, and avoids GCP links in non-CDF PROXY mode', () => {
    (window as any).CDAP_CONFIG = {
      securityEnabled: true,
      securityMode: 'PROXY',
    };
    Theme.productName = 'Data Fusion';

    const { getByText, queryByText, rerender } = render(
      <AuthorizationErrorMessage message="You are not authorized to access 'prod-ns' namespace" />
    );
    expect(getByText("You are not authorized to access 'prod-ns' namespace")).toBeInTheDocument();
    expect(getByText('Use role-based access control')).toBeInTheDocument();

    rerender(<AuthorizationErrorMessage message={null} />);
    expect(
      getByText(/You are not authorized to access any existing namespace/)
    ).toBeInTheDocument();

    Theme.productName = 'CDAP';
    rerender(<AuthorizationErrorMessage />);
    expect(
      getByText('Please contact your system administrator to request access to a namespace')
    ).toBeInTheDocument();
    expect(queryByText('Use role-based access control')).toBeNull();
    expect(queryByText(/Create a new namespace/)).toBeNull();
    expect(queryByText(/as another user/)).toBeNull();
  });

  it('preserves all original CTAs in MANAGED mode', () => {
    (window as any).CDAP_CONFIG = {
      securityEnabled: true,
      securityMode: 'MANAGED',
    };
    Theme.productName = 'CDAP';

    const { getByText, queryByText, rerender } = render(<AuthorizationErrorMessage />);
    expect(
      getByText('Please contact your system administrator to request access to a namespace')
    ).toBeInTheDocument();
    expect(queryByText(/You are logged in as/)).toBeNull();
    expect(getByText(/as another user/)).toBeInTheDocument();
    expect(getByText(/Create a new namespace/)).toBeInTheDocument();
    expect(queryByText('Use role-based access control')).toBeNull();

    NamespaceStore.dispatch({
      type: NamespaceActions.updateUsername,
      payload: { username: 'alice' },
    });
    rerender(<AuthorizationErrorMessage />);
    expect(getByText(/You are logged in as/)).toBeInTheDocument();
    expect(getByText('alice')).toBeInTheDocument();
  });
});
