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
import { isNilOrEmptyString } from 'services/helpers';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import debounce from 'lodash/debounce';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useLocation } from 'react-router-dom';
import Breadcrumb from 'components/Connections/Browser/GenericBrowser/Breadcrumb';
import SearchField from 'components/Connections/Browser/GenericBrowser/SearchField';
import { BrowserTable } from 'components/Connections/Browser/GenericBrowser/BrowserTable';

const useStyle = makeStyle(() => {
  return {
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
    setLoading(true);
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

  if (error) {
    throw error;
  }

  const filteredEnitities = searchString.length
    ? entities.filter((e) => e.name.toLowerCase().includes(searchString.toLocaleLowerCase()))
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
      <BrowserTable
        entities={filteredEnitities}
        selectedConnection={selectedConnection}
        path={path}
        onExplore={onExplore}
        loading={loading}
      />
    </React.Fragment>
  );
}
