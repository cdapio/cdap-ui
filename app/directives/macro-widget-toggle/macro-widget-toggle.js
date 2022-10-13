/*
 * Copyright © 2017 - 2018 Cask Data, Inc.
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

function MacroWidgetToggleController(myHelpers, $timeout, $scope, HydratorPlusPlusHydratorService) {
  let vm = this;

  vm.isMacro = false;

  let timeout;
  vm.editorTypeWidgets = [
    'scala-editor',
    'javascript-editor',
    'python-editor',
    'sql-editor',
  ];

  vm.otherAceEditorWidgets = [
    'wrangler-directives',
    'textarea',
  ];

  vm.containsMacro = false;

  // This function will check if the entire value is a macro.
  // If it is, then change to macro editor.
  // If the value is only partially a macro, only show the background indicator.
  function checkMacro(value) {
    if (!value || !value.length) { return false; }

    let beginChar = value.indexOf('${') === 0;
    let endingChar = value.charAt(value.length - 1) === '}';

    vm.containsMacro = HydratorPlusPlusHydratorService.containsMacro(value);

    return beginChar && endingChar;
  }

  vm.toggleMacro = () => {
    if (vm.disabled) { return; }

    let newValue = !vm.isMacro;
    let propertyValue = myHelpers.objectQuery(vm.node, 'plugin', 'properties', vm.field.name);

    if (!newValue) {
      vm.node.plugin.properties[vm.field.name] = '';
      vm.containsMacro = false;
    } else if (!HydratorPlusPlusHydratorService.containsMacro(propertyValue)) {
      vm.node.plugin.properties[vm.field.name] = '${}';

      $timeout.cancel(timeout);
      timeout = $timeout(() => {
        let elem = document.getElementById(`macro-input-${vm.field.name}`);
        angular.element(elem)[0].focus();

        if (elem.createRange) {
          let range = elem.createRange();
          range.move('character', 2);
          range.select();
        } else {
          elem.setSelectionRange(2, 2);
        }
      });
    }

    vm.isMacro = newValue;
  };

  function init() {
    // check if value is macro or not. If it is, set isMacro to true
    let propertyValue = myHelpers.objectQuery(vm.node, 'plugin', 'properties', vm.field.name);

    let isMacroSupported = myHelpers.objectQuery(vm, 'node', '_backendProperties', vm.field.name, 'macroSupported');

    if (isMacroSupported) {
      vm.isMacro = checkMacro(propertyValue);
    }
  }

  vm.onChange = (value) => {
    vm.node.plugin.properties[vm.field.name] = value;
  };
  init();

  $scope.$on('$destroy', () => {
    $timeout.cancel(timeout);
  });
}

angular.module(PKG.name + '.commons')
  .directive('macroWidgetToggle', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'macro-widget-toggle/macro-widget-toggle.html',
      bindToController: true,
      scope: {
        node: '=',
        field: '=',
        disabled: '='
      },
      controller: MacroWidgetToggleController,
      controllerAs: 'MacroWidget'
    };
  });
