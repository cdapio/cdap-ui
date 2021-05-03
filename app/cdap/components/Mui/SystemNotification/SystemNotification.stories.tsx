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

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text } from '@storybook/addon-knobs';
import PrimaryButton from 'components/Mui/RaisedPrimaryButton';
import {muiTheme} from 'storybook-addon-material-ui';
import newTheme from 'components/Mui/Theme';

import NotificationPermission from './NotificationPermission';

storiesOf('Mui System Notification', module)
  .addDecorator(withKnobs)
  .addDecorator(muiTheme([newTheme]))
  .add(
    'System Notification',
    withInfo({
      text: 'Enable and use the system notification'
    })(() => {
      const alertTitle = text('Title', 'System notification!');
      const alertBody = text('Body', 'Lorem ipsum blah blah');
      return <React.Fragment>
        <NotificationPermission />
        <div>
          <PrimaryButton
            onClick={
              () => { new Notification(alertTitle, {
                body: alertBody,
                icon: '/img/favicon.png'
              }) }
            }>
            Show notification
          </PrimaryButton>
        </div>
      </React.Fragment>
    })
  );
