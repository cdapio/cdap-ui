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

import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { connect } from 'react-redux';
import { IDriver } from 'components/NamespaceAdmin/store';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import { humanReadableDate, objectQuery } from 'services/helpers';
import ActionsPopover, { IAction } from 'components/shared/ActionsPopover';
import { deleteDriver } from 'components/NamespaceAdmin/store/ActionCreator';
import { Button } from '@material-ui/core';
import If from 'components/shared/If';
import ArtifactUploadWizard from 'components/CaskWizards/ArtifactUpload';
import ConfirmationModal from 'components/shared/ConfirmationModal';

const useStyle = makeStyles((theme) => {
  return {
    delete: {
      color: objectQuery(theme, 'palette', 'red', 100),
    },
    subtitle: {
      marginBottom: '15px',
    },
  };
});

interface IDriversProps {
  drivers: IDriver[];
}

const DriversView: React.FC<IDriversProps> = ({ drivers }) => {
  const classes = useStyle();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  function toggleUploadArtifact() {
    setIsUploadOpen(!isUploadOpen);
  }

  function handleDelete() {
    deleteDriver(driverToDelete).subscribe(handleConfirmationClose, (err) => {
      setDeleteError(err);
    });
  }

  function handleConfirmationClose() {
    setDriverToDelete(null);
    setDeleteError(null);
  }

  let confirmDeleteElem;
  if (driverToDelete) {
    confirmDeleteElem = (
      <div>
        Are you sure you want to delete{' '}
        <strong>
          <em>{driverToDelete.name}</em>
        </strong>
        ?
      </div>
    );
  }

  return (
    <div>
      <div className={classes.subtitle}>
        <Button variant="contained" color="primary" onClick={toggleUploadArtifact}>
          Upload Driver
        </Button>
      </div>
      <div>
        <Table columnTemplate="1fr 1fr 2fr 1fr 75px">
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Class name</TableCell>
              <TableCell>Installed</TableCell>
              <TableCell />
            </TableRow>
          </TableHeader>

          <TableBody>
            {drivers.map((driver) => {
              const actions: IAction[] = [
                {
                  label: 'Delete',
                  actionFn: () => setDriverToDelete(driver),
                  className: classes.delete,
                },
              ];

              return (
                <TableRow key={`${driver.name}-${driver.artifact.version}`}>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.artifact.version}</TableCell>
                  <TableCell>{driver.className}</TableCell>
                  <TableCell>{humanReadableDate(driver.creationTime, true)}</TableCell>
                  <TableCell>
                    <ActionsPopover actions={actions} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <If condition={isUploadOpen}>
        <ArtifactUploadWizard
          isOpen={true}
          buildSuccessInfo={true}
          onClose={toggleUploadArtifact}
          hideUploadHelper={true}
        />
      </If>

      <ConfirmationModal
        headerTitle="Delete driver"
        toggleModal={handleConfirmationClose}
        confirmationElem={confirmDeleteElem}
        confirmButtonText="Delete"
        confirmFn={handleDelete}
        cancelFn={handleConfirmationClose}
        isOpen={!!driverToDelete}
        errorMessage={!deleteError ? '' : 'Failed to delete driver'}
        extendedMessage={deleteError}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    drivers: state.drivers,
  };
};

const Drivers = connect(mapStateToProps)(DriversView);
export default Drivers;
