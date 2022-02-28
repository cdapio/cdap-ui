/*
 * Copyright © 2019 Cask Data, Inc.
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

import * as Helpers from '../helpers';
import {
  DEFAULT_GCS_FILE,
  DEFAULT_GCS_FOLDER,
  DEFAULT_GCS_CONNECTION_NAME,
} from '../support/constants';

let headers;

const GCS_CONNECTION_TYPE = 'GCS';

describe('Wrangler GCS tests', () => {
  before(() => {
    return Helpers.loginIfRequired()
      .then(() => {
        cy.getCookie('CDAP_Auth_Token').then((cookie) => {
          if (!cookie) {
            return cy.wrap(headers);
          }
          headers = {
            Authorization: 'Bearer ' + cookie.value,
          };
        });
      })
      .then(Helpers.getSessionToken)
      .then(
        (sessionToken) => (headers = Object.assign({}, headers, { 'Session-Token': sessionToken }))
      )
      .then(() => cy.start_wrangler(headers));
  });

  it('Should successfully test GCS connection', () => {
    cy.test_gcp_connection(GCS_CONNECTION_TYPE, DEFAULT_GCS_CONNECTION_NAME);
    cy.get(Helpers.dataCy('connection-test-success'), {
      timeout: 60000,
    }).contains('Successfully connected.');
  });

  it('Should show appropriate message when test connection fails', () => {
    cy.test_gcp_connection(GCS_CONNECTION_TYPE, 'unknown_gcs_connection', 'unknown_project', 'unknown_path');
    cy.get(Helpers.dataCy('connection-test-failure'), {
      timeout: 60000,
    }).contains('Service account provided is not valid');
  });

  it('Should create GCS connection', () => {
    cy.create_gcp_connection(GCS_CONNECTION_TYPE, DEFAULT_GCS_CONNECTION_NAME);
    cy.test_connection_navigation(DEFAULT_GCS_CONNECTION_NAME, '/');
  });

  it('Should show proper error message when trying to create existing connection', () => {
    cy.create_gcp_connection(GCS_CONNECTION_TYPE, DEFAULT_GCS_CONNECTION_NAME);
    cy.get('.modal-content .error').should(
      'contain',
      `'${DEFAULT_GCS_CONNECTION_NAME}' already exists.`
    );
  });

  it('Should be able navigate inside GCS connection & create workspace', () => {
    cy.visit('/cdap/ns/default/connections');
    cy.select_connection(GCS_CONNECTION_TYPE, DEFAULT_GCS_CONNECTION_NAME);
    cy.get(Helpers.dataCy('connection-browser-search')).type(DEFAULT_GCS_FOLDER);
    cy.contains(DEFAULT_GCS_FOLDER, {
      timeout: 60000,
    }).click();
    cy.contains(DEFAULT_GCS_FILE, {
      timeout: 60000,
    }).click();
    cy.get(Helpers.dataCy('parsing-config-confirm')).click();
    cy.url().should('contain', '/ns/default/wrangler');
  });

  it('Should show appropriate error when navigating to incorrect GCS connection', () => {
    const connName = 'gcs_unknown_connection';
    cy.visit(`/cdap/ns/default/connections/${connName}`);
    cy.contains(`Connection '${connName}' in namespace 'default' not found`);
    cy.contains('No entities found');
  });

  it('Should delete an existing connection', () => {
    cy.visit('/cdap/ns/default/connections');
    cy.delete_connection(GCS_CONNECTION_TYPE, DEFAULT_GCS_CONNECTION_NAME);
    cy.connection_does_not_exist(GCS_CONNECTION_TYPE, DEFAULT_GCS_CONNECTION_NAME);
  });
});
