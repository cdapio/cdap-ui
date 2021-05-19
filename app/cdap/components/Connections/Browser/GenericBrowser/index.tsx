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

import LoadingSVG from 'components/LoadingSVG';
import { humanReadableDate, isNilOrEmptyString, objectQuery } from 'services/helpers';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import * as React from 'react';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import If from 'components/If';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import makeStyle from '@material-ui/core/styles/makeStyles';
import Table from 'components/Table';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useLocation } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import SearchField from './SearchField';

const useStyle = makeStyle(() => {
  return {
    nameWrapper: {
      display: 'flex',
      gap: '5px',
    },
    grid: {
      height: '100%',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    topBar: {
      margin: '8px 0 8px 10px',
      display: 'flex',
      alignItems: 'center',
    },
    topBarBreadcrumb: {
      flex: '0.5',
    },
    topBarSearch: {
      flex: '0.5',
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '8px',
    },
  };
});

const ICON_MAP = {
  directory: <FolderIcon />,
  file: <DescriptionIcon />,
};

export function GenericBrowser({ selectedConnection }) {
  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const [entities, setEntities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [path, setPath] = React.useState(pathFromUrl);
  const [searchString, setSearchString] = React.useState('');
  const [searchStringDisplay, setSearchStringDisplay] = React.useState('');
  const classes = useStyle();

  const fetchEntities = async () => {
    try {
      const res = await exploreConnection({
        connectionid: selectedConnection,
        path,
      });
      setEntities(res.entities);
    } catch (e) {
      setError(`Failed to explore connection : "${e.message}"`);
    } finally {
      setLoading(false);
    }
  };
  const debouncedSetSearchString = debounce(setSearchString, 300);
  const handleSearchChange = (newSearchString) => {
    setSearchStringDisplay(newSearchString);
    debouncedSetSearchString(newSearchString);
  };
  const clearSearchString = () => {
    debouncedSetSearchString.cancel();
    setSearchStringDisplay('');
    setSearchString('');
  };
  const onExplore = (entityName) => {
    if (path === '/') {
      setPath(`/${entityName}`);
    } else {
      setPath(`${path}/${entityName}`);
    }
    setLoading(true);
    clearSearchString();
  };
  React.useEffect(() => {
    if (isNilOrEmptyString(selectedConnection)) {
      return setLoading(false);
    }
    fetchEntities();
  }, [selectedConnection, path]);

  React.useEffect(() => {
    const query = new URLSearchParams(loc.search);
    const urlPath = query.get('path') || '/';
    if (path !== urlPath) {
      setPath(urlPath);
      clearSearchString();
    }
  }, [loc]);
  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <LoadingSVG />
      </div>
    );
  }

  if (error) {
    throw error;
  }
  if (!Array.isArray(entities) || (Array.isArray(entities) && !entities.length)) {
    return <div>No entities available</div>;
  }
  let headers = ['Name', 'Type'];
  const properties = objectQuery(entities, 0, 'properties') || [];
  headers = [...headers, ...properties.map((prop) => capitalize(prop.key))];
  const columnTemplate = headers.map(() => '1fr').join(' ');
  const getPath = (suffix) => (path === '/' ? `/${suffix}` : `${path}/${suffix}`);

  const filteredEnitities = searchString.length
    ? entities.filter((e) => e.name.includes(searchString))
    : entities;

  return (
    <React.Fragment>
      <div className={classes.topBar}>
        <div className={classes.topBarBreadcrumb}>
          <Breadcrumb
            path={path}
            baseLinkPath={`/ns/${getCurrentNamespace()}/connections/${selectedConnection}?path=`}
          />
        </div>
        <div className={classes.topBarSearch}>
          <SearchField onChange={handleSearchChange} value={searchStringDisplay} />
        </div>
      </div>
      <Table columnTemplate={columnTemplate} classes={{ grid: classes.grid }}>
        <TableHeader>
          <TableRow>
            {headers.map((header) => {
              return <TableCell key={header}>{header}</TableCell>;
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEnitities.map((entity, i) => {
            return (
              <TableRow
                key={i}
                to={`/ns/${getCurrentNamespace()}/connections/${selectedConnection}?path=${getPath(
                  entity.name
                )}`}
                onClick={() => onExplore(entity.name)}
              >
                <TableCell>
                  <div className={classes.nameWrapper}>
                    <If condition={ICON_MAP[entity.type]}>{ICON_MAP[entity.type]}</If>
                    <div>{entity.name}</div>
                  </div>
                </TableCell>
                <TableCell>{entity.type}</TableCell>
                {entity.properties.map((prop) => {
                  if (prop.type === 'Timestamp') {
                    return <TableCell key={prop.value}>{humanReadableDate(prop.value)}</TableCell>;
                  }
                  return <TableCell key={prop.value}>{prop.value}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
