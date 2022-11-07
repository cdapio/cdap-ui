/*
 * Copyright © 2022 Cask Data, Inc.
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

import { IconButton } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { PREFIX } from 'components/FooterPanel';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import T from 'i18n-react';
import React from 'react';
import SimpleLabel from 'components/FooterPanel/Components/common/RenderLabel/SimpleLabel';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  arrowIcon: {
    transform: 'rotate(90deg)',
  },
  root: {
    padding: 0,
  },
});

const ZoomBox = styled(Box)`
  text-align: center;
  padding: 9.5px 12px;
  gap: 8px;
  width: 10.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

export default function() {
  const classes = useStyles();

  return (
    <ZoomBox data-testid="footer-panel-zoom-tab">
      <IconButton classes={{ root: classes.root }} aria-label="zoom">
        <ZoomInIcon />
      </IconButton>
      <SimpleLabel>
        <>{`${T.translate(`${PREFIX}.zoomPercent100`)}`}</>
      </SimpleLabel>
      <IconButton className={classes.arrowIcon} classes={{ root: classes.root }} aria-label="arrow">
        <ArrowRightIcon />
      </IconButton>
    </ZoomBox>
  );
}
