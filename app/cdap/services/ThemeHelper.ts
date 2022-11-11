/*
 * Copyright © 2018 Cask Data, Inc.
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

import cssVars from 'css-vars-ponyfill';
import { objectQuery, isNilOrEmpty } from 'services/helpers';
import isColor from 'is-color';
import isBoolean from 'lodash/isBoolean';

interface IThemeJSON {
  'spec-version': string;
}

interface IJsonFeatureNames {
  analytics?: string;
  'control-center'?: string;
  dashboard?: string;
  'data-prep'?: string;
  'wrangler-data-model'?: string;
  'wrangler-datamodel-viewer'?: string;
  entities?: string;
  hub?: string;
  metadata?: string;
  pipelines?: string;
  pipelineStudio?: string;
  reports?: string;
  'rules-engine'?: string;
  cdc?: string;
}

interface IOnePoint0SpecJSON extends IThemeJSON {
  styles?: {
    'brand-primary-color'?: string;
    'navbar-color'?: string;
    'font-family'?: string;
    'page-name-color'?: string;
    'plugin-reference-heading-bg-color'?: string;
  };
  content?: {
    'product-name'?: string;
    'product-description'?: string;
    'product-edition'?: string;
    'product-logo-navbar'?: {
      type?: string;
      arguments?: {
        url?: string;
        data?: string;
      };
    };
    'product-documentation-link'?: string;
    'product-logo-about'?: {
      type?: string;
      arguments?: {
        url?: string;
        data?: string;
      };
    };
    'favicon-path'?: string;
    'footer-text'?: string;
    'footer-link'?: string;
    'feature-names'?: IJsonFeatureNames;
    'welcome-banner-image'?: string;
    'wrangler-data-model-url'?: string;
  };
  features?: {
    'about-product'?: boolean;
    dashboard?: boolean;
    reports?: boolean;
    'data-prep'?: boolean;
    'wrangler-data-model'?: boolean;
    'wrangler-datamodel-viewer'?: boolean;
    pipelines?: boolean;
    pipelineStudio?: boolean;
    analytics?: boolean;
    'rules-engine'?: boolean;
    metadata?: boolean;
    hub?: boolean;
    'ingest-data'?: boolean;
    'add-namespace'?: boolean;
    schedules?: boolean;
    triggers?: boolean;
    lineage?: boolean;
    'realtime-pipeline'?: boolean;
    'native-profile'?: boolean;
    'application-upload'?: boolean;
    'system-services-instance'?: boolean;
    'system-metrics'?: boolean;
    'namespace-mapping'?: boolean;
    'namespace-security'?: boolean;
    'create-profile'?: boolean;
    'reload-system-artifacts'?: boolean;
    'sql-pipeline'?: boolean;
    cdc?: boolean;
    'metadata-in-react'?: boolean;
    'allow-force-dynamic-execution'?: boolean;
    tethering?: boolean;
    'on-prem-tethered-instance'?: boolean;
  };
}

// TODO: Investigate moving this to a separate typings folder, as we shouldn't
// do this in multiple places
declare global {
  /* tslint:disable:interface-name */
  interface Window {
    CDAP_UI_THEME: IOnePoint0SpecJSON;
  }
}

export function applyTheme() {
  if (
    !objectQuery(window, 'CDAP_UI_THEME', 'styles') ||
    isNilOrEmpty(window.CDAP_UI_THEME.styles)
  ) {
    // need to run this at least once even if there's no theme customization
    // so that css variables are parsed correctly even in older browsers
    cssVars();
    return;
  }

  function apply1Point0Styles() {
    const stylesJSON = window.CDAP_UI_THEME.styles;
    const stylesToApply: IOnePoint0SpecJSON['styles'] = {};
    if ('brand-primary-color' in stylesJSON && isColor(stylesJSON['brand-primary-color'])) {
      stylesToApply['brand-primary-color'] = stylesJSON['brand-primary-color'];
    }
    if ('navbar-color' in stylesJSON && isColor(stylesJSON['navbar-color'])) {
      stylesToApply['navbar-color'] = stylesJSON['navbar-color'];
    }
    // TODO: Validate fonts more rigorously
    if ('font-family' in stylesJSON && typeof stylesJSON['font-family'] === 'string') {
      stylesToApply['font-family'] = stylesJSON['font-family'];
    }
    if ('page-name-color' in stylesJSON && isColor(stylesJSON['page-name-color'])) {
      stylesToApply['page-name-color'] = stylesJSON['page-name-color'];
    }
    if (
      'plugin-reference-heading-bg-color' in stylesJSON &&
      isColor(stylesJSON['plugin-reference-heading-bg-color'])
    ) {
      stylesToApply['plugin-reference-heading-bg-color'] =
        stylesJSON['plugin-reference-heading-bg-color'];
    }
    // this is what's going on under the hood for modern browsers:
    // document.documentElement.style.setProperty(`--${cssVar}`, cssValue);
    cssVars({
      variables: stylesToApply,
    });
  }

  const specVersion = window.CDAP_UI_THEME['spec-version'];
  if (specVersion === '1.0') {
    apply1Point0Styles();
  }
  return;
}

interface IFeatureNames {
  analytics: string;
  controlCenter: string;
  dashboard: string;
  dataPrep: string;
  wranglerDataModel: string;
  wranglerDatamodelViewer: string;
  entities: string;
  hub: string;
  metadata: string;
  pipelines: string;
  pipelinesList: string;
  pipelineStudio: string;
  reports: string;
  rulesEngine: string;
  projectAdmin: string;
  systemAdmin: string;
  cdc: string;
}

interface IThemeObj {
  productName?: string;
  productDescription?: string;
  productEdition?: string;
  footerText?: string;
  footerLink?: string;
  productLogoNavbar?: string;
  productLogoAbout?: string;
  productDocumentationLink?: string;
  favicon?: string;
  wranglerDataModelUrl?: string;
  showDashboard?: boolean;
  showReports?: boolean;
  showDataPrep?: boolean;
  showWranglerDataModel?: boolean;
  showWranglerDatamodelViewer?: boolean;
  showPipelines?: boolean;
  showPipelineStudio?: boolean;
  showAnalytics?: boolean;
  showRulesEngine?: boolean;
  showMetadata?: boolean;
  showHub?: boolean;
  showIngestData?: boolean;
  showAddNamespace?: boolean;
  showSchedules?: boolean;
  showTriggers?: boolean;
  showLineage?: boolean;
  showRealtimePipeline?: boolean;
  showAboutProductModal?: boolean;
  showNativeProfile?: boolean;
  showApplicationUpload?: boolean;
  showSystemServicesInstance?: boolean;
  showSystemMetrics?: boolean;
  showNamespaceMapping?: boolean;
  showNamespaceSecurity?: boolean;
  showCreateProfile?: boolean;
  showReloadSystemArtifacts?: boolean;
  featureNames?: IFeatureNames;
  showSqlPipeline?: boolean;
  showCDC?: boolean;
  isMetadataInReact?: boolean;
  allowForceDynamicExecution?: boolean;
  tethering?: boolean;
  onPremTetheredInstance?: boolean;
}

function getTheme(): IThemeObj {
  let theme: IThemeObj = {};
  const DEFAULT_THEME_JSON: IThemeJSON = {
    'spec-version': '1.0',
  };

  const themeJSON = window.CDAP_UI_THEME || DEFAULT_THEME_JSON;
  const specVersion = themeJSON['spec-version'] || '1.0';

  if (specVersion === '1.0') {
    theme = {
      ...theme,
      ...parse1Point0Spec(themeJSON),
    };
  }
  // Need to specify this here to show default/customized title when a CDAP page
  // is not active in the browser, since the <Helmet> titles of the pages won't
  // take effect until the page is active/rendered
  document.title = theme.productName;
  return theme;
}

function parse1Point0Spec(themeJSON: IOnePoint0SpecJSON): IThemeObj {
  const theme: IThemeObj = {};

  function getContent(): IThemeObj {
    const contentJson = themeJSON.content;
    const content: IThemeObj = {
      productName: 'CDAP',
      productDescription: `CDAP is an open source framework that simplifies
      data application development, data integration, and data management.`,
      productEdition: null,
      productLogoNavbar: '/cdap_assets/img/company_logo-20-all.png',
      productLogoAbout: '/cdap_assets/img/CDAP_darkgray.png',
      productDocumentationLink: null,
      favicon: '/cdap_assets/img/favicon.png',
      footerText: 'Licensed under the Apache License, Version 2.0',
      footerLink: 'https://www.apache.org/licenses/LICENSE-2.0',
      wranglerDataModelUrl: null,
      featureNames: {
        analytics: 'Analytics',
        controlCenter: 'Control Center',
        dashboard: 'Operations',
        dataPrep: 'Wrangler',
        wranglerDataModel: 'Wrangler Data Model',
        wranglerDatamodelViewer: 'EnhancedWrangler',
        entities: 'Entities',
        hub: 'Hub',
        metadata: 'Metadata',
        pipelines: 'Pipeline',
        pipelinesList: 'List',
        pipelineStudio: 'Studio',
        reports: 'Reports',
        rulesEngine: 'Rules',
        projectAdmin: 'Namespace Admin',
        systemAdmin: 'System Admin',
        cdc: 'Delta Replicator',
      },
    };
    if (isNilOrEmpty(contentJson)) {
      return content;
    }
    if ('product-name' in contentJson) {
      content.productName = contentJson['product-name'];
    }
    if ('product-description' in contentJson) {
      content.productDescription = contentJson['product-description'];
    }
    if ('product-edition' in contentJson) {
      content.productEdition = contentJson['product-edition'];
    }
    if ('product-documentation-link' in contentJson) {
      content.productDocumentationLink = contentJson['product-documentation-link'];
    }
    if ('footer-text' in contentJson) {
      content.footerText = contentJson['footer-text'];
    }
    if ('footer-link' in contentJson) {
      content.footerLink = contentJson['footer-link'];
    }
    if ('product-logo-navbar' in contentJson) {
      const productLogoNavbar = window.CDAP_UI_THEME.content['product-logo-navbar'];
      if (productLogoNavbar.type) {
        const productLogoNavbarType = productLogoNavbar.type;
        if (productLogoNavbarType === 'inline') {
          content.productLogoNavbar = objectQuery(productLogoNavbar, 'arguments', 'data');
        } else if (productLogoNavbarType === 'link') {
          content.productLogoNavbar = objectQuery(productLogoNavbar, 'arguments', 'url');
        }
      }
    }
    if ('product-logo-about' in contentJson) {
      const productLogoAbout = window.CDAP_UI_THEME.content['product-logo-about'];
      if (productLogoAbout.type) {
        const productLogoAboutType = productLogoAbout.type;
        if (productLogoAboutType === 'inline') {
          content.productLogoAbout = objectQuery(productLogoAbout, 'arguments', 'data');
        } else if (productLogoAboutType === 'link') {
          content.productLogoAbout = objectQuery(productLogoAbout, 'arguments', 'url');
        }
      }
    }
    if ('welcome-banner-image' in contentJson) {
      const welcomeBannerImage = window.CDAP_UI_THEME.content['welcome-banner-image'];
      cssVars({
        variables: {
          'welcome-banner-image': `url('${welcomeBannerImage}')`,
        },
      });
    }
    if ('wrangler-data-model-url' in contentJson) {
      content.wranglerDataModelUrl = contentJson['wrangler-data-model-url'];
    }
    if ('feature-names' in contentJson) {
      const featureNames = { ...content.featureNames };

      if ('analytics' in contentJson['feature-names']) {
        featureNames.analytics = objectQuery(contentJson, 'feature-names', 'analytics');
      }
      if ('control-center' in contentJson['feature-names']) {
        featureNames.controlCenter = objectQuery(contentJson, 'feature-names', 'control-center');
      }
      if ('dashboard' in contentJson['feature-names']) {
        featureNames.dashboard = objectQuery(contentJson, 'feature-names', 'dashboard');
      }
      if ('data-prep' in contentJson['feature-names']) {
        featureNames.dataPrep = objectQuery(contentJson, 'feature-names', 'data-prep');
      }
      if ('wrangler-data-model' in contentJson['feature-names']) {
        featureNames.wranglerDataModel = objectQuery(
          contentJson,
          'feature-names',
          'wrangler-data-model'
        );
      }
      if ('wrangler-datamodel-viewer' in contentJson['feature-names']) {
        featureNames.wranglerDatamodelViewer = objectQuery(
          contentJson,
          'feature-names',
          'wrangler-datamodel-viewer'
        );
      }

      if ('entities' in contentJson['feature-names']) {
        featureNames.entities = objectQuery(contentJson, 'feature-names', 'entities');
      }
      if ('hub' in contentJson['feature-names']) {
        featureNames.hub = objectQuery(contentJson, 'feature-names', 'hub');
      }
      if ('metadata' in contentJson['feature-names']) {
        featureNames.metadata = objectQuery(contentJson, 'feature-names', 'metadata');
      }
      if ('pipelines' in contentJson['feature-names']) {
        featureNames.pipelines = objectQuery(contentJson, 'feature-names', 'pipelines');
      }
      if ('pipelines-studio' in contentJson['feature-names']) {
        featureNames.pipelineStudio = objectQuery(contentJson, 'feature-names', 'pipelines-studio');
      }
      if ('reports' in contentJson['feature-names']) {
        featureNames.reports = objectQuery(contentJson, 'feature-names', 'reports');
      }
      if ('rules-engine' in contentJson['feature-names']) {
        featureNames.rulesEngine = objectQuery(contentJson, 'feature-names', 'rules-engine');
      }
      if ('cdc' in contentJson['feature-names']) {
        featureNames.cdc = objectQuery(contentJson, 'feature-names', 'cdc');
      }

      content.featureNames = featureNames;
    }

    return content;
  }

  // TODO Move these flags to context provider.
  function getFeatures(): IThemeObj {
    const featuresJson = themeJSON.features;
    const features: IThemeObj = {
      showDashboard: true,
      showReports: true,
      showDataPrep: true,
      showPipelines: true,
      showPipelineStudio: true,
      showAnalytics: false,
      showRulesEngine: false,
      showMetadata: true,
      showHub: true,
      showIngestData: true,
      showAddNamespace: true,
      showAboutProductModal: true,
      showSchedules: true,
      showTriggers: true,
      showLineage: true,
      showNativeProfile: true,
      showApplicationUpload: true,
      showSystemServicesInstance: true,
      showSystemMetrics: true,
      showNamespaceMapping: true,
      showNamespaceSecurity: true,
      showCreateProfile: true,
      showReloadSystemArtifacts: true,
      showSqlPipeline: true,
      showCDC: false,
      isMetadataInReact: false,
    };
    if (isNilOrEmpty(featuresJson)) {
      return features;
    }
    if ('dashboard' in featuresJson && isBoolean(featuresJson.dashboard)) {
      features.showDashboard = featuresJson.dashboard;
    }
    if ('reports' in featuresJson && isBoolean(featuresJson.reports)) {
      features.showReports = featuresJson.reports;
    }
    if ('data-prep' in featuresJson && isBoolean(featuresJson['data-prep'])) {
      features.showDataPrep = featuresJson['data-prep'];
    }
    if ('wrangler-data-model' in featuresJson && isBoolean(featuresJson['wrangler-data-model'])) {
      features.showWranglerDataModel = featuresJson['wrangler-data-model'];
    }
    if (
      'wrangler-datamodel-viewer' in featuresJson &&
      isBoolean(featuresJson['wrangler-datamodel-viewer'])
    ) {
      features.showWranglerDatamodelViewer = featuresJson['wrangler-datamodel-viewer'];
    }

    if ('pipelines' in featuresJson && isBoolean(featuresJson.pipelines)) {
      features.showPipelines = featuresJson.pipelines;
    }
    if ('pipeline-studio' in featuresJson && isBoolean(featuresJson['pipeline-studio'])) {
      features.showPipelineStudio = featuresJson['pipeline-studio'];
    }
    if ('analytics' in featuresJson && isBoolean(featuresJson.analytics)) {
      features.showAnalytics = featuresJson.analytics;
    }
    if ('rules-engine' in featuresJson && isBoolean(featuresJson['rules-engine'])) {
      features.showRulesEngine = featuresJson['rules-engine'];
    }
    if ('metadata' in featuresJson && isBoolean(featuresJson.metadata)) {
      features.showMetadata = featuresJson.metadata;
    }
    if ('hub' in featuresJson && isBoolean(featuresJson.hub)) {
      features.showHub = featuresJson.hub;
    }
    if ('ingest-data' in featuresJson && isBoolean(featuresJson['ingest-data'])) {
      features.showIngestData = featuresJson['ingest-data'];
    }
    if ('add-namespace' in featuresJson && isBoolean(featuresJson['add-namespace'])) {
      features.showAddNamespace = featuresJson['add-namespace'];
    }
    if ('about-product' in featuresJson && isBoolean(featuresJson['about-product'])) {
      features.showAboutProductModal = featuresJson['about-product'];
    }
    if ('schedules' in featuresJson && isBoolean(featuresJson.schedules)) {
      features.showSchedules = featuresJson.schedules;
    }
    if ('triggers' in featuresJson && isBoolean(featuresJson.triggers)) {
      features.showTriggers = featuresJson.triggers;
    }
    if ('lineage' in featuresJson && isBoolean(featuresJson.lineage)) {
      features.showLineage = featuresJson.lineage;
    }
    if ('realtime-pipeline' in featuresJson && isBoolean(featuresJson['realtime-pipeline'])) {
      features.showRealtimePipeline = featuresJson['realtime-pipeline'];
    }
    if ('native-profile' in featuresJson && isBoolean(featuresJson['native-profile'])) {
      features.showNativeProfile = featuresJson['native-profile'];
    }
    if ('application-upload' in featuresJson && isBoolean(featuresJson['application-upload'])) {
      features.showApplicationUpload = featuresJson['application-upload'];
    }
    if (
      'system-services-instance' in featuresJson &&
      isBoolean(featuresJson['system-services-instance'])
    ) {
      features.showSystemServicesInstance = featuresJson['system-services-instance'];
    }
    if ('system-metrics' in featuresJson && isBoolean(featuresJson['system-metrics'])) {
      features.showSystemMetrics = featuresJson['system-metrics'];
    }
    if ('namespace-mapping' in featuresJson && isBoolean(featuresJson['namespace-mapping'])) {
      features.showNamespaceMapping = featuresJson['namespace-mapping'];
    }
    if ('namespace-security' in featuresJson && isBoolean(featuresJson['namespace-security'])) {
      features.showNamespaceSecurity = featuresJson['namespace-security'];
    }
    if ('create-profile' in featuresJson && isBoolean(featuresJson['create-profile'])) {
      features.showCreateProfile = featuresJson['create-profile'];
    }
    if (
      'reload-system-artifacts' in featuresJson &&
      isBoolean(featuresJson['reload-system-artifacts'])
    ) {
      features.showReloadSystemArtifacts = featuresJson['reload-system-artifacts'];
    }
    if ('sql-pipeline' in featuresJson && isBoolean(featuresJson['sql-pipeline'])) {
      features.showSqlPipeline = featuresJson['sql-pipeline'];
    }
    if ('cdc' in featuresJson && isBoolean(featuresJson.cdc)) {
      features.showCDC = featuresJson.cdc;
    }
    if ('metadata-in-react' in featuresJson && isBoolean(featuresJson['metadata-in-react'])) {
      features.isMetadataInReact = featuresJson['metadata-in-react'];
    }
    if (
      'allow-force-dynamic-execution' in featuresJson &&
      isBoolean(featuresJson['allow-force-dynamic-execution'])
    ) {
      features.allowForceDynamicExecution = featuresJson['allow-force-dynamic-execution'];
    }
    if ('tethering' in featuresJson && isBoolean(featuresJson.tethering)) {
      features.tethering = featuresJson.tethering;
    }
    if (
      'on-prem-tethered-instance' in featuresJson &&
      isBoolean(featuresJson['on-prem-tethered-instance'])
    ) {
      features.onPremTetheredInstance = featuresJson['on-prem-tethered-instance'];
    }
    return features;
  }

  return {
    ...theme,
    ...getContent(),
    ...getFeatures(),
  };
}

export const Theme = getTheme();
