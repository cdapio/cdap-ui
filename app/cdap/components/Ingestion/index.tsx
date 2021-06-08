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
import TaskTrackingWizard from './IngestTaskWizard/TaskTrackingWizard';
import { Button, Paper, Typography } from '@material-ui/core';

const styles = (theme): StyleRules => {
  return {
    wizardAndContentWrapper: {
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gridTemplateRows: '100%',
      height: '100vh',
    },
    wizard: {
      border: '1px solid red',
    },
    content: {
      border: '1px solid blue',
    },
  };
};

interface IngestionProps extends WithStyles<typeof styles> {
  test: string;
  pluginsMap: any;
}

const IngestionView: React.FC<IngestionProps> = ({ classes }) => {
  const steps = ['Task Details', 'Source Connection', 'Target Connection', 'Target Mapping'];
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <>
      <div>title</div>
      <div className={classes.wizardAndContentWrapper}>
        <div className={classes.wizard}>
          <TaskTrackingWizard steps={steps} activeStep={activeStep} />
        </div>
        <div className={classes.content}>
          <div className={classes.actionsContainer}>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </div>
      </div>
    </>
  );
};

const Ingestion = withStyles(styles)(IngestionView);
export default Ingestion;
