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

import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import T from 'i18n-react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { MySearchApi } from 'api/search';
import { getCurrentNamespace } from 'services/NamespaceStore';
import SearchBar from 'components/Metadata/SearchBar';
import { useParams } from 'react-router';
import { processProperties } from 'components/Metadata/SearchSummary/helper';
import EntityTopBar from 'components/Metadata/SearchSummary/EntityTopBar';
import EntityTags from 'components/Metadata/SearchSummary/EntityTags';
import EntitySchema from 'components/Metadata/SearchSummary/EntitySchema';
import EntityProperties from 'components/Metadata/SearchSummary/EntityProperties';
import { ISearchMetadata, IPropertiesResponse } from 'components/Metadata/SearchSummary/helper';
import { Theme } from 'services/ThemeHelper';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

const I18N_PREFIX = 'features.MetadataSummary';

const Container = styled.div`
  background: var(--grey07);
`;

const Loader = styled.h3`
  font-size: 1.4rem !important;
  margin: 15px;
  font-weight: 500;
  color: var(--grey01);
  white-space: nowrap;
`;

const Columns = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 212px);
`;

const Column = styled.div`
  width: 30%;
  border-right: 4px solid var(--grey05);
  &:last-child {
    width: 40%;
    border: none;
  }
`;

const SearchSummary: React.FC = () => {
  const params = useParams() as any;
  const query = params.query;
  const entityId = params.entityId;
  const entityType = params.entityType;
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [externalDatasetProperties, setExternalDatasetProperties] = useState({});
  const [properties, setProperties] = useState<IPropertiesResponse>({
    systemTags: [],
    hasExternalDataset: false,
    activePropertyTab: 0,
    properties: {
      system: {
        schema: null,
      },
      user: {},
      isUserEmpty: false,
      isSystemEmpty: false,
    },
  });

  const searchParams = {
    namespace: getCurrentNamespace(),
    entityId,
    entityType,
  };

  useEffect(() => {
    setLoading(true);
    MySearchApi.properties(searchParams).subscribe((response: ISearchMetadata) => {
      setLoading(false);
      const processedProperties = processProperties(response);
      setProperties(processedProperties);
      if (processedProperties.hasExternalDataset) {
        fetchExternalDatasetProperties();
      }
    });
  }, []);

  function fetchExternalDatasetProperties() {
    MySearchApi.getDatasetDetail(searchParams).subscribe((response) => {
      setExternalDatasetProperties(response.spec.properties);

      if (Object.keys(externalDatasetProperties).length > 0) {
        const updatedProperties = Object.assign(
          { ...properties.properties },
          { isUserEmpty: false }
        );
        setProperties(
          Object.assign(
            { ...properties },
            {
              activePropertyTab: 0,
              properties: updatedProperties,
            }
          )
        );
      }
    });
  }

  function onSearch(searchQuery: string) {
    setRedirectUrl(getMetadataPageUrl('search', { query: searchQuery.trim() }));
  }

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  function goBack() {
    onSearch(query);
  }

  function onPropertiesChange(updatedProperties: IPropertiesResponse) {
    setProperties(updatedProperties);
  }

  return (
    <>
      <Helmet
        title={T.translate(`${I18N_PREFIX}.pageTitle`, {
          productName: Theme.productName,
          entityId,
        })}
      />
      <SearchBar query={query} onSearch={onSearch} />
      <Container>
        {loading && (
          <Loader>
            <span className="fa fa-spinner fa-spin"></span>{' '}
            <span>{T.translate(`${I18N_PREFIX}.loading`)}</span>
          </Loader>
        )}
        {!loading && (
          <>
            <EntityTopBar
              query={query}
              defaultTab={0}
              entityType={entityType}
              entityId={entityId}
              goBack={goBack}
            />
            <Columns>
              <Column>
                <EntityTags
                  properties={properties}
                  searchParams={searchParams}
                  onSearch={onSearch}
                />
              </Column>
              <Column>
                <EntitySchema properties={properties} />
              </Column>
              <Column>
                <EntityProperties
                  properties={properties}
                  searchParams={searchParams}
                  externalDatasetProperties={externalDatasetProperties}
                  onPropertiesChange={onPropertiesChange}
                />
              </Column>
            </Columns>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchSummary;
