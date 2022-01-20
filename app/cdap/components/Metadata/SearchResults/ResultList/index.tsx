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
import styled from 'styled-components';
import { ISearchResult } from 'components/Metadata/SearchResults/helper';
import T from 'i18n-react';
import { Link } from 'react-router-dom';
import { dateTimeFormat } from 'services/DataFormatter';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

const I18N_PREFIX = 'features.MetadataSearch';

const Container = styled.ul`
  list-style: none;
  padding: 0;
`;

const List = styled.li`
  border-bottom: 1px solid var(--grey05);
  padding: 8px 15px 15px 15px;
`;

const Title = styled.h4`
  font-size: 1.23rem !important;
  margin: 0;
  & a {
    color: var(--grey01);
  }
`;

const Description = styled.p`
  color: var(--grey03);
  margin: 0;
  padding: 0;
`;

interface IResultListProps {
  results: ISearchResult[];
  currentPage: number;
  pageSize: number;
  query: string;
}

const ResultList: React.FC<IResultListProps> = ({ results, currentPage, pageSize, query }) => {
  const endIndex = currentPage * pageSize;
  const startIndex = endIndex - pageSize;
  const pageResults = results.slice(startIndex, endIndex);
  return (
    <Container>
      {pageResults.map((result) => (
        <List key={result.name}>
          <Title>
            <Link
              to={getMetadataPageUrl('summary', {
                query,
                entityType: result.entityTypeState,
                entityId: result.name,
              })}
            >
              {result.name}
            </Link>
          </Title>
          <Description>
            <span className={result.icon}></span> {result.type}
          </Description>
          <Description>
            {T.translate(`${I18N_PREFIX}.created`)} {dateTimeFormat(Number(result.createDate))}
          </Description>
          <Description>{result.description}</Description>
        </List>
      ))}
    </Container>
  );
};

export default ResultList;
