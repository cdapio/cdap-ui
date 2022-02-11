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

import React, { useContext, useEffect, useState } from 'react';
import { isNilOrEmptyString } from 'services/helpers';
import {
  exploreConnection,
  createWorkspace,
  getPluginSpec,
  ENTITY_TRUNCATION_LIMIT,
} from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import countBy from 'lodash/countBy';
import debounce from 'lodash/debounce';
import makeStyle from '@material-ui/core/styles/makeStyles';
import T from 'i18n-react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useLocation, useRouteMatch, useParams } from 'react-router-dom';
import Breadcrumb from 'components/Connections/Browser/GenericBrowser/Breadcrumb';
import SearchField from 'components/Connections/Browser/GenericBrowser/SearchField';
import { BrowserTable } from 'components/Connections/Browser/GenericBrowser/BrowserTable';
import If from 'components/shared/If';
import EmptyMessageContainer from 'components/EmptyMessageContainer';
import ErrorBanner from 'components/shared/ErrorBanner';
import { getApiErrorMessage } from './apiHelpers';
import { getConnectionPath } from 'components/Connections/helper';

const PREFIX = 'features.DataPrep.DataPrepBrowser.GenericBrowser';
import { Redirect } from 'react-router';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import EntityCount from './EntityCount';

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
    entityCount: {
      display: 'inline-flex',
      alignItems: 'center',
      margin: '0 10px',
    },
  };
});

export function GenericBrowser({ initialConnectionId, onEntityChange, selectedParent }) {
  const loc = useLocation();
  const rmatch = useRouteMatch({ path: '/ns/:namespace/connections/:connectionid' });
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const [currentConnection, setCurrentConnection] = useState(initialConnectionId);
  const [entities, setEntities] = useState([]);
  const [propertyHeaders, setPropertyHeaders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [path, setPath] = useState(pathFromUrl);
  const [searchString, setSearchString] = useState('');
  const [searchStringDisplay, setSearchStringDisplay] = useState('');
  const [workspaceId, setWorkspaceId] = useState(null);
  const classes = useStyle();
  const { onWorkspaceCreate, onEntitySelect, selectedPlugin } = useContext(ConnectionsContext);
  const isSelectMode = typeof onEntitySelect === 'function';
  const fetchEntities = async () => {
    setLoading(true);
    try {
      const res = await exploreConnection({
        connectionid: currentConnection,
        path,
      });
      const newEntities = [...res.entities];
      newEntities.sort((a, b) => a.name.localeCompare(b.name));

      clearSearchString();
      setEntities(newEntities);
      setTotalCount(res.totalCount);
      setPropertyHeaders(res.propertyHeaders || []);
      setError(null);
      if (isSelectMode && path === '/') {
        onEntityChange(null);
      }
    } catch (e) {
      setError(`Failed to explore connection. Error: "${e.response}"`);
      setTotalCount(0);
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

  const isSelectable = (entityType: string) => {
    return ['bucket', 'dataset', 'instance', 'database'].includes(entityType.toLowerCase());
  };

  const onExplore = (entity) => {
    const { canBrowse } = entity;

    if (!canBrowse) {
      setLoading(true);

      if (isSelectMode) {
        loadEntitySpec(entity);
      } else {
        onCreateWorkspace(entity);
      }

      return;
    }
    if (isSelectMode && isSelectable(entity.type)) {
      onEntityChange(entity);
    }
    setPath(entity.path);
    setLoading(true);
    clearSearchString();
  };

  const onCreateWorkspace = async (entity) => {
    try {
      const wid = await createWorkspace({
        entity,
        connection: currentConnection,
      });
      if (onWorkspaceCreate) {
        return onWorkspaceCreate(wid);
      }
      setWorkspaceId(wid);
    } catch (e) {
      setError(`Failed to create workspace. Error: ${e}`);
      setLoading(false);
    }
  };

  const loadEntitySpec = async (entity) => {
    try {
      const spec = await getPluginSpec(entity, currentConnection, selectedPlugin);
      const plugin = spec?.relatedPlugins?.[0];
      const properties = plugin?.properties;
      const schema = plugin?.schema;

      onEntitySelect({
        properties,
        schema,
      });
    } catch (e) {
      setError(`Failed to get plugin information. Error: ${getApiErrorMessage(e)}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedParent) {
      loadEntitySpec(selectedParent);
    }
  }, [selectedParent]);

  useEffect(() => {
    if (isNilOrEmptyString(currentConnection)) {
      return setLoading(false);
    }
    fetchEntities();
  }, [currentConnection, path]);

  useEffect(() => {
    const query = new URLSearchParams(loc.search);
    const newConnection = rmatch?.params?.connectionid;
    const urlPath = query.get('path') || '/';
    if (newConnection !== currentConnection) {
      setCurrentConnection(newConnection);
      clearSearchString();
    }
    if (path !== urlPath && !loading) {
      setPath(urlPath);
      clearSearchString();
    }
  }, [loc, rmatch]);

  const lowerSearchString = searchString.trim().toLocaleLowerCase();
  const filteredEntities = lowerSearchString.length
    ? entities.filter((e) => e.name.toLocaleLowerCase().includes(lowerSearchString))
    : entities;

  const isEmpty =
    !Array.isArray(filteredEntities) ||
    (Array.isArray(filteredEntities) && !filteredEntities.length);

  if (workspaceId) {
    return <Redirect to={`/ns/${getCurrentNamespace()}/wrangler/${workspaceId}`} />;
  }

  const entityCounts = countBy(filteredEntities, (entity) => entity.type.toLowerCase());

  return (
    <>
      <div className={classes.topBar}>
        <div className={classes.topBarBreadcrumb}>
          <Breadcrumb path={path} baseLinkPath={getConnectionPath(currentConnection, '')} />
        </div>
        <div className={classes.topBarSearch}>
          <If condition={totalCount > 0}>
            <div className={classes.entityCount}>
              <EntityCount
                entityCounts={entityCounts}
                isFiltered={lowerSearchString.length}
                isTruncated={entities.length === ENTITY_TRUNCATION_LIMIT}
                totalUnfilteredCount={entities.length}
                truncationLimit={ENTITY_TRUNCATION_LIMIT}
              />
            </div>
          </If>
          <SearchField onChange={handleSearchChange} value={searchStringDisplay} />
        </div>
      </div>
      <If condition={loading || !isEmpty}>
        <BrowserTable
          entities={filteredEntities}
          propertyHeaders={propertyHeaders}
          selectedConnection={currentConnection}
          path={path}
          onExplore={onExplore}
          loading={loading}
          isSelectMode={isSelectMode}
          loadEntitySpec={loadEntitySpec}
        />
      </If>
      <If condition={isEmpty && !loading}>
        <EmptyMessageContainer title={T.translate(`${PREFIX}.EmptyMessageContainer.title`)}>
          <ul>
            <li>
              <span className="link-text" onClick={clearSearchString}>
                {T.translate(`features.EmptyMessageContainer.clearLabel`)}
              </span>
              <span>{T.translate(`${PREFIX}.EmptyMessageContainer.suggestion1`)}</span>
            </li>
            <li>
              <span>{T.translate(`${PREFIX}.EmptyMessageContainer.suggestion2`)}</span>
            </li>
          </ul>
        </EmptyMessageContainer>
      </If>
      <If condition={error && !loading}>
        <ErrorBanner error={error} canEditPageWhileOpen={true} />
      </If>
    </>
  );
}
