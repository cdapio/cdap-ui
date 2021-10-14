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
import { IPreference } from 'components/NamespaceAdmin/store';
import Button from '@material-ui/core/Button';
import SetPreferenceModal, {
  PREFERENCES_LEVEL,
} from 'components/FastAction/SetPreferenceAction/SetPreferenceModal';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';

const useStyle = makeStyles((theme) => {
  return {
    subtitleSection: {
      marginBottom: '15px',
    },
  };
});

interface IPreferencesProps {
  preferences: IPreference[];
}

const PreferencesView: React.FC<IPreferencesProps> = ({ preferences }) => {
  const classes = useStyle();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div>
      <div className={classes.subtitleSection}>
        <Button color="primary" variant="contained" onClick={toggleModal}>
          Edit
        </Button>
      </div>

      <Table columnTemplate="1fr 1fr 200px">
        <TableHeader>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Scope</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {preferences.map((pref) => {
            return (
              <TableRow key={`${pref.key}-${pref.value}-${pref.scope}`}>
                <TableCell>{pref.key}</TableCell>
                <TableCell>{pref.value}</TableCell>
                <TableCell>{pref.scope}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {isModalOpen ? (
        <SetPreferenceModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          setAtLevel={PREFERENCES_LEVEL.NAMESPACE}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    preferences: state.preferences,
  };
};

const Preferences = connect(mapStateToProps)(PreferencesView);
export default Preferences;
