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
  DEFAULT_BIGQUERY_CONNECTION_NAME,
  DEFAULT_BIGQUERY_DATASET,
  DEFAULT_BIGQUERY_TABLE,
} from '../support/constants';

let headers;

const BIGQUERY_CONNECTION_TYPE = 'BigQuery';

describe('Wrangler BigQuery tests', () => {
  before(() => {
    return Helpers.loginIfRequired()
      .then(() => {
        cy.getCookie('CDAP_Auth_Token').then((cookie) => {
          if (!cookie) {
            return Helpers.getSessionToken({});
          }
          headers = {
            Authorization: 'Bearer ' + cookie.value,
          };
          return Helpers.getSessionToken(headers);
        });
        return cy.wrap(headers);
      })
      .then(sessionToken => {
        headers = Object.assign({}, headers, { 'Session-Token': sessionToken });
        return cy.wrap(headers);
      })
      .then(() => cy.start_wrangler(headers));
  });
  it('Should successfully test BigQuery connection', () => {
    cy.test_gcp_connection(BIGQUERY_CONNECTION_TYPE, DEFAULT_BIGQUERY_CONNECTION_NAME);
    cy.get(Helpers.dataCy('connection-test-success')).contains('Successfully connected.');
  });

  it('Should show appropriate message when test connection fails', () => {
    cy.test_gcp_connection(
      BIGQUERY_CONNECTION_TYPE,
      'invalid_connection',
      'invalid_projectid',
      'invalid_serviceaccount_path'
    );
    cy.get(Helpers.dataCy('connection-test-failure')).contains('Service account key provided is not valid');
  });

  it('Should create BigQuery connection', () => {
    cy.create_gcp_connection(BIGQUERY_CONNECTION_TYPE, DEFAULT_BIGQUERY_CONNECTION_NAME);
    cy.test_connection_navigation(DEFAULT_BIGQUERY_CONNECTION_NAME, '/');
  });

  it('Should show proper error message when trying to create existing connection', () => {
    cy.create_gcp_connection(BIGQUERY_CONNECTION_TYPE, DEFAULT_BIGQUERY_CONNECTION_NAME);
    cy.get('.modal-content .error').should(
      'contain',
      `'${DEFAULT_BIGQUERY_CONNECTION_NAME}' already exists.`
    );
  });

  it('Should be able to navigate inside BigQuery and create a workspace', () => {
    cy.visit('/cdap/ns/default/connections');
    cy.select_connection(BIGQUERY_CONNECTION_TYPE, DEFAULT_BIGQUERY_CONNECTION_NAME);
    cy.contains(DEFAULT_BIGQUERY_DATASET).click();
    cy.contains(DEFAULT_BIGQUERY_TABLE).click();
    cy.url().should('contain', '/ns/default/wrangler');
  });

  it('Should show appropriate error when navigating to incorrect BigQuery connection', () => {
    const connName = 'bigquery_unknown_connection';
    cy.visit(`/cdap/ns/default/connections/${connName}`);
    cy.contains(`Connection '${connName}' in namespace 'default' not found`);
    cy.contains('No entities found');
  });

  it('Should delete an existing connection', () => {
    cy.visit('/cdap/ns/default/connections');
    cy.delete_connection(BIGQUERY_CONNECTION_TYPE, DEFAULT_BIGQUERY_CONNECTION_NAME);
    cy.connection_does_not_exist(BIGQUERY_CONNECTION_TYPE, DEFAULT_BIGQUERY_CONNECTION_NAME);
  });
});
