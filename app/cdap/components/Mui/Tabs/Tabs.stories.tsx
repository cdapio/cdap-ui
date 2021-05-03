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
import Tabs from './index';
import Tab from './Tab';
import TabPanel from './TabPanel';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';
import {muiTheme} from 'storybook-addon-material-ui';
import newTheme from 'components/Mui/Theme';



storiesOf('Mui Tabs', module)
  .addDecorator(withKnobs)
  .addDecorator(muiTheme([newTheme]))
  .add(
    'Show',
    withInfo({
      text: 'Show tabs',
    })(() => {
      const value = select('Selected tab', ['Flights', 'Hotels', 'Cars'], 'Flights');
      return <div>
        <Tabs value={value} onChange={action('Tab clicked')}>
          <Tab label="Flights" value="Flights" />
          <Tab label="Hotels" value="Hotels" />
          <Tab label="Cars" value="Cars" disabled={boolean('Disable Cars tab', false)} />
        </Tabs>
        <TabPanel selected={value==='Flights'}>
          Flight Information here
        </TabPanel>
        <TabPanel selected={value==='Hotels'}>
          Hotel Information here
        </TabPanel>
        <TabPanel selected={value==='Cars'}>
          Cars Information here
        </TabPanel>
      </div>;
    })
  );