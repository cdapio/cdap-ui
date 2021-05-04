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
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import {muiTheme} from 'storybook-addon-material-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from './DialogTitle';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import PrimaryButton from 'components/Mui/FlatPrimaryButton';
import SecondaryButton from 'components/Mui/FlatNeutralButton';
import ErrorAlert from 'components/Mui/ErrorAlert';
import If from 'components/If';
import newTheme from 'components/Mui/Theme';


storiesOf('Mui Dialog', module)
  .addDecorator(withKnobs)
  .addDecorator(muiTheme([newTheme]))
  .add(
    'Show',
    withInfo({
      text: 'Show a simple dialog',
    })(() => (
      <Dialog onClose={action('Closed')} open={boolean('Open dialog', true)}>
        <DialogTitle>{text('Dialog title', 'Something important')}</DialogTitle>
        <DialogContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={action('Cancel')}>Cancel</SecondaryButton>
          <PrimaryButton onClick={action('Confirm')}>Confirm</PrimaryButton>
        </DialogActions>
      </Dialog>  
    ))
  )
  .add(
    'Form input',
    withInfo({
      text: 'Show a dialog with form inputs and an error',
    })(() => (
      <Dialog onClose={action('Closed')} open={boolean('Open dialog', true)}>
        <DialogTitle>{text('Dialog title', 'Something important')}</DialogTitle>
        <DialogContent>
          <If condition={boolean('Show error', true)}>
            <Box>
              <ErrorAlert>
                An error occured when submitting the form.
              </ErrorAlert>
            </Box>
          </If>
          <FormControl component="fieldset">
            <FormLabel component="legend">Transfer options</FormLabel>
            <TextField label="Target" />
            <RadioGroup value="1">
              <FormControlLabel value="1" control={<Radio />} label="Option 1" />
              <FormControlLabel value="2" control={<Radio />} label="Option 2" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={action('Cancel')}>Cancel</SecondaryButton>
          <PrimaryButton onClick={action('Confirm')}>Submit</PrimaryButton>
        </DialogActions>
      </Dialog>  
    ))
  );