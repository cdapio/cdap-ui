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
import { Modal, ModalBody } from 'reactstrap';
import T from 'i18n-react';
import { getModeWithCloudProvider } from 'components/shared/AppHeader/AboutPageModal/helper';
import Footer from 'components/shared/Footer';
import { Theme } from 'services/ThemeHelper';
import IconSVG from 'components/shared/IconSVG';
import Heading, { HeadingTypes } from 'components/shared/Heading';

require('./AboutPageModal.scss');

declare global {
  /* tslint:disable:interface-name */
  interface Window {
    CDAP_CONFIG: any;
  }
}

interface IAboutPageModalProps {
  cdapVersion: string;
  isOpen: boolean;
  toggle: () => void;
}

const AboutPageModal: React.FC<IAboutPageModalProps> = ({ cdapVersion, isOpen, toggle }) => {
  const mode = getModeWithCloudProvider();
  const productLogoSrc = Theme.productLogoAbout || '/cdap_assets/img/CDAP_darkgray.png';
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      zIndex={1301}
      size="md"
      className="about-page-modal"
      backdrop="static"
    >
      <ModalBody>
        <div className="close-section float-right" onClick={toggle}>
          <Heading type={HeadingTypes.h3} label={<IconSVG name="icon-close" />} />
        </div>
        <div className="about-title">
          <div className="cdap-logo-with-version">
            <div className="logo-container">
              <img src={productLogoSrc} />
            </div>
            <span className="cdap-version">
              {T.translate('features.AboutPage.version', {
                version: cdapVersion,
              })}
            </span>
          </div>
        </div>
        <div className="about-content">
          <div className="cdap-mode-security">
            <span className="cdap-mode">
              <strong>{T.translate('features.AboutPage.mode')}</strong>
              <span>{mode}</span>
            </span>
            <br />
            <span className="cdap-security">
              <strong>{T.translate('features.AboutPage.security')}</strong>
              <span>{window.CDAP_CONFIG.securityEnabled ? 'Enabled' : 'Disabled'}</span>
            </span>
          </div>
        </div>
        <Footer showNamespace={false} />
      </ModalBody>
    </Modal>
  );
};

export default AboutPageModal;
