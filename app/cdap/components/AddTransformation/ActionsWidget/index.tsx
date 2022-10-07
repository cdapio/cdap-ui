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
import React from 'react';
import { SELECT_ACTION_TO_TAKE, REMOVE_ROWS, REPLACE_ROWS, REPLACE_WITH } from '../constants';
import { useStyles } from '../styles';
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
} from '@material-ui/core';
import T from 'i18n-react';

export default function(props) {
  const classes = useStyles();
  const { selectedAction, setSelectedAction, setReplaceValue, replaceValue } = props;

  return (
    <section className={classes.functionSectionStyles}>
      <div className={classes.funtionSectionWrapperStyles}>
        <div className={classes.functionHeadingTextStyles}>
          {T.translate('features.WranglerNewAddTransformation.selectAction')}
        </div>
        <img
          className={classes.greenCheckIconStyles}
          src="/cdap_assets/img/green-check.svg"
          alt="tick icon"
        />
      </div>
      <FormControl>
        <RadioGroup
          name="actions"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <FormControlLabel
            value="remove"
            className={classes.radioStyles}
            control={<Radio color="primary" />}
            label={REMOVE_ROWS}
          />
          <FormControlLabel
            value="replace"
            className={classes.radioStyles}
            control={<Radio color="primary" />}
            label={REPLACE_ROWS}
          />
        </RadioGroup>
      </FormControl>
      <br />
      {selectedAction == 'replace' && (
        <FormControl className={classes.replaceWithInput}>
          <FormLabel className={classes.replaceWithText}>{REPLACE_WITH}</FormLabel>
          <TextField
            variant="outlined"
            value={replaceValue}
            onChange={(e) => setReplaceValue(e.target.value)}
          />
        </FormControl>
      )}
    </section>
  );
}
