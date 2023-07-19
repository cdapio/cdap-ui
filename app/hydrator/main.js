/*
 * Copyright © 2015-2018 Cask Data, Inc.
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
// const angular = require('angular');
// const ngAnimate = require('angular-animate');
// const ngSanitize = require('angular-sanitize');
// const $cookies = require('angular-cookies');
// const ngResource = require('angular-resource');
// import { UI_ROUTER_REACT_HYBRID } from '@uirouter/react-hybrid';

import '../styles/common.less';
import '../styles/themes/cdap/buttons.less';
import '../styles/themes/cdap/header.less';
import '../styles/themes/cdap/mixins.less';
import '../styles/themes/cdap/tabs.less';
import '../styles/themes/cdap/theme.less';
import '../styles/themes/cdap.less';
import '../directives/app-level-loading-icon/loading.less';
import '../directives/cask-angular-dropdown-text-combo/dropdown-text-combo.less';
import '../directives/cask-angular-json-edit/jsonedit.less';
import '../directives/cask-angular-sortable/sortable.less';
import '../directives/complex-schema/complex-schema.less';
import '../directives/dag-minimap/dag-minimap.less';
import '../directives/dag-plus/color-constants.less';
import '../directives/dag-plus/my-dag.less';
import '../directives/datetime-picker/datetime.less';
import '../directives/datetime-range/datetime-range.less';
import '../directives/fileselect/fileselect.less';
import '../directives/group-side-panel/group-side-panel.less';
import '../directives/macro-widget-toggle/macro-widget-toggle.less';
import '../directives/my-link-button/my-link-button.less';
import '../directives/my-pipeline-configurations/my-pipeline-configurations.less';
import '../directives/my-pipeline-runtime-args/my-pipeline-runtime-args.less';
import '../directives/my-pipeline-summary/my-pipeline-summary.less';
import '../directives/my-popover/my-popover.less';
import '../directives/my-post-run-action-wizard/my-post-run-action-wizard-modal.less';
import '../directives/my-post-run-action-wizard/my-post-run-action-wizard.less';
import '../directives/my-post-run-action-wizard/wizard-configure-confirm-step/wizard-configure-confirm-step.less';
import '../directives/my-post-run-action-wizard/wizard-select-action-step/wizard-select-action-step.less';
import '../directives/my-post-run-actions/my-post-run-actions.less';
import '../directives/node-metrics/node-metrics.less';
import '../directives/plugin-functions/functions/get-property-value/get-property-value.less';
import '../directives/plugin-functions/functions/get-schema/get-schema.less';
import '../directives/plugin-functions/functions/output-schema/output-schema.less';
import '../directives/plugin-templates/plugin-templates.less';
import '../directives/splitter-popover/splitter-popover.less';
import '../directives/timestamp-picker/timestamp.less';
import '../directives/validators/validators.less';
import '../directives/widget-container/widget-complex-schema-editor/widget-complex-schema-editor.less';
import '../directives/widget-container/widget-container.less';
import '../directives/widget-container/widget-ds-multiplevalues/widget-ds-multiplevalues.less';
import '../directives/widget-container/widget-dsv/widget-dsv.less';
import '../directives/widget-container/widget-function-dropdown-with-alias/widget-function-dropdown-with-alias.less';
import '../directives/widget-container/widget-input-schema/widget-input-schema.less';
import '../directives/widget-container/widget-join-types/widget-join-types.less';
import '../directives/widget-container/widget-js-editor/widget-js-editor.less';
import '../directives/widget-container/widget-json-editor/widget-json-editor.less';
import '../directives/widget-container/widget-keyvalue/widget-keyvalue.less';
import '../directives/widget-container/widget-keyvalue-encoded/widget-keyvalue-encoded.less';
import '../directives/widget-container/widget-multi-select-dropdown/widget-multi-select-dropdown.less';
import '../directives/widget-container/widget-number/widget-number.less';
import '../directives/widget-container/widget-password/widget-password.less';
import '../directives/widget-container/widget-radio-group/widget-radio-group.less';
import '../directives/widget-container/widget-rulesengine-editor/rules-engine-modal.less';
import '../directives/widget-container/widget-schema-editor/widget-schema-editor.less';
import '../directives/widget-container/widget-sql-conditions/widget-sql-conditions.less';
import '../directives/widget-container/widget-sql-select-fields/widget-sql-select-fields.less';
import '../directives/widget-container/widget-textarea-validate/widget-textarea-validate.less';
import '../directives/widget-container/widget-toggle-switch/widget-toggle-switch.less';
import '../directives/widget-container/widget-wrangler-directives/widget-wrangler-directive.less';
import '../directives/widget-container/widget-wrangler-directives/wrangler-modal.less';
import '../hydrator/adapters.less';
import '../hydrator/bottompanel.less';
import '../hydrator/hydrator-modal.less';
import '../hydrator/leftpanel.less';
import '../hydrator/toppanel.less';
import '../styles/bootstrap.less';


const CaskCommon = require('../common/cask-shared-components');
if (!window.CaskCommon) {
  window.CaskCommon = CaskCommon;
}

const uuid = require('uuid');
window.uuid = uuid;



angular
  .module(PKG.name, [

    angular.module(PKG.name +'.features', [
      PKG.name+'.feature.hydrator',
    ]).name,

    angular.module(PKG.name+'.commons', [

      angular.module(PKG.name+'.services', [
        'ngAnimate',
        'ngSanitize',
        'ngResource',
        'ngStorage',
        // [
          'ui.router',
        // UI_ROUTER_REACT_HYBRID],
        'ngCookies'
      ]).name,

      angular.module(PKG.name+'.filters', [
        PKG.name+'.services'
      ]).name,
      'mgcrea.ngStrap.datepicker',
      'mgcrea.ngStrap.timepicker',

      'mgcrea.ngStrap.core',
      'mgcrea.ngStrap.helpers.dimensions',

      'mgcrea.ngStrap.alert',

      'mgcrea.ngStrap.popover',
      'mgcrea.ngStrap.dropdown',
      'mgcrea.ngStrap.typeahead',
      'mgcrea.ngStrap.select',
      'mgcrea.ngStrap.collapse',

      // 'mgcrea.ngStrap.modal',
      'ui.bootstrap.modal',
      'ui.bootstrap',

      'mgcrea.ngStrap.modal',

      // 'ncy-angular-breadcrumb',
      'angularMoment',
      'ui.ace',
      'gridster',
      'angular-cron-jobs',
      'angularjs-dropdown-multiselect',
      'hc.marked',
      'ngFileSaver',
      'infinite-scroll',
      'react'
    ]).name,

    'angular-loading-bar'
  ])
  .value('THROTTLE_MILLISECONDS', 1000) // throttle infinite scroll

  .run(function ($rootScope, $state, $stateParams) {
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // for debugging... or to trigger easter eggs?
    window.$go = $state.go;
  })

  .run(function() {
    window.CaskCommon.ThemeHelper.applyTheme();
  })

  .config(function (MyDataSourceProvider) {
    MyDataSourceProvider.defaultInterval = 5;
  })

  .config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
  })

  .run(function ($rootScope) {
    $rootScope.defaultPollInterval = 10000;
  })
  .run(function($rootScope, myHelpers, MYAUTH_EVENT) {
    $rootScope.$on(MYAUTH_EVENT.logoutSuccess, function() {
      window.location.href = myHelpers.getAbsUIUrl({
        uiApp: 'login',
        redirectUrl: location.pathname,
        clientId: 'hydrator'
      });
    });
  })

  .run(function(myNamespace) {
    myNamespace.getList();
  })
  // http provider no longer worked
  // .config(function($httpProvider) {
  //   $httpProvider.interceptors.push(function($rootScope, myHelpers) {
  //     return {
  //       'request': function(config) {
  //         var extendConfig = {
  //           headers: {
  //             'X-Requested-With': 'XMLHttpRequest',
  //           }
  //         };
  //         if (
  //             $rootScope.currentUser && !myHelpers.objectQuery(config, 'data', 'profile_view')
  //            ) {

  //           config = angular.extend(config, extendConfig, {
  //             user: $rootScope.currentUser || null,
  //             headers: {
  //               'Content-Type': 'application/json',
  //             }
  //           });

  //           // This check is added because of HdInsight gateway security.
  //           // If we set Authorization to null, it strips off their Auth token
  //           if (window.CDAP_CONFIG.securityEnabled && $rootScope.currentUser.token) {
  //             // Accessing stuff from $rootScope is bad. This is done as to resolve circular dependency.
  //             // $http <- myAuthPromise <- myAuth <- $http <- $templateFactory <- $view <- $state
  //             extendConfig.headers.Authorization = 'Bearer ' + $rootScope.currentUser.token;
  //           }

  //           extendConfig.headers.sessionToken = window.CaskCommon.SessionTokenStore.default.getState();
  //         }
  //         angular.extend(config, extendConfig);
  //         return config;
  //       }
  //     };
  //   });
  // })

  .config(function ($alertProvider) {
    angular.extend($alertProvider.defaults, {
      animation: 'am-fade-and-scale',
      container: '#alerts',
      duration: false
    });
  })

  .config(function ($uibTooltipProvider) {
    $uibTooltipProvider.setTriggers({
      'customShow': 'customHide'
    });
  })

  .config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(
      /^\s*(https?|ftp|mailto|tel|file|blob):/
    );

    /* !! DISABLE DEBUG INFO !! */
  })

  .config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })

  .config(function (caskThemeProvider) {
    caskThemeProvider.setThemes([
      'cdapb'  // customized theme
    ]);
  })

  .config(['markedProvider', function (markedProvider) {
    markedProvider.setOptions({
      gfm: true,
      tables: true
    });
  }])

  .run(function() {
    window.CaskCommon.StatusFactory.startPollingForBackendStatus();
  })

  .run(function (MYSOCKET_EVENT, myAlert, EventPipe) {

    EventPipe.on(MYSOCKET_EVENT.message, function (data) {
      if (data.statusCode > 399 && !data.resource.suppressErrors) {
        myAlert({
          title: data.statusCode.toString(),
          content: data.response || 'Server had an issue, please try refreshing the page',
          type: 'danger'
        });
      }

      // The user doesn't need to know that the backend node
      // is unable to connect to CDAP. Error messages add no
      // more value than the pop showing that the FE is waiting
      // for system to come back up. Most of the issues are with
      // connect, other than that pass everything else to user.
      if (data.warning && data.error.syscall !== 'connect') {
        myAlert({
          content: data.warning,
          type: 'warning'
        });
      }
    });
  })

  