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

import withStyles, { StyleRules, WithStyles } from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import SecureKeyActionButtons from 'components/SecureKeys/SecureKeyList/SecureKeyActionButtons';
import SecureKeyCreate from 'components/SecureKeys/SecureKeyCreate';
import SecureKeySearch from 'components/SecureKeys/SecureKeySearch';
import Table from 'components/shared/Table';
import TableHead from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';

const styles = (theme): StyleRules => {
  return {
    secureKeysTitle: {
      fontSize: '20px',
      paddingTop: theme.spacing(1),
    },
    secureKeyManager: {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: '40px',
    },
    addSecureKeyButton: {
      gridRow: '1',
      gridColumnStart: '1',
      textTransform: 'none',
    },
    secureKeySearch: {
      gridRow: '1',
      gridColumnStart: '7',
    },
    root: {
      width: '100%',
      display: 'inline-block',
      height: 'auto',
      marginTop: theme.spacing(1),
    },
    row: {
      height: 40,
      cursor: 'pointer',
      hover: {
        cursor: 'pointer',
      },
    },
  };
};

interface ISecureKeyListProps extends WithStyles<typeof styles> {
  renderInTab?: boolean;
  state: any;
  alertSuccess: () => void;
  alertFailure: () => void;
  openEditDialog: (index: number) => void;
  openDeleteDialog: (index: number) => void;
}

const SecureKeyListView: React.FC<ISecureKeyListProps> = ({
  renderInTab,
  classes,
  state,
  alertSuccess,
  alertFailure,
  openEditDialog,
  openDeleteDialog,
}) => {
  const { secureKeys } = state;

  // used for filtering down secure keys
  const [searchText, setSearchText] = React.useState('');

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const filteredSecureKeys = secureKeys.filter(
    (key) =>
      (key.get('name') &&
        key
          .get('name')
          .toLowerCase()
          .includes(searchText.toLowerCase())) ||
      (key.get('description') &&
        key
          .get('description')
          .toLowerCase()
          .includes(searchText.toLowerCase()))
  );

  return (
    <div>
      {!renderInTab && <div className={classes.secureKeysTitle}>Secure keys</div>}
      <div className={classes.secureKeyManager}>
        <Button
          className={classes.addSecureKeyButton}
          color="primary"
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
          data-cy="create-secure-key"
          data-testid="create-secure-key"
        >
          Add secure key
        </Button>
        <div className={classes.secureKeySearch}>
          <SecureKeySearch searchText={searchText} setSearchText={setSearchText} />
        </div>
      </div>

      <Paper className={classes.root}>
        <Table columnTemplate="minmax(20rem, 1fr) 2fr 50px">
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell>Key</TableCell>
              <TableCell>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-cy="secure-key-list" data-testid="secure-key-list">
            {filteredSecureKeys.map((keyMetadata, keyIndex) => {
              const keyID = keyMetadata.get('name');
              return (
                <TableRow
                  key={keyMetadata.get('name')}
                  hover
                  className={classes.row}
                  onClick={() => openEditDialog(keyIndex)}
                  data-cy={`secure-key-row-${keyMetadata.get('name')}`}
                  data-testid={`secure-key-row-${keyMetadata.get('name')}`}
                >
                  <TableCell>{keyID}</TableCell>
                  <TableCell>{keyMetadata.get('description')}</TableCell>
                  <TableCell>
                    <SecureKeyActionButtons
                      openDeleteDialog={openDeleteDialog}
                      keyIndex={keyIndex}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <SecureKeyCreate
        state={state}
        open={createDialogOpen}
        handleClose={() => setCreateDialogOpen(false)}
        alertSuccess={alertSuccess}
        alertFailure={alertFailure}
      />
    </div>
  );
};

const SecureKeyList = withStyles(styles)(SecureKeyListView);
export default SecureKeyList;
