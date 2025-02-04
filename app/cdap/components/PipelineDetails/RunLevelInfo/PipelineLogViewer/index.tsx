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
import withStyles, {
  WithStyles,
  StyleRules,
  CreateCSSProperties,
} from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { GLOBALS } from 'services/global-constants';
import ProgramDataFetcher from 'components/LogViewer/DataFetcher/ProgramDataFetcher';
import LogViewer from 'components/LogViewer';
import { PIPELINE_LOGS_FILTER } from 'services/global-constants';
import { isErrorClassificationBannerDisplayed } from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineRunErrorDetails';

const LOGVIEWER_TOP_OFFSET = '110px';
const FOOTER_HEIGHT = '54px';
const HEADER_HEIGHT = '48px';
const ERROR_BANNER_OFFSET = '32px'; // to align the top of the logs viewer when the error banner is present

const styles = (theme): StyleRules => {
  const portalContainerBase = {
    position: 'fixed',
    top: HEADER_HEIGHT,
    left: 0,
    height: `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT})`,
    width: '100vw',
    zIndex: 1301,
  };

  const logsContainerBase = {
    position: 'absolute',
    top: LOGVIEWER_TOP_OFFSET,
    height: `calc(100% - ${LOGVIEWER_TOP_OFFSET})`,
    width: '100%',
    backgroundColor: theme.palette.white[50],
  };

  return {
    portalContainer: portalContainerBase as CreateCSSProperties<{}>,
    logsContainer: logsContainerBase as CreateCSSProperties<{}>,
    logsContainerWithErrorBanner: {
      ...logsContainerBase,
      height: `calc(100% - ${LOGVIEWER_TOP_OFFSET} - ${ERROR_BANNER_OFFSET})`,
      top: `calc(${LOGVIEWER_TOP_OFFSET} + ${ERROR_BANNER_OFFSET})`,
    } as CreateCSSProperties<{}>,
  };
};

interface ILogViewerProps extends WithStyles<typeof styles> {
  currentRun: {
    runid: string;
  };
  appId: string;
  artifactName: string;
  toggleLogViewer: () => void;
  withErrorBanner?: boolean;
}

const LogViewerContainer: React.FC<ILogViewerProps> = ({
  classes,
  currentRun,
  appId,
  artifactName,
  toggleLogViewer,
  withErrorBanner = false,
}) => {
  const backgroundElem = React.useRef(null);
  const [dataFetcher] = React.useState(
    new ProgramDataFetcher(
      {
        namespace: getCurrentNamespace(),
        application: appId,
        programType: GLOBALS.programType[artifactName],
        programName: GLOBALS.programId[artifactName],
        runId: currentRun.runid,
      },
      PIPELINE_LOGS_FILTER
    )
  );

  function handleBackgroundClick(e) {
    if (e.target !== backgroundElem.current) {
      return;
    }

    toggleLogViewer();
  }

  return (
    <div className={classes.portalContainer} ref={backgroundElem} onClick={handleBackgroundClick}>
      <div
        className={withErrorBanner ? classes.logsContainerWithErrorBanner : classes.logsContainer}
      >
        <LogViewer dataFetcher={dataFetcher} onClose={toggleLogViewer} showStats={true} />
      </div>
    </div>
  );
};

const StyledLogViewer = withStyles(styles)(LogViewerContainer);

const mapStateToProps = (state) => {
  return {
    currentRun: state.currentRun,
    appId: state.name,
    artifactName: state.artifact.name,
    withErrorBanner: isErrorClassificationBannerDisplayed(state),
  };
};

const PipelineLogViewer = connect(mapStateToProps)(StyledLogViewer);
export default PipelineLogViewer;
