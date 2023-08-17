/*
 * Copyright © 2016-2021 Cask Data, Inc.
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

import T from 'i18n-react';

T.setTexts(require('../cdap/text/text-en.yaml'));
// calling react from the below component
// import useReact from '../cdap/components/hydrator/react-loader';
if (
  window.location.href.indexOf('/metadata/') === -1 &&
  window.location.href.indexOf('/pipelines/') !== -1
) {
  require('../cdap/components/hydrator/react-loader');
}

import Store from '../cdap/services/NamespaceStore';
const validateNamespace = require('../cdap/services/NamespaceStore')
  .validateNamespace;
const NameSpaceStoreActions = require('../cdap/services/NamespaceStore/NamespaceActions')
  .default;
const ResourceCenterButton = require('../cdap/components/ResourceCenterButton')
  .default;
const DataPrepHome = require('../cdap/components/DataPrepHome').default;
const DataPrepHelper = require('../cdap/components/DataPrep/helper');
const globalEvents = require('../cdap/services/global-events').default;
const ee = require('event-emitter');
const VersionStore = require('../cdap/services/VersionStore').default;
const VersionActions = require('../cdap/services/VersionStore/VersionActions')
  .default;
const Version = require('../cdap/services/VersionRange/Version').default;
const VersionRange = require('../cdap/services/VersionRange').default;
const VersionUtilities = require('../cdap/services/VersionRange/VersionUtilities');
const KeyValuePairs = require('../cdap/components/shared/KeyValuePairs')
  .default;
const KeyValuePairsMaterial = require('../cdap/components/PipelineDetails/PipelineRuntimeArgsDropdownBtn/RuntimeArgsKeyValuePairWrapper/RuntimeArgsPairsMaterial.tsx')
  .default;
const KeyValueStore = require('../cdap/components/shared/KeyValuePairs/KeyValueStore')
  .default;
const KeyValueStoreActions = require('../cdap/components/shared/KeyValuePairs/KeyValueStoreActions')
  .default;
const PipelineSummary = require('../cdap/components/PipelineSummary').default;
const PipelineNodeMetricsGraph = require('../cdap/components/PipelineNodeGraphs/PipelineNodeMetricsGraph')
  .default;
const CDAPHelpers = require('../cdap/services/helpers');
const RulesEngineHome = require('../cdap/components/RulesEngineHome').default;
const Mousetrap = require('mousetrap');
const StatusFactory = require('../cdap/services/StatusFactory').default;
const LoadingIndicator = require('../cdap/components/shared/LoadingIndicator')
  .default;
const StatusAlertMessage = require('../cdap/components/shared/StatusAlertMessage')
  .default;
const PipelineTriggersSidebars = require('../cdap/components/PipelineTriggersSidebars/index.tsx')
  .default;
const TriggeredPipelineStore = require('../cdap/components/TriggeredPipelines/store/TriggeredPipelineStore')
  .default;
const PipelineErrorFactory = require('../cdap/services/PipelineErrorFactory');
const GLOBALS = require('../cdap/services/global-constants').GLOBALS;
const PROGRAM_STATUSES = require('../cdap/services/global-constants')
  .PROGRAM_STATUSES;
const HYDRATOR_DEFAULT_VALUES = require('../cdap/services/global-constants')
  .HYDRATOR_DEFAULT_VALUES;
const StatusMapper = require('../cdap/services/StatusMapper').default;
const PipelineDetailStore = require('../cdap/components/PipelineDetails/store')
  .default;
const PipelineDetailActionCreator = require('../cdap/components/PipelineDetails/store/ActionCreator');
const PipelineDetailsTopPanel = require('../cdap/components/PipelineDetails/PipelineDetailsTopPanel')
  .PipelineDetailsTopPanel;
const PipelineScheduler = require('../cdap/components/PipelineScheduler')
  .default;
const AvailablePluginsStore = require('../cdap/services/AvailablePluginsStore')
  .default;
const AVAILABLE_PLUGINS_ACTIONS = require('../cdap/services/AvailablePluginsStore')
  .AVAILABLE_PLUGINS_ACTIONS;
const PipelineDetailsRunLevelInfo = require('../cdap/components/PipelineDetails/RunLevelInfo')
  .default;
const MetricsQueryHelper = require('../cdap/services/MetricsQueryHelper')
  .default;
const PipelineMetricsStore = require('../cdap/services/PipelineMetricsStore')
  .default;
const PipelineMetricsActionCreator = require('../cdap/services/PipelineMetricsStore/ActionCreator');
const PipelineConfigurationsActionCreator = require('../cdap/components/PipelineConfigurations/Store/ActionCreator');
const ThemeHelper = require('../cdap/services/ThemeHelper');
const Footer = require('../cdap/components/shared/Footer').default;
const cdapavscwrapper = require('../cdap/services/cdapavscwrapper').default;
const IconSVG = require('../cdap/components/shared/IconSVG').default;
const PipelineConfigConstants = require('../cdap/components/PipelineConfigurations/PipelineConfigConstants');
const AuthRefresher = require('../cdap/components/AuthRefresher').default;
const ToggleSwitch = require('../cdap/components/shared/ToggleSwitch').default;
const ApiErrorDialog = require('../cdap/components/shared/ApiErrorDialog')
  .default;
const PipelineList = require('../cdap/components/PipelineList').default;
const AppHeader = require('../cdap/components/shared/AppHeader').default;
const Markdown = require('../cdap/components/shared/Markdown').default;
const CodeEditor = require('../cdap/components/AbstractWidget/CodeEditorWidget')
  .default;
const JSONEditor = require('../cdap/components/shared/CodeEditor/JSONEditor')
  .default;
const TextBox = require('../cdap/components/AbstractWidget/FormInputs/TextBox')
  .default;
const Number = require('../cdap/components/AbstractWidget/FormInputs/Number')
  .default;
const CSVWidget = require('../cdap/components/AbstractWidget/CSVWidget')
  .default;
const KeyValueWidget = require('../cdap/components/AbstractWidget/KeyValueWidget')
  .default;
const Select = require('../cdap/components/AbstractWidget/FormInputs/Select')
  .default;
const KeyValueDropdownWidget = require('../cdap/components/AbstractWidget/KeyValueDropdownWidget')
  .default;
const MultipleValuesWidget = require('../cdap/components/AbstractWidget/MultipleValuesWidget')
  .default;
const PluginConnectionBrowser = require('../cdap/components/DataPrepConnections/PluginConnectionBrowser')
  .default;
const FunctionDropdownAlias = require('../cdap/components/AbstractWidget/FunctionDropdownAliasWidget')
  .default;
const ToggleSwitchWidget = require('../cdap/components/AbstractWidget/ToggleSwitchWidget')
  .default;
const WranglerEditor = require('../cdap/components/AbstractWidget/WranglerEditor')
  .default;
const RadioGroupWidget = require('../cdap/components/AbstractWidget/RadioGroupWidget')
  .default;
const MultiSelect = require('../cdap/components/AbstractWidget/FormInputs/MultiSelect')
  .default;
const JoinTypeWidget = require('../cdap/components/AbstractWidget/JoinTypeWidget')
  .default;
const InputFieldDropdown = require('../cdap/components/AbstractWidget/InputFieldDropdown')
  .default;
const DatasetSelectorWidget = require('../cdap/components/AbstractWidget/DatasetSelectorWidget')
  .default;
const SqlConditionsWidget = require('../cdap/components/AbstractWidget/SqlConditionsWidget')
  .default;
const SqlSelectorWidget = require('../cdap/components/AbstractWidget/SqlSelectorWidget')
  .default;
const KeyValueEncodedWidget = require('../cdap/components/AbstractWidget/KeyValueWidget/KeyValueEncodedWidget')
  .default;
const SessionTokenStore = require('../cdap/services/SessionTokenStore');
const ConfigurationGroup = require('../cdap/components/shared/ConfigurationGroup')
  .default;
const WidgetWrapper = require('../cdap/components/shared/ConfigurationGroup/WidgetWrapper')
  .WrappedWidgetWrapper;
const ConfigurationGroupUtilities = require('../cdap/components/shared/ConfigurationGroup/utilities');
const DynamicFiltersUtilities = require('../cdap/components/shared/ConfigurationGroup/utilities/DynamicPluginFilters');
const LoadingSVG = require('../cdap/components/shared/LoadingSVG').default;
const DateTimeWidget = require('../cdap/components/AbstractWidget/DateTimeWidget')
  .default;
const DateRangeWidget = require('../cdap/components/AbstractWidget/DateRangeWidget')
  .default;
const PipelineContextMenu = require('../cdap/components/PipelineContextMenu')
  .default;
const PluginContextMenu = require('../cdap/components/PluginContextMenu')
  .default;
const SelectionBox = require('../cdap/components/shared/SelectionBox').default;
const Clipboard = require('../cdap/services/Clipboard');
const Page404 = require('../cdap/components/404').default;
const Page500 = require('../cdap/components/500').default;
const Page403 = require('../cdap/components/AuthorizationErrorMessage').default;
const WindowManager = require('../cdap/services/WindowManager').default;
const {
  WINDOW_ON_FOCUS,
  WINDOW_ON_BLUR,
} = require('../cdap/services/WindowManager');
const PREVIEW_STATUS = require('../cdap/services/PreviewStatus').PREVIEW_STATUS;
const DownloadFile = require('../cdap/services/download-file').default;
const PreviewUtilities = require('../cdap/components/PreviewData/utilities');
const PreviewDataView = require('../cdap/components/PreviewData').default;
const PreviewLogs = require('../cdap/components/PreviewLogs').default;
const SchemaEditor = require('../cdap/components/AbstractWidget/SchemaEditor')
  .SchemaEditor;
const PluginSchemaEditor = require('../cdap/components/PluginSchemaEditor')
  .PluginSchemaEditor;
const ALERT_STATUS = require('../cdap/services/AlertStatus').ALERT_STATUS;
const Comment = require('../cdap/components/AbstractWidget/Comment').default;
const PipelineCommentsActionBtn = require('../cdap/components/PipelineCanvasActions/PipelineCommentsActionBtn')
  .default;
const Connections = require('../cdap/components/Connections').default;
const LeftPanelReact = require('../cdap/components/hydrator/components/LeftPanel/LeftPanel')
  .LeftPanel;
const PipelineCanvasActionBtns = require('../cdap/components/PipelineCanvasActions/ActionButtons/PipelineCanvasActionBtns')
  .PipelineCanvasActionBtns;
const TopPanelReact = require('../cdap/components/hydrator/components/TopPanel/TopPanel')
  .TopPanel;
const CanvasReact = require('../cdap/components/hydrator/components/Canvas')
  .WrapperCanvas;

export {
  CanvasReact,
  TopPanelReact,
  PipelineCanvasActionBtns,
  LeftPanelReact,
  Store,
  NameSpaceStoreActions,
  DataPrepHome,
  DataPrepHelper,
  globalEvents,
  ee,
  VersionStore,
  VersionActions,
  VersionRange,
  Version,
  VersionUtilities,
  ResourceCenterButton,
  KeyValuePairs,
  KeyValuePairsMaterial,
  KeyValueStore,
  KeyValueStoreActions,
  Mousetrap,
  PipelineSummary,
  PipelineNodeMetricsGraph,
  CDAPHelpers,
  StatusFactory,
  LoadingIndicator,
  StatusAlertMessage,
  RulesEngineHome,
  PipelineTriggersSidebars,
  TriggeredPipelineStore,
  PipelineErrorFactory,
  GLOBALS,
  PROGRAM_STATUSES,
  HYDRATOR_DEFAULT_VALUES,
  StatusMapper,
  PipelineDetailStore,
  PipelineDetailActionCreator,
  PipelineDetailsTopPanel,
  PipelineScheduler,
  AvailablePluginsStore,
  AVAILABLE_PLUGINS_ACTIONS,
  PipelineDetailsRunLevelInfo,
  MetricsQueryHelper,
  PipelineMetricsStore,
  PipelineMetricsActionCreator,
  PipelineConfigurationsActionCreator,
  ThemeHelper,
  Footer,
  cdapavscwrapper,
  IconSVG,
  PipelineConfigConstants,
  AuthRefresher,
  ApiErrorDialog,
  ToggleSwitch,
  PipelineList,
  AppHeader,
  Markdown,
  CodeEditor,
  JSONEditor,
  TextBox,
  Number,
  CSVWidget,
  KeyValueWidget,
  Select,
  KeyValueDropdownWidget,
  MultipleValuesWidget,
  PluginConnectionBrowser,
  FunctionDropdownAlias,
  ToggleSwitchWidget,
  WranglerEditor,
  RadioGroupWidget,
  MultiSelect,
  JoinTypeWidget,
  InputFieldDropdown,
  DatasetSelectorWidget,
  SqlConditionsWidget,
  SqlSelectorWidget,
  KeyValueEncodedWidget,
  SessionTokenStore,
  ConfigurationGroup,
  WidgetWrapper,
  ConfigurationGroupUtilities,
  DynamicFiltersUtilities,
  LoadingSVG,
  DateTimeWidget,
  DateRangeWidget,
  PipelineContextMenu,
  PluginContextMenu,
  SelectionBox,
  Clipboard,
  Page404,
  Page500,
  Page403,
  WindowManager,
  validateNamespace,
  WINDOW_ON_FOCUS,
  WINDOW_ON_BLUR,
  PREVIEW_STATUS,
  DownloadFile,
  PreviewUtilities,
  PreviewDataView,
  PreviewLogs,
  SchemaEditor,
  PluginSchemaEditor,
  ALERT_STATUS,
  Comment,
  PipelineCommentsActionBtn,
  Connections,
};
