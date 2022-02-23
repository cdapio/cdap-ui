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
  DEFAULT_SPANNER_CONNECTION_NAME,
  DEFAULT_SPANNER_DATABASE,
  DEFAULT_SPANNER_INSTANCE,
  DEFAULT_SPANNER_TABLE,
} from '../support/constants';
import _ = require('cypress/types/lodash');

let headers;

const SPANNER_CONNECTION_TYPE = 'Spanner';

describe('Wrangler SPANNER tests', () => {
  before(() => {
    Helpers.loginIfRequired()
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
      })
      .then(sessionToken => headers = Object.assign({}, headers, { 'Session-Token': sessionToken }))
      .then(() => cy.start_wrangler(headers));
  });

  it('Should successfully test SPANNER connection', () => {
    cy.test_gcp_connection(SPANNER_CONNECTION_TYPE, DEFAULT_SPANNER_CONNECTION_NAME);
    cy.get(Helpers.dataCy('connection-test-success')).contains('Successfully connected.');
  });

  it('Should show appropriate message when test connection fails', () => {
    cy.test_gcp_connection(SPANNER_CONNECTION_TYPE, 'unknown_spanner_connection', 'unknown_project', 'unknown_path');
    cy.get(Helpers.dataCy('connection-test-failure')).contains('Could not connect to Spanner');
  });

  it('Should create SPANNER connection', () => {
    cy.create_gcp_connection(SPANNER_CONNECTION_TYPE, DEFAULT_SPANNER_CONNECTION_NAME);
    cy.test_connection_navigation(DEFAULT_SPANNER_CONNECTION_NAME, '/');
  });

  it('Should show proper error message when trying to create existing connection', () => {
    cy.create_gcp_connection(SPANNER_CONNECTION_TYPE, DEFAULT_SPANNER_CONNECTION_NAME);
    cy.get('.modal-content .error').should(
      'contain',
      `'${DEFAULT_SPANNER_CONNECTION_NAME}' already exists.`
    );
  });

  it('Should be able navigate inside SPANNER connection & create workspace', () => {
    cy.visit('/cdap/ns/default/connections');
    cy.select_connection(SPANNER_CONNECTION_TYPE, DEFAULT_SPANNER_CONNECTION_NAME);
    cy.get(Helpers.dataCy('connection-browser')).within(() => {
      cy.contains(DEFAULT_SPANNER_INSTANCE).click();
      cy.contains(DEFAULT_SPANNER_DATABASE).click();
      cy.contains(DEFAULT_SPANNER_TABLE).click();
    });
    cy.url().should('contain', '/ns/default/wrangler');
  });

  it('Should show appropriate error when navigating to incorrect SPANNER connection', () => {
    const connName = 'spanner_unknown_connection';
    cy.visit(`/cdap/ns/default/connections/${connName}`);
    cy.contains(`Connection '${connName}' in namespace 'default' not found`);
    cy.contains('No entities found');
  });

  it('Should delete an existing connection', () => {
    cy.visit('/cdap/ns/default/connections');
    cy.delete_connection(SPANNER_CONNECTION_TYPE, DEFAULT_SPANNER_CONNECTION_NAME);
    cy.connection_does_not_exist(SPANNER_CONNECTION_TYPE, DEFAULT_SPANNER_CONNECTION_NAME);
  });
});
