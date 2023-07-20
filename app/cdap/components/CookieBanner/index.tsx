/*
 * Copyright © 2023 Cask Data, Inc.
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
import React, { useState } from 'react';
import styled from 'styled-components';
import SnackBar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Container from '@material-ui/core/Container';
import Cookies from 'universal-cookie';
import T from 'i18n-react';
import { DEFAULT_COOKIE_LINK } from './constants';

const okText = 'commons.gotIt';
const learnMore = 'commons.learnMore';
const cookieBannerText = 'commons.cookieBanner';

const thirteenMonths = new Date();
thirteenMonths.setMonth(thirteenMonths.getMonth() + 13);

const cookies = new Cookies();
const cdapDataCookieWithTag = (tag: string) => {
  return `CDAP_DATA_CONSENT_COOKIE_${tag}`;
};

interface IBannerProps {
  cookieName: string;
  cookieLink: string;
  cookieText: string;
}

type IModalBodyProps = Omit<IBannerProps, 'cookieName'> & {
  close: () => void;
};

const SnackbarContainer = styled(Container)`
  && {
    background-color: #333333;
    border-radius: 4px;
    display: flex;
    padding: 20px;
  }
`;

const SnackbarText = styled.span`
  color: white;
  flex: 3;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  a {
    color: #a1c2fa;
  }
`;

const ActionsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
`;

const ConsentButton = styled(Button)`
  &&& {
    color: #a1c2fa;
    font-size: 14px;
    whitespace: nowrap;
  }
`;

const SnackbarContent = ({ cookieLink, cookieText, close }: IModalBodyProps) => {
  return (
    <SnackbarContainer fixed maxWidth="md">
      <SnackbarText>
        {cookieText} <a href={cookieLink}>{T.translate(learnMore).toString()}</a>
      </SnackbarText>
      <ActionsContainer>
        <ConsentButton variant="text" onClick={close}>
          {T.translate(okText).toString()}
        </ConsentButton>
        <IconButton onClick={close} aria-label="close">
          <ClearIcon fontSize="large" style={{ color: 'white' }} />
        </IconButton>
      </ActionsContainer>
    </SnackbarContainer>
  );
};

/**
 * If the user has analytics enabled and if the consent cookie doesn't exist
 * on their computer, show the cookie banner
 */
export const CookieBanner = () => {
  const gtm = window.CDAP_CONFIG.googleTagManager;
  if (gtm === '') {
    return null;
  }

  const cookieText =
    window.CDAP_CONFIG.cookieBannerText || T.translate(cookieBannerText).toString();
  const cookieLink = window.CDAP_CONFIG.cookieBannerLink || DEFAULT_COOKIE_LINK;
  const dataCookie = cdapDataCookieWithTag(gtm);
  const cdapDataConsented = cookies.get(dataCookie);
  if (!cdapDataConsented && cookieLink !== '' && cookieText !== '') {
    return <Banner cookieName={dataCookie} cookieLink={cookieLink} cookieText={cookieText} />;
  }

  return null;
};

const Banner = ({ cookieName, cookieLink, cookieText }: IBannerProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    cookies.set(cookieName, true, {
      expires: thirteenMonths,
      path: '/',
    });
  };

  return (
    <SnackBar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      style={{ display: 'flex' }}
    >
      <SnackbarContent close={handleClose} cookieLink={cookieLink} cookieText={cookieText} />
    </SnackBar>
  );
};
