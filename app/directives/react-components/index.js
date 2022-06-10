/*
 * Copyright © 2017-2019 Cask Data, Inc.
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

angular
  .module(PKG.name + '.commons')
  .directive('caskHeader', function(reactDirective) {
    return reactDirective(window.CaskCommon.AppHeader);
  })
  .directive('keyValuePairs', function(reactDirective) {
    return reactDirective(window.CaskCommon.KeyValuePairs);
  })
  .directive('keyValuePairsMaterial', function(reactDirective) {
    return reactDirective(window.CaskCommon.KeyValuePairsMaterial);
  })
  .directive('dataprep', (reactDirective) => {
    return reactDirective(window.CaskCommon.DataPrepHome);
  })
  .directive('caskResourceCenterButton', function(reactDirective) {
    return reactDirective(window.CaskCommon.ResourceCenterButton);
  })
  .directive('pipelineSummary', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineSummary);
  })
  .directive('rulesEngineHome', function(reactDirective) {
    return reactDirective(window.CaskCommon.RulesEngineHome);
  })
  .directive('pipelineNodeMetricsGraph', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineNodeMetricsGraph);
  })
  .directive('statusAlertMessage', function(reactDirective) {
    return reactDirective(window.CaskCommon.StatusAlertMessage);
  })
  .directive('loadingIndicator', function(reactDirective) {
    return reactDirective(window.CaskCommon.LoadingIndicator);
  })
  .directive('pipelineTriggersSidebars', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineTriggersSidebars);
  })
  .directive('pipelineDetailsTopPanel', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineDetailsTopPanel);
  })
  .directive('pipelineScheduler', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineScheduler);
  })
  .directive('pipelineDetailsRunLevelInfo', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineDetailsRunLevelInfo);
  })
  .directive('globalFooter', function(reactDirective) {
    return reactDirective(window.CaskCommon.Footer);
  })
  .directive('iconSvg', function(reactDirective) {
    return reactDirective(window.CaskCommon.IconSVG);
  })
  .directive('authRefresher', function(reactDirective) {
    return reactDirective(window.CaskCommon.AuthRefresher);
  })
  .directive('apiErrorDialog', function(reactDirective) {
    return reactDirective(window.CaskCommon.ApiErrorDialog);
  })
  .directive('toggleSwitch', function(reactDirective) {
    return reactDirective(window.CaskCommon.ToggleSwitch);
  })
  .directive('markdown', function(reactDirective) {
    return reactDirective(window.CaskCommon.Markdown);
  })
  .directive('codeEditor', function(reactDirective) {
    return reactDirective(window.CaskCommon.CodeEditor);
  })
  .directive('jsonEditor', function(reactDirective) {
    return reactDirective(window.CaskCommon.JSONEditor);
  })
  .directive('textBox', function(reactDirective) {
    return reactDirective(window.CaskCommon.TextBox);
  })
  .directive('number', function(reactDirective) {
    return reactDirective(window.CaskCommon.Number);
  })
  .directive('csvWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.CSVWidget);
  })
  .directive('keyValueWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.KeyValueWidget);
  })
  .directive('selectDropdown', function(reactDirective) {
    return reactDirective(window.CaskCommon.Select);
  })
  .directive('keyValueDropdownWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.KeyValueDropdownWidget);
  })
  .directive('multipleValuesWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.MultipleValuesWidget);
  })
  .directive('functionDropdownAliasWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.FunctionDropdownAlias);
  })
  .directive('toggleSwitchWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.ToggleSwitchWidget);
  })
  .directive('wranglerEditor', function(reactDirective) {
    return reactDirective(window.CaskCommon.WranglerEditor);
  })
  .directive('radioGroupWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.RadioGroupWidget);
  })
  .directive('multiSelect', function(reactDirective) {
    return reactDirective(window.CaskCommon.MultiSelect);
  })
  .directive('joinTypeWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.JoinTypeWidget);
  })
  .directive('inputFieldDropdown', function (reactDirective) {
    return reactDirective(window.CaskCommon.InputFieldDropdown);
  })
  .directive('datasetSelectorWidget', function (reactDirective) {
    return reactDirective(window.CaskCommon.DatasetSelectorWidget);
  })
  .directive('sqlConditionsWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.SqlConditionsWidget);
  })
  .directive('functionDropdownAliasWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.FunctionDropdownAlias);
  })
  .directive('sqlSelectorWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.SqlSelectorWidget);
  })
  .directive('keyValueEncodedWidget', function(reactDirective) {
    return reactDirective(window.CaskCommon.KeyValueEncodedWidget);
  })
  .directive('configurationGroup', function(reactDirective) {
    return reactDirective(window.CaskCommon.ConfigurationGroup);
  })
  .directive('widgetWrapper', function(reactDirective) {
    return reactDirective(window.CaskCommon.WidgetWrapper);
  })
  .directive('loadingSvg', function(reactDirective) {
    return reactDirective(window.CaskCommon.LoadingSVG);
  })
  .directive('pipelineContextMenu', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineContextMenu);
  })
  .directive('pluginContextMenu', function(reactDirective) {
    return reactDirective(window.CaskCommon.PluginContextMenu);
  })
  .directive('selectionBox', function(reactDirective) {
    return reactDirective(window.CaskCommon.SelectionBox);
  })
  .directive('page404', function(reactDirective){
    return reactDirective(window.CaskCommon.Page404);
  })
  .directive('page403', function(reactDirective){
    return reactDirective(window.CaskCommon.Page403);
  })
  .directive('page500', function(reactDirective){
    return reactDirective(window.CaskCommon.Page500);
  })
  .directive('previewDataView', function(reactDirective) {
    return reactDirective(window.CaskCommon.PreviewDataView);
  })
  .directive('previewLogs', function (reactDirective) {
    return reactDirective(window.CaskCommon.PreviewLogs);
  })
  .directive('schemaEditor', function(reactDirective) {
    return reactDirective(window.CaskCommon.SchemaEditor);
  })
  .directive('pluginSchemaEditor', function(reactDirective) {
    return reactDirective(window.CaskCommon.PluginSchemaEditor);
  })
  .directive('comment', function(reactDirective) {
    return reactDirective(window.CaskCommon.Comment);
  })
  .directive('pipelineCommentsActionBtn', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineCommentsActionBtn);
  })
  .directive('connectionsBrowser', function (reactDirective) {
    return reactDirective(window.CaskCommon.Connections);
  })
  .directive('sidePanel', function (reactDirective) {
    return reactDirective(window.CaskCommon.SidePanel);
  })
  .directive('topPanelReact', function(reactDirective) {
    return reactDirective(window.CaskCommon.TopPanelReact);
  })
  .directive('pipelineCanvasActionBtns', function(reactDirective) {
    return reactDirective(window.CaskCommon.PipelineCanvasActionBtns);
  })
  