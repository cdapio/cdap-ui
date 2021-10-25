/*
 * Copyright © 2021 Cask Data, Inc.
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
import { SvgIcon } from '@material-ui/core';

// These icons were specifically linked by Lea
export const YellowIconWarning = (props) => (
  <SvgIcon {...props}>
    <path
      d="M21.008845,21 C22.1085295,21 22.555163,20.2316452 21.9946626,19.2635082 L13.0053374,3.73649183 C12.4501049,2.77745388 11.555163,2.76835477 10.9946626,3.73649183 L2.00533738,19.2635082 C1.45010488,20.2225461 1.88967395,21 2.991155,21 L21.008845,21 Z M13,18 L11,18 L11,16 L13,16 L13,18 L13,18 Z M13,14 L11,14 L11,10 L13,10 L13,14 L13,14 Z"
      id="Shape"
      fill="#F3B300"
    />
  </SvgIcon>
);

export const GreenIconSuccess = (props) => (
  <SvgIcon {...props}>
    <path
      d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M10,17 L5,12 L6.41,10.59 L10,14.17 L17.59,6.58 L19,8 L10,17 Z"
      id="Shape"
      fill="#00C752"
    />
  </SvgIcon>
);

export const RedIconError = (props) => (
  <SvgIcon {...props}>
    <path
      d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M13,17 L11,17 L11,15 L13,15 L13,17 L13,17 Z M13,13 L11,13 L11,7 L13,7 L13,13 L13,13 Z"
      id="Shape"
      fill="#DA4236"
    />
  </SvgIcon>
);
