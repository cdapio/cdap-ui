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
import T from 'i18n-react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import {
  ISubmenuProps,
  SubmenuContainer,
} from 'components/DataPrep/Directives/ChangeDataType/submenu';
import {
  FormContainer,
  ButtonsContainer,
} from 'components/DataPrep/Directives/ChangeDataType/styles';

const PREFIX = 'features.DataPrep.Directives.ChangeDataType.decimalConfig';
const ROUNDING_PREFIX = `${PREFIX}.roundingOptions`;

const ID_PREFIX = 'DataPrep-Directives-ChangeDataType-decimal';

const SCALE_INPUT_ID = `${ID_PREFIX}-scaleInputId`;
const PRECISION_INPUT_ID = `${ID_PREFIX}-precisionInputId`;
const ROUNDING_INPUT_ID = `${ID_PREFIX}-roundingInputId`;
const ROUNDING_LABEL_ID = `${ID_PREFIX}-roundingLabelId`;

interface IRoundingMode {
  value: string;
  text: string;
  description?: string;
}

const ROUNDING_MODES: IRoundingMode[] = [
  {
    value: 'CEILING',
    text: T.translate(`${ROUNDING_PREFIX}.CEILING.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.CEILING.description`).toString(),
  },
  {
    value: 'DOWN',
    text: T.translate(`${ROUNDING_PREFIX}.DOWN.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.DOWN.description`).toString(),
  },
  {
    value: 'FLOOR',
    text: T.translate(`${ROUNDING_PREFIX}.FLOOR.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.FLOOR.description`).toString(),
  },
  {
    value: 'HALF_DOWN',
    text: T.translate(`${ROUNDING_PREFIX}.HALF_DOWN.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.HALF_DOWN.description`).toString(),
  },
  {
    value: 'HALF_EVEN',
    text: T.translate(`${ROUNDING_PREFIX}.HALF_EVEN.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.HALF_EVEN.description`).toString(),
  },
  {
    value: 'HALF_UP',
    text: T.translate(`${ROUNDING_PREFIX}.HALF_UP.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.HALF_UP.description`).toString(),
  },
  {
    value: 'UNNECESSARY',
    text: T.translate(`${ROUNDING_PREFIX}.UNNECESSARY.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.UNNECESSARY.description`).toString(),
  },
  {
    value: 'UP',
    text: T.translate(`${ROUNDING_PREFIX}.UP.label`).toString(),
    description: T.translate(`${ROUNDING_PREFIX}.UP.description`).toString(),
  },
];

const useStyles = makeStyles((theme) => ({
  customTooltip: {
    maxWidth: 300,
    background: 'rgba(0, 0, 0, 0.8)',
    fontSize: '11px',
  },
  customTooltipArrow: {
    '&::before': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  },
}));

export const DecimalOptions = ({ onApply, onCancel }: ISubmenuProps): JSX.Element => {
  const [scale, setScale] = useState<string>('');
  const [precision, setPrecision] = useState<string>('');
  const [rounding, setRounding] = useState<string>('');

  const classes = useStyles();
  const isRoundingDisabled = scale === '' && precision === '';

  function handleScaleChange(event) {
    const val = event.target.value;
    setScale(val);
  }

  function handlePrecisionChange(event) {
    const val = event.target.value;
    setPrecision(val);
  }

  function handleRoundingChange(event) {
    const val = event.target.value;
    setRounding(val);
  }

  function applyDirective() {
    const option = 'decimal';
    let extraArgs = scale !== '' ? `${scale}` : '';
    if (scale !== '' || precision !== '') {
      extraArgs = `${extraArgs} '${rounding || 'HALF_EVEN'}'`;
    }
    if (precision !== '') {
      extraArgs = `${extraArgs} prop:{precision=${precision}}`;
    }
    return onApply(option, extraArgs);
  }

  return (
    <SubmenuContainer>
      <Paper elevation={3}>
        <FormContainer>
          <FormControl variant="outlined">
            <InputLabel htmlFor={SCALE_INPUT_ID}>{T.translate(`${PREFIX}.scaleLabel`)}</InputLabel>
            <OutlinedInput
              fullWidth
              labelWidth={42}
              id={SCALE_INPUT_ID}
              type="number"
              value={scale}
              onChange={handleScaleChange}
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip
                    arrow
                    enterDelay={500}
                    title={T.translate(`${PREFIX}.scaleTooltip`).toString()}
                    classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
                  >
                    <IconButton
                      aria-label={T.translate(`${PREFIX}.scaleHelpButton`).toString()}
                      edge="end"
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
            />
            <FormHelperText>{T.translate(`${PREFIX}.scaleHelperText`)}</FormHelperText>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor={PRECISION_INPUT_ID}>
              {T.translate(`${PREFIX}.precisionLabel`)}
            </InputLabel>
            <OutlinedInput
              fullWidth
              labelWidth={72}
              id={PRECISION_INPUT_ID}
              type="number"
              value={precision}
              onChange={handlePrecisionChange}
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip
                    arrow
                    enterDelay={500}
                    title={T.translate(`${PREFIX}.precisionTooltip`).toString()}
                    classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
                  >
                    <IconButton
                      aria-label={T.translate(`${PREFIX}.precisionHelpButton`).toString()}
                      edge="end"
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
            />
            <FormHelperText>{T.translate(`${PREFIX}.precisionHelperText`)}</FormHelperText>
          </FormControl>
          <Tooltip
            arrow
            placement="top"
            disableFocusListener={!isRoundingDisabled}
            disableHoverListener={!isRoundingDisabled}
            disableTouchListener={!isRoundingDisabled}
            title={T.translate(`${PREFIX}.roundingDisabledTooltip`).toString()}
            classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
          >
            <FormControl variant="outlined" disabled={isRoundingDisabled}>
              <InputLabel id={ROUNDING_LABEL_ID} htmlFor={ROUNDING_INPUT_ID}>
                {T.translate(`${PREFIX}.roundingLabel`)}
              </InputLabel>
              <Select
                labelId={ROUNDING_LABEL_ID}
                id={ROUNDING_INPUT_ID}
                value={rounding}
                onChange={handleRoundingChange}
                label={T.translate(`${PREFIX}.roundingLabel`)}
                endAdornment={
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      enterDelay={500}
                      title={T.translate(`${PREFIX}.roundingTooltip`).toString()}
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customTooltipArrow,
                      }}
                    >
                      <IconButton
                        aria-label={T.translate(`${PREFIX}.roundingHelpButton`).toString()}
                        edge="end"
                      >
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }
              >
                {ROUNDING_MODES.map((mode: IRoundingMode) => (
                  <MenuItem value={mode.value} key={mode.value}>
                    <Tooltip
                      arrow
                      enterDelay={500}
                      title={mode.description}
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customTooltipArrow,
                      }}
                    >
                      <span>{mode.text}</span>
                    </Tooltip>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{T.translate(`${PREFIX}.roundingHelperText`)}</FormHelperText>
            </FormControl>
          </Tooltip>
          <ButtonsContainer>
            <Button variant="contained" color="primary" disableElevation onClick={applyDirective}>
              {T.translate(`${PREFIX}.applyButton`)}
            </Button>
            <Button color="primary" onClick={onCancel}>
              {T.translate(`${PREFIX}.cancelButton`)}
            </Button>
          </ButtonsContainer>
        </FormContainer>
      </Paper>
    </SubmenuContainer>
  );
};
