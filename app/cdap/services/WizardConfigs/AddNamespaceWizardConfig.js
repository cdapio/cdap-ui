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

import React from 'react';
import GeneralInfoStep from 'components/CaskWizards/AddNamespace/GeneralInfoStep';
import HadoopMappingStep from 'components/CaskWizards/AddNamespace/HadoopMappingStep';
import KubernetesMappingStep from 'components/CaskWizards/AddNamespace/KubernetesMappingStep';
import SecurityStep from 'components/CaskWizards/AddNamespace/SecurityStep';
import PreferencesStep from 'components/CaskWizards/AddNamespace/PreferencesStep';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';
import findIndex from 'lodash/findIndex';

const AddNamespaceWizardConfig = {
  steps: [
    {
      id: 'general',
      shorttitle: T.translate('features.Wizard.Add-Namespace.Step1.ssd-label'),
      title: T.translate('features.Wizard.Add-Namespace.Step1.ssd-label'),
      description: T.translate('features.Wizard.Add-Namespace.Step1.sld-desc'),
      content: <GeneralInfoStep />,
      requiredFields: ['name'],
    },
    {
      id: 'kubernetesMapping',
      shorttitle: T.translate('features.Wizard.Add-Namespace.Step2.ssd-label'),
      title: T.translate('features.Wizard.Add-Namespace.Step2.ssd-label'),
      description: T.translate('features.Wizard.Add-Namespace.Step2.sld-label'),
      content: <KubernetesMappingStep />,
    },
    {
      id: 'preferences',
      shorttitle: T.translate('features.Wizard.Add-Namespace.Step3.ssd-label'),
      title: T.translate('features.Wizard.Add-Namespace.Step3.ssd-label'),
      description: T.translate('features.Wizard.Add-Namespace.Step3.sld-label'),
      content: <PreferencesStep />,
    },
    {
      id: 'hadoopMapping',
      shorttitle: T.translate('features.Wizard.Add-Namespace.Step4.ssd-label'),
      title: T.translate('features.Wizard.Add-Namespace.Step4.ssd-label'),
      description: T.translate('features.Wizard.Add-Namespace.Step4.sld-label'),
      content: <HadoopMappingStep />,
    },
    {
      id: 'security',
      shorttitle: T.translate('features.Wizard.Add-Namespace.Step5.ssd-label'),
      title: T.translate('features.Wizard.Add-Namespace.Step5.ssd-label'),
      description: T.translate('features.Wizard.Add-Namespace.Step5.sld-label'),
      content: <SecurityStep />,
    },
  ],
};

if (Theme.showNamespaceMapping === false) {
  const KubernetesMappingIndex = findIndex(AddNamespaceWizardConfig.steps, { id: 'kubernetesMapping' });
  AddNamespaceWizardConfig.steps.splice(KubernetesMappingIndex, 1);

  const HadoopMappingIndex = findIndex(AddNamespaceWizardConfig.steps, { id: 'hadoopMapping' });
  AddNamespaceWizardConfig.steps.splice(HadoopMappingIndex, 1);
}

if (Theme.showNamespaceSecurity === false) {
  const securityIndex = findIndex(AddNamespaceWizardConfig.steps, { id: 'security' });
  AddNamespaceWizardConfig.steps.splice(securityIndex, 1);
}

export default AddNamespaceWizardConfig;
