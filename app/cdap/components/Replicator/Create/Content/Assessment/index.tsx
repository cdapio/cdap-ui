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

import React, { useState } from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { createContextConnect, ICreateContext } from 'components/Replicator/Create';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyReplicatorApi } from 'api/replicator';
import TablesAssessment from 'components/Replicator/Create/Content/Assessment/TablesAssessment';
import classnames from 'classnames';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import ConnectivityAssessment from 'components/Replicator/Create/Content/Assessment/ConnectivityAssessment';
import FeaturesAssessment from 'components/Replicator/Create/Content/Assessment//FeaturesAssessment';
import StepButtons from 'components/Replicator/Create/Content/StepButtons';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import { extractErrorMessage } from 'services/helpers';
import Button from '@material-ui/core/Button';
import Refresh from '@material-ui/icons/Refresh';

const contentHeight = 'calc(100% - 27px - 87px - 110px)'; // 100% - heading - link - StepButtons

const styles = (theme): StyleRules => {
  return {
    root: {
      padding: '10px 40px',
    },
    title: {
      marginBottom: '5px',
    },
    heading: {
      display: 'grid',
      gridTemplateColumns: '1fr 150px',

      '& > div:last-child': {
        textAlign: 'right',
        paddingTop: '10px',
      },
    },
    subHeading: {
      color: theme.palette.grey[100],
    },
    btnText: {
      marginRight: '5px',
    },
    headerLinks: {
      marginBottom: '20px',
      marginTop: '20px',
    },
    link: {
      fontSize: '16px',
      marginRight: '75px',
      cursor: 'pointer',
      color: theme.palette.grey[100],
      '&:not($active):hover': {
        borderBottom: `2px solid ${theme.palette.grey[300]}`,
      },
    },
    active: {
      fontWeight: 600,
      color: theme.palette.grey[50],
      borderBottom: `5px solid ${theme.palette.grey[300]}`,
    },
    contentContainer: {
      height: contentHeight,
    },
    schemaContentContainer: {
      minHeight: contentHeight,
    },
  };
};

enum VIEWS {
  tables = 'tables',
  features = 'features',
  connectivity = 'connectivity',
}

enum SEVERITY {
  error = 'ERROR',
  warning = 'WARNING',
}

const AssessmentView: React.FC<ICreateContext & WithStyles<typeof styles>> = ({
  classes,
  draftId,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schemaErrorCount, setSchemaErrorCount] = useState(0);
  const [errorFeaturesCount, setErrorFeaturesCount] = useState(0);
  const [view, setView] = useState(VIEWS.tables);
  const [assessment, setAssessment] = useState({
    tables: [],
    features: [],
    connectivity: [],
  });

  function runAssessment() {
    setLoading(true);
    setError(null);

    const params = {
      namespace: getCurrentNamespace(),
      draftId,
    };

    MyReplicatorApi.assessPipeline(params).subscribe(
      (res) => {
        let schemaError = 0;
        res.tables.forEach((table) => {
          if (table.numColumnsPartiallySupported !== 0 || table.numColumnsNotSupported !== 0) {
            schemaError++;
          }
        });

        // Calculate the ERROR type features
        const errorFeatures = res.features.filter((feature) => feature.severity === SEVERITY.error)
          .length;
        setErrorFeaturesCount(errorFeatures);

        setSchemaErrorCount(schemaError);
        setAssessment(res);
        setLoading(false);
      },
      (err) => {
        setError(extractErrorMessage(err));
        setLoading(false);
      }
    );
  }

  React.useEffect(runAssessment, []);

  if (loading) {
    return <LoadingSVGCentered />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.heading}>
        <div>
          <Heading type={HeadingTypes.h4} label="Review assessment" className={classes.title} />
          <div className={classes.subHeading}>Resolve all issues to continue</div>
        </div>
        <div>
          <Button color="primary" onClick={runAssessment}>
            <span className={classes.btnText}>Refresh</span>
            <Refresh />
          </Button>
        </div>
      </div>

      {error && (
        <React.Fragment>
          <br />
          <div className="text-danger">
            <Heading type={HeadingTypes.h5} label="Error" />
            <span>{error}</span>
          </div>
        </React.Fragment>
      )}

      {!loading && !error && (
        <React.Fragment>
          <div className={classes.headerLinks}>
            <span
              className={classnames(classes.link, { [classes.active]: view === VIEWS.tables })}
              onClick={() => setView(VIEWS.tables)}
            >
              Schema issues ({schemaErrorCount})
            </span>
            <span
              className={classnames(classes.link, { [classes.active]: view === VIEWS.features })}
              onClick={() => setView(VIEWS.features)}
            >
              Missing features ({assessment.features.length})
            </span>
            <span
              className={classnames(classes.link, {
                [classes.active]: view === VIEWS.connectivity,
              })}
              onClick={() => setView(VIEWS.connectivity)}
            >
              Connectivity issues ({assessment.connectivity.length})
            </span>
          </div>

          <div
            className={classnames({
              [classes.contentContainer]: view !== VIEWS.tables,
              [classes.schemaContentContainer]: view === VIEWS.tables,
            })}
          >
            {view === VIEWS.tables && (
              <TablesAssessment
                assessmentTables={assessment.tables}
                runAssessment={runAssessment}
              />
            )}

            {view === VIEWS.features && <FeaturesAssessment features={assessment.features} />}

            {view === VIEWS.connectivity && (
              <ConnectivityAssessment connectivity={assessment.connectivity} />
            )}
          </div>
        </React.Fragment>
      )}

      <StepButtons
        // only block proceeding if assessment API did not return an error and if assessment has error issues
        nextDisabled={
          !error && schemaErrorCount + errorFeaturesCount + assessment.connectivity.length !== 0
        }
      />
    </div>
  );
};

const StyledAssessmentView = withStyles(styles)(AssessmentView);
const Assessment = createContextConnect(StyledAssessmentView);
export default Assessment;
