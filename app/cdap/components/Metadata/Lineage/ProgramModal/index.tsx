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

import React, { useState, useEffect } from 'react';
import T from 'i18n-react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import { MySearchApi } from 'api/search';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { duration } from 'moment';
import { dateTimeFormat } from 'services/DataFormatter';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { INodeDisplay } from 'components/Metadata/Lineage/helper';

const I18N_PREFIX = 'features.MetadataLineage.programRunInfo';

const InfoDialogContent = styled(DialogContent)`
  min-width: 520px;
`;

const Header = styled(DialogTitle)`
  h2 {
    font-size: 1.5em;
  }
`;

const SubHeader = styled.div`
  font-size: 0.72em;
`;

const RunsColumn = styled(Grid)`
  text-align: center;
`;

const InfoGrid = styled(Grid)`
  margin-top: 20px;
`;

const EntityIcon = styled.span`
  margin-right: 5px;
`;

interface IProgramModalProps {
  node: INodeDisplay;
  onClose: () => void;
}

const ProgramModal: React.FC<IProgramModalProps> = ({ node, onClose }) => {
  const [programRunInfo, setProgramRunInfo] = useState({
    start: 0,
    status: null,
    duration: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeRunIndex, setActiveRunIndex] = useState(0);

  useEffect(() => {
    if (!node || !node.runs[0]) {
      return;
    }
    getProgramStatus();
  }, [node, activeRunIndex]);

  function getProgramStatus() {
    const searchParams = {
      namespace: getCurrentNamespace(),
      appId: node.applicationId,
      programType: node.entityType,
      programId: node.entityId,
      runId: node.runs[activeRunIndex],
    };
    setIsLoading(true);
    MySearchApi.getProgramRunStatus(searchParams).subscribe((response) => {
      setIsLoading(false);
      setProgramRunInfo({
        start: response.start * 1000,
        status: response.status,
        duration: response.end ? (response.end - response.start) * 1000 : 0,
      });
    });
  }

  function prevRun() {
    setActiveRunIndex(activeRunIndex - 1);
  }

  function nextRun() {
    setActiveRunIndex(activeRunIndex + 1);
  }

  if (!node || !node.runs[0]) {
    return null;
  }

  const isSucceeded = programRunInfo.status === 'COMPLETED' || programRunInfo.status === 'RUNNING';
  return (
    <Dialog open={true} onClose={onClose}>
      <Header>
        {node.label}
        <SubHeader>
          <EntityIcon className={node.icon}></EntityIcon>
          {node.displayType}
        </SubHeader>
      </Header>
      <InfoDialogContent>
        {isLoading && (
          <div>
            <span className="fa fa-spinner fa-spin"></span>{' '}
            <span>{T.translate(`${I18N_PREFIX}.runId`)}</span>
          </div>
        )}
        {!isLoading && (
          <>
            <Grid
              container
              direction="row"
              wrap="nowrap"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <h5>{T.translate(`${I18N_PREFIX}.runId`)}</h5>
                {node.runs[activeRunIndex]}
              </Grid>
              <RunsColumn item>
                <h5>{T.translate(`${I18N_PREFIX}.runs`)}</h5>
                <IconButton onClick={prevRun} disabled={activeRunIndex === 0}>
                  <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                {activeRunIndex + 1}/{node.runs.length}
                <IconButton onClick={nextRun} disabled={activeRunIndex === node.runs.length - 1}>
                  <ArrowForwardIos fontSize="small" />
                </IconButton>
              </RunsColumn>
            </Grid>
            <InfoGrid container direction="row" wrap="nowrap" justifyContent="space-between">
              <Grid item>
                <h5>{T.translate(`${I18N_PREFIX}.started`)}</h5>
                {dateTimeFormat(programRunInfo.start, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </Grid>
              <Grid item>
                <h5>{T.translate(`${I18N_PREFIX}.duration`)}</h5>
                {duration(programRunInfo.duration, 'milliseconds').humanize()}
              </Grid>
              <Grid item>
                <h5>{T.translate(`${I18N_PREFIX}.status`)}</h5>
                <EntityIcon
                  className={classnames('fa fa-circle', {
                    'text-success': isSucceeded,
                    'text-danger': !isSucceeded,
                  })}
                ></EntityIcon>
                {programRunInfo.status}
              </Grid>
            </InfoGrid>
          </>
        )}
      </InfoDialogContent>
      <DialogActions>
        <PrimaryTextButton onClick={onClose}>
          {T.translate(`${I18N_PREFIX}.close`)}
        </PrimaryTextButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramModal;
