/*
 * Copyright © 2015 Cask Data, Inc.
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

/**
 * The format of vm.validationFields:
 *
 * vm.validationFields = {
 *   <field name>:[
 *     {
 *       "fieldName": "<field name>",
 *       "operation": true/false,
 *       "validation": "<validator classname>.<function name>"
 *       "arguments": {
 *         "<argument 1>": <value 1>,
 *         "<argument 2>": <value 2>,
 *         ...
 *       }
 *     },
 *     ...
 *   ]
 * }
 **/
import jsbeautify from 'js-beautify';

angular.module(PKG.name + '.commons')
  .controller('MyValidatorsCtrl', function($scope, myHydratorValidatorsApi, EventPipe, HydratorPlusPlusConfigStore, myHelpers, NonStorePipelineErrorFactory, GLOBALS, HydratorPlusPlusHydratorService, ValidatorFactory) {
    var vm = this;

    vm.validators = [];
    vm.isRule = true;
    vm.validationFields = $scope.model.validationFields || {};
    vm.functionMap = {};
    vm.nodeLabelError = '';

    var validatorsList;
    var classNameList = [];
    // We just need to set the input schema as the output schema
    try {
      $scope.inputSchema = JSON.parse($scope.inputSchema[0].schema);
    } catch(e) {
      $scope.inputSchema = {fields: []};
    }
    $scope.outputSchema = HydratorPlusPlusHydratorService.formatOutputSchema($scope.inputSchema.fields);

    myHydratorValidatorsApi.get()
      .$promise
      .then(function (res) {
        delete res.$promise;
        delete res.$resolved;

        validatorsList = Object.keys(res).join(', ');

        angular.forEach(res, function (value, key) {
          classNameList.push(value.classname);

          angular.forEach(value.functions, function (v) {
            v.className = value.classname;
            v.validator = key;
            v.validationKey = v.className + '.' + v.name;
            v.displayName = v.name + ' (' + key + ')';
            vm.functionMap[v.validationKey] = v;
          });
          vm.validators = vm.validators.concat(value.functions);
        });

        if (!$scope.model.validationFields) {
          vm.validationFields = ValidatorFactory.initValidationFields($scope.model.properties, vm.functionMap);
        }

        if (!$scope.isDisabled) {
          $scope.$watch(function () {
            return vm.validationFields;
          }, formatValidationRules, true);
        }

      });

    vm.addFieldGroup = function (fieldName) {
      if (vm.validationFields[fieldName]) { return; }
      vm.validationFields[fieldName] = [];
    };

    vm.removeFieldGroup = function (fieldName) {
      vm.validationFields[fieldName].splice(0, vm.validationFields[fieldName].length);
      delete vm.validationFields[fieldName];
    };

    vm.addRule = function (fieldName) {
      vm.validationFields[fieldName].push({
        fieldName: fieldName,
        operation: true // true === 'AND'
      });
    };

    vm.removeRule = function (fieldName, rule) {
      var index = vm.validationFields[fieldName].indexOf(rule);
      vm.validationFields[fieldName].splice(index, 1);
    };


    function formatValidationRules() {
      if (Object.keys(vm.validationFields).length === 0) { return; }

      var conditions = '';
      var flattenRulesArrays = [];

      angular.forEach(vm.validationFields, function (value) {
        flattenRulesArrays = flattenRulesArrays.concat(value);
      });

      // this will get triggered when user switch the validation rule
      function deleteArguments (value, key) {
        if (validation.arguments.indexOf(key) === -1) {
          delete field.arguments[key];
        }
      }

      /**
       * This block code will go from the last property. It will create an
       * If/Else block. If the next item in the array has AND operation, it
       * will put the current condition in IF block. For OR, it will put the
       * current condition in ELSE block.
       **/
      for (var i = flattenRulesArrays.length - 1; i >= 0; i--) {
        var field = flattenRulesArrays[i];

        // skipping the property if there is no function assigned for the property
        if (!field.fieldName || !field.validation) { continue; }

        // skipping if the required arguments have not been set
        var validation = vm.functionMap[field.validation];
        if (validation.arguments.length > 1 &&
          (!field.arguments || Object.keys(field.arguments).length !== validation.arguments.length - 1)) {
          continue;
        }

        if (field.arguments) {
          angular.forEach(field.arguments, deleteArguments);
        }

        var emessage = validation.emessage || '';
        emessage = emessage.replace(/<field:1>/g, '" + input.' + field.fieldName + ' + "');

        var currentBlock = '';

        currentBlock = 'if (' +
          validation.className + '.' +
          validation.name + '(';

        /*jshint -W083 */
        angular.forEach(validation.arguments, function (val, $index) {
          if ($index !== 0) {
            currentBlock += ', ';
          }
          if (val === '<field:1>') {
            currentBlock += 'input.' + field.fieldName;
          } else {
            currentBlock += field.arguments[val];
          }

          if (val.startsWith('<field') && val !== '<field:1>') {
            var re = new RegExp(val, 'g');
            emessage = emessage.replace(re, '" + input.' +
              field.arguments[val] + ' + "');
          }

        });

        if (i === flattenRulesArrays.length - 1 || flattenRulesArrays[i + 1].operation) {
          currentBlock += ')) {\n' +
            conditions +
            '} else {\n' +
            'isValid = false;\n' +
            'errMsg = "' + emessage + '";\n' +
            'errCode = ' + validation.ecode + ';\n' +
            '}\n';

        } else { // if operation === 'OR'
          currentBlock += ')) {\n} else {\n' +
            conditions + '\n}\n';
        }

        conditions = currentBlock;
      }

      conditions += '\n';

      var initFn = 'function isValid(input, context) {\n' +
        'var isValid = true;\n' +
        'var errMsg = "";\n' +
        'var errCode = 0;\n';

      // LOAD CONTEXT
      var context = '';
      angular.forEach(classNameList, function (className) {
        context = context + 'var ' + className +
          ' = context.getValidator("' + className + '");\n';
      });


      var loggerLoad = 'var logger = context.getLogger();\n\n';
      var loggerEnd = 'if (!isValid) {\n' +
        'var message = "(" + errCode + ") " + errMsg;\n' +
        'logger.warn("Validation failed with error {}", message);\n' +
        '}\n\n';


      var fn = initFn + context +
        loggerLoad + conditions +
        loggerEnd +
        'return {\n' +
        '"isValid": isValid,\n' +
        '"errorCode": errCode,\n' +
        '"errorMsg": errMsg\n' +
        '};\n}\n';


      var validatorProperties = {
        validators: validatorsList,
        validationScript: jsbeautify(fn, { indent_size: 2 })
      };

      if ($scope.model.properties !== validatorProperties) {
        $scope.model.properties = validatorProperties;
      }
      if ($scope.model.validationFields !== vm.validationFields) {
        $scope.model.validationFields = vm.validationFields;
      }

    }

    function validateNodesLabels () {
      var nodes = HydratorPlusPlusConfigStore.getNodes();
      var nodeName = $scope.model.label;

      if (!nodeName) {
        return;
      }
      NonStorePipelineErrorFactory.isNodeNameUnique(nodeName, nodes, function (err) {
        if (err) {
          vm.nodeLabelError = GLOBALS.en.hydrator.studio.error[err];
        } else {
          vm.nodeLabelError = '';
        }
      });
    }

    $scope.$watch('model.label', validateNodesLabels);

    // Since validation fields is a reference and we overwrite the array
    // reference all the time $watch will not be triggered hence the event communication.
    EventPipe.on('resetValidatorValidationFields', function(validationFields) {
      vm.validationFields = validationFields || {};
      $scope.model.validationFields = vm.validationFields;
    });
  });
