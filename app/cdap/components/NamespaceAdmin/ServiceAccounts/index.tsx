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
import { connect } from 'react-redux';

import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import Button from '@material-ui/core/Button';
import ActionsPopover, { IAction } from 'components/shared/ActionsPopover';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EditConfirmDialog } from './EditConfirmDialog';

const PREFIX = 'features.ServiceAccounts';

const SubTitleBox = styled(Box)`
  margin-bottom: 15px;
`;

const ServiceAccountsView = ({ serviceAccounts, namespaceIdentity, k8snamespace }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [selectedServiceAcccount, setSelectedServiceAcccount] = useState<string>('');
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const showAddDialog = () => {
    setSaveDialogOpen(true);
    setSelectedServiceAcccount(null);
  };

  const showSaveDialog = (serviceAccount) => {
    setSelectedServiceAcccount(serviceAccount);
    setSaveDialogOpen(true);
    setShowPopover(false);
  };

  const closeSaveDialog = () => {
    setSaveDialogOpen(false);
  };

  const showDeleteConfirmation = (serviceAccount) => {
    setSelectedServiceAcccount(serviceAccount);
    setShowPopover(false);
    setDeleteDialogOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      {(!serviceAccounts || !serviceAccounts.length) && (
        <SubTitleBox>
          <Button variant="contained" color="primary" onClick={showAddDialog}>
            {T.translate(`${PREFIX}.addServiceAccount`)}
          </Button>
        </SubTitleBox>
      )}
      <Table columnTemplate="1fr 100px">
        <TableHeader>
          <TableRow>
            <TableCell>{T.translate(`${PREFIX}.serviceAccount`)}</TableCell>
            <TableCell />
          </TableRow>
        </TableHeader>

        <TableBody>
          {serviceAccounts &&
            serviceAccounts.map((serviceAccount) => {
              const actions: IAction[] = [
                {
                  label: T.translate('commons.edit'),
                  actionFn: () => showSaveDialog(serviceAccount.serviceAccount),
                },
                {
                  label: 'separator',
                },
                {
                  label: T.translate('commons.delete'),
                  actionFn: () => showDeleteConfirmation(serviceAccount.serviceAccount),
                },
              ];

              return (
                <TableRow key={`${serviceAccount.serviceAccount}`}>
                  <TableCell>{serviceAccount.serviceAccount}</TableCell>
                  <TableCell>
                    <ActionsPopover actions={actions} showPopover={showPopover} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {isDeleteDialogOpen && (
        <DeleteConfirmDialog
          selectedServiceAcccount={selectedServiceAcccount}
          isShow={isDeleteDialogOpen}
          closeFn={closeDeleteConfirmation}
        ></DeleteConfirmDialog>
      )}
      {isSaveDialogOpen && (
        <EditConfirmDialog
          selectedServiceAcccount={selectedServiceAcccount}
          isShow={isSaveDialogOpen}
          closeFn={closeSaveDialog}
          namespaceIdentity={namespaceIdentity}
          k8snamespace={k8snamespace}
        ></EditConfirmDialog>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    serviceAccounts: state.serviceAccounts,
    namespaceIdentity: state.identity,
    k8snamespace: state.k8snamespace,
  };
};

const ServiceAccounts = connect(mapStateToProps)(ServiceAccountsView);
export default ServiceAccounts;
