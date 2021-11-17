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

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import ProfilesListView from 'components/Cloud/Profiles/ListView';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { importProfile } from 'components/Cloud/Profiles/Store/ActionCreator';
import { Label, Input } from 'reactstrap';
import { Theme } from 'services/ThemeHelper';
import If from 'components/shared/If';

const useStyle = makeStyles((theme) => {
  return {
    subtitleSection: {
      '& > *': {
        marginRight: '15px',
      },
    },
    fileInput: {
      display: 'none',
    },
    inputLabel: {
      marginBottom: 0,
      cursor: 'inherit',
    },
  };
});

const ComputeProfiles: React.FC = () => {
  const classes = useStyle();

  return (
    <div>
      <div className={classes.subtitleSection}>
        <If condition={Theme.showCreateProfile !== false}>
          <Link to={`/ns/${getCurrentNamespace()}/profiles/create`}>
            <Button variant="contained" color="primary">
              Create Profile
            </Button>
          </Link>
          <Button color="primary">
            <Label for="import-profile" className={classes.inputLabel}>
              Import
              {/* The onClick here is to clear the file, so if the user uploads the same file
            twice then we can show the error, instead of showing nothing */}
              <Input
                type="file"
                accept=".json"
                id="import-profile"
                className={classes.fileInput}
                onChange={importProfile.bind(this, getCurrentNamespace())}
                onClick={(e) => (e.target.value = null)}
              />
            </Label>
          </Button>
        </If>
      </div>
      <ProfilesListView namespace={getCurrentNamespace()} />
    </div>
  );
};

export default ComputeProfiles;
