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

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { ConnectionsContext, IConnectionMode } from 'components/Connections/ConnectionsContext';

const useStyle = makeStyle(() => {
  return {
    link: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        textDecoration: 'none',
      },
    },
    button: {
      width: '100%',
      backgroundColor: 'white',
    },
  };
});
export function CreateConnectionBtn() {
  const { mode } = React.useContext(ConnectionsContext);
  const classes = useStyle();
  return (
    <Link to={`/ns/${getCurrentNamespace()}/connections/create`} className={classes.link}>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        data-cy="add-connection-button"
        data-testid="add-connection-button"
      >
        Add Connection
      </Button>
    </Link>
  );
}
