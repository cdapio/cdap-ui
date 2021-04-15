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
import makeStyle from '@material-ui/core/styles/makeStyles';
import { isNilOrEmptyString } from 'services/helpers';
import WidgetWrapper from 'components/ConfigurationGroup/WidgetWrapper';

const useStyle = makeStyle((theme) => {
  return {
    root: {
      display: 'grid',
      gridTemplateRows: '40px auto',
      gridGap: '10px',
      padding: '10px',
      height: '100%',
    },
    gridWrapper: {
      '& .grid.grid-container.grid-compact': {
        maxHeight: '100%',
        '& .grid-row': {
          cursor: 'pointer',
          gridTemplateColumns: '1fr 1fr 1fr 0.8fr 0.5fr',
        },
        '& .grid-row.sub-header': {
          gridTemplateColumns: '1fr 1fr 2.3fr 0fr 0fr',
          borderBottom: 0,
          '& .sub-title': {
            textAlign: 'center',
            borderBottom: `1px solid ${theme.palette.grey[400]}`,
            color: theme.palette.grey[400],
          },
        },
      },
    },
  };
});

export function ActiveConnectionTab({ connector, onConnectorSelection, search, onSearchChange }) {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <WidgetWrapper
        widgetProperty={{
          'widget-type': 'textbox',
          'widget-attributes': {
            placeholder: 'Search connection type',
          },
          label: 'Search',
          name: 'search',
        }}
        pluginProperty={{
          name: 'search',
          macroSupported: false,
          required: false,
        }}
        value={search}
        onChange={onSearchChange}
      />
      <div className={`grid-wrapper ${classes.gridWrapper}`}>
        <div className="grid grid-container grid-compact">
          <div className="grid-header">
            <div className="grid-row sub-header">
              <div />
              <div />
              <div className="sub-title">Artifact Information</div>
            </div>
            <div className="grid-row">
              <div>Name</div>
              <div>Description</div>
              <div>Artifact</div>
              <div>Version</div>
              <div>Scope</div>
            </div>
          </div>
          <div className="grid-body">
            {connector
              .filter((conn) => {
                if (isNilOrEmptyString(search)) {
                  return conn;
                }
                if (conn.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                  return conn;
                }
                return false;
              })
              .map((conn, i) => {
                return (
                  <div key={i} className="grid-row" onClick={() => onConnectorSelection(conn)}>
                    <div>{conn.name}</div>
                    <div>{conn.description}</div>
                    <div>{conn.artifact.name}</div>
                    <div>{conn.artifact.version}</div>
                    <div>{conn.artifact.scope}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
