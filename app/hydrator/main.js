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

console.time(PKG.name);

angular
  .module(PKG.name, [

    angular.module(PKG.name+'.features', [
      PKG.name+'.feature.hydrator',
    ]).name,

    angular.module(PKG.name+'.commons', [

      angular.module(PKG.name+'.services', [
        'ngAnimate',
        'ngSanitize',
        'ngResource',
        'ngStorage',
        'ui.router',
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

      'ncy-angular-breadcrumb',
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
  .run(function($rootScope, MY_CONFIG, myAuth, MYAUTH_EVENT) {
    $rootScope.$on('$stateChangeStart', function () {
      if (MY_CONFIG.securityEnabled) {
        if (!myAuth.isAuthenticated()) {
          $rootScope.$broadcast(MYAUTH_EVENT.logoutSuccess);
        }
      }
    });
  })
  .run(function($rootScope, myHelpers, MYAUTH_EVENT) {
    $rootScope.$on(MYAUTH_EVENT.logoutSuccess, function() {
      window.location.href = myHelpers.getAbsUIUrl({
        uiApp: 'login',
        redirectUrl: location.href,
        clientId: 'hydrator'
      });
    });
  })

  .run(function(myNamespace) {
    myNamespace.getList();
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($rootScope, myHelpers) {
      return {
        'request': function(config) {
          var extendConfig = {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            }
          };
          if (
              $rootScope.currentUser && !myHelpers.objectQuery(config, 'data', 'profile_view')
             ) {

            config = angular.extend(config, extendConfig, {
              user: $rootScope.currentUser || null,
              headers: {
                'Content-Type': 'application/json',
              }
            });

            // This check is added because of HdInsight gateway security.
            // If we set Authorization to null, it strips off their Auth token
            if (window.CDAP_CONFIG.securityEnabled && $rootScope.currentUser.token) {
              // Accessing stuff from $rootScope is bad. This is done as to resolve circular dependency.
              // $http <- myAuthPromise <- myAuth <- $http <- $templateFactory <- $view <- $state
              extendConfig.headers.Authorization = 'Bearer ' + $rootScope.currentUser.token;
            }

            extendConfig.headers.sessionToken = window.CaskCommon.SessionTokenStore.default.getState();
          }
          angular.extend(config, extendConfig);
          return config;
        }
      };
    });
  })

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
      'cdap'  // customized theme
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

  /**
   * BodyCtrl
   * attached to the <body> tag, mostly responsible for
   *  setting the className based events from $state and caskTheme
   */
  .controller('BodyCtrl', function ($scope, $cookies, $cookieStore, caskTheme, CASK_THEME_EVENT, $rootScope, $state, $log, MYSOCKET_EVENT, MyCDAPDataSource, MY_CONFIG, MYAUTH_EVENT, EventPipe, myAuth, $window, myAlertOnValium, myLoadingService, myHelpers, $http) {
    window.CaskCommon.CDAPHelpers.setupExperiments();
    var activeThemeClass = caskTheme.getClassName();
    getVersion();
    $rootScope.stores = window.ReactStores;
    this.eventEmitter = window.CaskCommon.ee(window.CaskCommon.ee);
    this.pageLevelError = null;
    this.apiError = false;
    const {globalEvents} = window.CaskCommon;

    this.eventEmitter.on(globalEvents.NONAMESPACE, () => {
      this.pageLevelError = {
        errorCode: 403
      };
    });
    this.eventEmitter.on(globalEvents.PAGE_LEVEL_ERROR, (error) => {
      // If we already have no namespace error thrown it trumps all other 404s
      // and UI should show that the user does not have access to the namespace
      // instead of specific 404s which will be misleading.
      if (this.pageLevelError && this.pageLevelError.errorCode === 403) {
        return;
      }
      if (error.reset === true) {
        this.pageLevelError = null;
      }
      else {
        this.pageLevelError = myHelpers.handlePageLevelError(error);
      }
    });
    this.eventEmitter.on(globalEvents.API_ERROR, (hasError) => {
      if (this.apiError !== hasError) {
        this.apiError = true;
      }
    });

    $scope.copyrightYear = new Date().getFullYear();

    function getVersion() {
      $http({
        method: 'GET',
        url: '/api/v3/version'
      })
        .then(function(res) {
          var data = res.data;

          $scope.version = data.version;
          $rootScope.cdapVersion = $scope.version;

          window.CaskCommon.VersionStore.dispatch({
            type: window.CaskCommon.VersionActions.updateVersion,
            payload: {
              version: data.version
            }
          });
        });
    }

    $scope.$on(CASK_THEME_EVENT.changed, function (event, newClassName) {
      if (!event.defaultPrevented) {
        $scope.bodyClass = $scope.bodyClass.replace(activeThemeClass, newClassName);
        activeThemeClass = newClassName;
      }
    });
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      var classes = [];
      if (toState.data && toState.data.bodyClass) {
        classes = [toState.data.bodyClass];
      }
      else {
        var parts = toState.name.split('.'),
            count = parts.length + 1;
        while (1<count--) {
          classes.push('state-' + parts.slice(0,count).join('-'));
        }
      }
      if (toState.name !== fromState.name && myAlertOnValium.isAnAlertOpened()) {
        myAlertOnValium.destroy();
      }
      classes.push(activeThemeClass);

      $scope.bodyClass = classes.join(' ');

      myLoadingService.hideLoadingIcon();

      /**
       *  This is to make sure that the sroll position goes back to the top when user
       *  change state. UI Router has this function ($anchorScroll), but for some
       *  reason it is not working.
       **/
      $window.scrollTo(0, 0);
    });

    EventPipe.on(MYSOCKET_EVENT.reconnected, function () {
      $log.log('[DataSource] reconnected.');
      myLoadingService.hideLoadingIcon();
    });

    console.timeEnd(PKG.name);
  }).directive('initStores', function() {
    return {
      restrict: 'E',
      scope: {
        stores: '=',
      },
      bindToController: true,
      controller: 'BodyCtrl as BodyCtrl',
      template: `
        <my-global-navbar></my-global-navbar>
        <main class="container" id="app-container">
          <div ng-if="!BodyCtrl.pageLevelError" ui-view></div>
          <page403
            ng-if="BodyCtrl.pageLevelError && BodyCtrl.pageLevelError.errorCode === 403"
            message="BodyCtrl.pageLevelError.message"
          ></page403>
          <page404
            ng-if="BodyCtrl.pageLevelError && BodyCtrl.pageLevelError.errorCode === 404"
            message="BodyCtrl.pageLevelError.message"
          ></page404>
          <page500
            ng-if="BodyCtrl.pageLevelError && BodyCtrl.pageLevelError.errorCode === 500"
            message="BodyCtrl.pageLevelError.message"
          ></page500>
        </main>

        <div class="alerts" id="alerts" data-cy="valium-banner-hydrator"></div>
        <loading-icon></loading-icon>
        <loading-indicator></loading-indicator>
        <status-alert-message></status-alert-message>
        <global-footer></global-footer>
        <auth-refresher></auth-refresher>
        <api-error-dialog ng-if="BodyCtrl.apiError"></api-error-dialog>
      `
    };
  });
