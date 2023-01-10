/*
 * Copyright © 2016 Cask Data, Inc.
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

angular.module(PKG.name + '.feature.tracker')
  .config(function($stateProvider, $urlRouterProvider, MYAUTH_ROLE) {
    const reactAppUrl = {
      home: `/cdap/ns/<namespace>/metadata`,
      search: `/cdap/ns/<namespace>/metadata/search/<query>/result`,
      summary: `/cdap/ns/<namespace>/metadata/<entityType>/<entityId>/summary`,
      lineage: `/cdap/ns/<namespace>/metadata/<entityType>/<entityId>/lineage`,
    };
    const productName = window.CaskCommon.ThemeHelper.Theme.productName;

    $urlRouterProvider.otherwise(() => {
      //unmatched route, will show 404
      window.CaskCommon.ee.emit(
        window.CaskCommon.globalEvents.PAGE_LEVEL_ERROR, { statusCode: 404 });

    });

    $stateProvider
      .state('ns', {
        url: '/ns/:namespace',
        abstract: true,
        template: '<ui-view/>',
        data: {
          authorizedRoles: MYAUTH_ROLE.all,
          highlightTab: 'development'
        },
        resolve: {
          sessionToken: function() {
            window.CaskCommon.SessionTokenStore.fetchSessionToken();
          },
          rResetPreviousPageLevelError: function () {
            window.CaskCommon.ee.emit(
              window.CaskCommon.globalEvents.PAGE_LEVEL_ERROR, { reset: true });
          },
          rValidNamespace: function ($stateParams) {
            return window.CaskCommon.validateNamespace($stateParams.namespace);
          },
        },
      })
      .state('tracker', {
        url: '?iframe&sourceUrl',
        abstract: true,
        parent: 'ns',
        template: '<ui-view/>',
        resolve: {
          sessionToken: function() {
            window.CaskCommon.SessionTokenStore.fetchSessionToken();
          },
        },
      })

        .state('tracker.detail.entity', {
          url: '/entity/:entityType/:entityId?searchTerm',
          templateUrl: '/assets/features/tracker/templates/entity.html',
          controller: 'TrackerEntityController',
          controllerAs: 'EntityController',
          onEnter: function($stateParams) {
            document.title = `${productName} | Search | ${$stateParams.entityId}`;
          },
          data: {
            authorizedRoles: MYAUTH_ROLE.all,
            highlightTab: 'search'
          }
        })
          .state('tracker.detail.entity.metadata', {
            url: '/summary',
            templateUrl: '/assets/features/tracker/templates/metadata.html',
            controller: 'TrackerMetadataController',
            controllerAs: 'MetadataController',
            onEnter: function($stateParams) {
              // Redirect to react page when the feature is turned on
              if (window.CaskCommon.ThemeHelper.Theme.isMetadataInReact) {
                let searchUrl = reactAppUrl.summary.replace('<namespace>', $stateParams.namespace);
                searchUrl = searchUrl.replace('<entityType>', $stateParams.entityType);
                searchUrl = searchUrl.replace('<entityId>', $stateParams.entityId);
                window.location.href = searchUrl.replace('<query>', $stateParams.searchTerm);
              } else {
                document.title = `${productName} | Search | ${$stateParams.entityId} | Summary`;
              }
            },
            data: {
              authorizedRoles: MYAUTH_ROLE.all,
              highlightTab: 'search'
            }
          })
          .state('tracker.detail.entity.lineage', {
            url: '/lineage?start&end&method',
            templateUrl: '/assets/features/tracker/templates/lineage.html',
            controller: 'TrackerLineageController',
            onEnter: function($stateParams) {
              document.title = `${productName} | Search | ${$stateParams.entityId} | Lineage`;
            },
            controllerAs: 'LineageController',
            data: {
              authorizedRoles: MYAUTH_ROLE.all,
              highlightTab: 'search'
            }
          });
  });
