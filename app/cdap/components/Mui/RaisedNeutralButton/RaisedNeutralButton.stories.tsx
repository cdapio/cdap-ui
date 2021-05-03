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

import * as React from 'react';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import RaisedNeutralButton from './index';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import {muiTheme} from 'storybook-addon-material-ui';
import newTheme from 'components/Mui/Theme';

storiesOf('Mui Raised Neutral Button', module)
  .addDecorator(withKnobs)
  .addDecorator(muiTheme([newTheme]))
  .add(
    'Show',
    withInfo({
      text: 'Show the primary button',
    })(() => (
      <RaisedNeutralButton
        disabled={boolean('Disabled', false)}
        onClick={action('click')}
      >
        { text('Label', 'Primary action button') }
      </RaisedNeutralButton>
    ))
  )
  .add(
    'With icon',
    withInfo({
      text: 'Primary button with icon',
    })(() => (
      <RaisedNeutralButton
        disabled={boolean('Disabled', false)}
        startIcon={ <CloudUploadIcon /> }
        onClick={action('click')}
      >
        { text('Label', 'Secondary action button') }
      </RaisedNeutralButton>
    ))
  );