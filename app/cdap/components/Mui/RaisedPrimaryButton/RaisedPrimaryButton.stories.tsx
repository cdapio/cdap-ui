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
import PrimaryButton from './index';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

storiesOf('Mui Raised Primary Button', module)
  .addDecorator(withKnobs)
  .add(
    'Show',
    withInfo({
      text: 'Show the primary button',
    })(() => (
      <PrimaryButton
        disabled={boolean('Disabled', false)}
        onClick={action('click')}
      >
        { text('Label', 'Primary action button') }
      </PrimaryButton>
    ))
  )
  .add(
    'With icon',
    withInfo({
      text: 'Primary button with icon',
    })(() => (
      <PrimaryButton
        disabled={boolean('Disabled', false)}
        startIcon={ <CloudUploadIcon /> }
        onClick={action('click')}
      >
        { text('Label', 'Primary action button') }
      </PrimaryButton>
    ))
  );