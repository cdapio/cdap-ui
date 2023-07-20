/*
 * Copyright © 2017 Cask Data, Inc.
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
import UploadJarStep from 'components/CaskWizards/MicroserviceUpload/UploadJarStep';
import UploadJsonStep from 'components/CaskWizards/MicroserviceUpload/UploadJsonStep';
import ConfigureStep from 'components/CaskWizards/MicroserviceUpload/ConfigureStep';
import GeneralInfoStep from 'components/CaskWizards/MicroserviceUpload/GeneralInfoStep';
import InboundQueueStep from 'components/CaskWizards/MicroserviceUpload/InboundQueueStep';
import OutboundQueueStep from 'components/CaskWizards/MicroserviceUpload/OutboundQueueStep';
import PropertiesStep from 'components/CaskWizards/MicroserviceUpload/PropertiesStep';

import T from 'i18n-react';
let commonSteps = [
  {
    id: 'general',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step1.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step1.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step1.description'),
    content: (<GeneralInfoStep />),
    helperText: T.translate('features.Wizard.MicroserviceUpload.Step1.helperText'),
    requiredFields: ['instanceName', 'version', 'microserviceOption']
  },
  {
    id: 'uploadjar',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step2.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step2.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step2.description'),
    content: (<UploadJarStep />),
    requiredFields: ['file']
  },
  {
    id: 'uploadjson',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step3.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step3.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step3.description'),
    content: (<UploadJsonStep />),
    requiredFields: ['file']
  },
  {
    id: 'configure',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step4.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step4.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step4.description'),
    content: (<ConfigureStep />),
    requiredFields: ['instances', 'vcores', 'memory', 'ethreshold']
  },
  {
    id: 'inboundQueues',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step5.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step5.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step5.description'),
    content: (<InboundQueueStep />),
    queueRequiredFields: ['name', 'type'],
    tmsRequiredFields: ['topic'],
    sqsRequiredFields: ['region', 'access-key', 'access-id', 'queue-name'],
    websocketRequiredFields: ['connection'],
    mapRStreamRequiredFields: ['mapRTopic', 'key-serdes', 'value-serdes']
  },
  {
    id: 'outboundQueues',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step6.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step6.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step6.description'),
    content: (<OutboundQueueStep />)
  },
  {
    id: 'properties',
    shorttitle: T.translate('features.Wizard.MicroserviceUpload.Step7.shorttitle'),
    title: T.translate('features.Wizard.MicroserviceUpload.Step7.title'),
    description: T.translate('features.Wizard.MicroserviceUpload.Step7.description'),
    content: (<PropertiesStep />)
  },
];

const MicroserviceUploadWizardConfig = {
  steps: commonSteps,
  footertitle: T.translate('features.Wizard.MicroserviceUpload.footertitle')
};

export default MicroserviceUploadWizardConfig;
