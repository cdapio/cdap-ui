/*
 * Copyright © 2020 Cask Data, Inc.
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
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import {
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';

const styles = (theme): StyleRules => {
  return {
    root: {
      border: '1px solid red',
      height: '100vh',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  };
};

interface TrackingWizardProps extends WithStyles<typeof styles> {
  steps: any[];
  activeStep;
}
const TrackingWizard: React.FC<TrackingWizardProps> = ({ classes, steps, activeStep }) => {
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return `oracle-studies-to-bigQuery`;
      case 1:
        return (
          <div>
            studies
            <div>oracle-global-server</div>
          </div>
        );
      case 2:
        return (
          <div>
            StudyPerformance
            <div>bigquery-global-server</div>
          </div>
        );
      default:
        return;
    }
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} expanded={index < activeStep}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

const TaskTrackingWizard = withStyles(styles)(TrackingWizard);
export default TaskTrackingWizard;
