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
import { Redirect } from 'react-router-dom';
import T from 'i18n-react';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Search from '@material-ui/icons/Search';
import FilledInput from '@material-ui/core/FilledInput';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Theme } from 'services/ThemeHelper';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

const I18N_PREFIX = 'features.MetadataHome';

const Container = styled.div`
  margin: 0 auto;
  padding: 0 15px;
  width: 66.6%;
`;

const StyledFormControl = styled(FormControl)`
  margin-top: 150px;
`;

const SearchTipsTitle = styled.p`
  color: #3cc801;
  font-size: 18px;
  margin: 45px 0 10px 0;
  border-bottom: 1px solid #999;
`;

const SearchTipsSubTitle = styled.p`
  font-size: 15px;
`;

const SearchTipsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SearchTips = styled.li`
  margin: 20px 0;
`;

const Highlight = styled.span`
  color: #3cc801;
`;

const MetadataHome: React.FC = () => {
  const searchQueryRegex = new RegExp('^(?![*]).*$');
  const [error, setError] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    const isValid = searchQueryRegex.test(searchQuery);
    setError(!isValid);
    if (event.key === 'Enter' && searchQuery.trim() !== '' && isValid) {
      setRedirectUrl(getMetadataPageUrl('search', { query: searchQuery.trim() }));
    }
  };

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <Container>
      <Helmet
        title={T.translate(`${I18N_PREFIX}.pageTitle`, {
          productName: Theme.productName,
        })}
      />
      <StyledFormControl fullWidth variant="filled">
        <InputLabel htmlFor="search-query">
          {T.translate(`${I18N_PREFIX}.searchPlaceholder`)}
        </InputLabel>
        <FilledInput
          error={error}
          id="search-query"
          type="text"
          onKeyUp={handleSearch}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
        />
      </StyledFormControl>
      <SearchTipsTitle>{T.translate(`${I18N_PREFIX}.searchTipsTitle`)}</SearchTipsTitle>
      <SearchTipsSubTitle>{T.translate(`${I18N_PREFIX}.searchTipsSubTitle`)}</SearchTipsSubTitle>
      <SearchTipsList>
        <SearchTips>
          <strong>{T.translate(`${I18N_PREFIX}.searchTips1.query`)}</strong>{' '}
          {T.translate(`${I18N_PREFIX}.searchTips1.description`)}{' '}
          <Highlight>{T.translate(`${I18N_PREFIX}.searchTips1.highlight`)}</Highlight>{' '}
          <i>{T.translate(`${I18N_PREFIX}.searchTips1.example`)}</i>
        </SearchTips>
        <SearchTips>
          <strong>{T.translate(`${I18N_PREFIX}.searchTips2.query`)}</strong>{' '}
          {T.translate(`${I18N_PREFIX}.searchTips2.description`)}{' '}
          <Highlight>{T.translate(`${I18N_PREFIX}.searchTips2.highlight`)}</Highlight>{' '}
          <i>{T.translate(`${I18N_PREFIX}.searchTips2.example`)}</i>
        </SearchTips>
        <SearchTips>
          <strong>{T.translate(`${I18N_PREFIX}.searchTips3.query`)}</strong>{' '}
          {T.translate(`${I18N_PREFIX}.searchTips3.description`)}{' '}
          <Highlight>{T.translate(`${I18N_PREFIX}.searchTips3.highlight`)}</Highlight>{' '}
          <i>{T.translate(`${I18N_PREFIX}.searchTips3.example`)}</i>
        </SearchTips>
        <SearchTips>
          <strong>{T.translate(`${I18N_PREFIX}.searchTips4.query`)}</strong>{' '}
          {T.translate(`${I18N_PREFIX}.searchTips4.description`)}{' '}
          <Highlight>{T.translate(`${I18N_PREFIX}.searchTips4.highlight`)}</Highlight>{' '}
          <i>{T.translate(`${I18N_PREFIX}.searchTips4.example`)}</i>
        </SearchTips>
        <SearchTips>
          <strong>{T.translate(`${I18N_PREFIX}.searchTips5.query`)}</strong>{' '}
          {T.translate(`${I18N_PREFIX}.searchTips5.description`)}{' '}
          <Highlight>{T.translate(`${I18N_PREFIX}.searchTips5.highlight`)}</Highlight>{' '}
          {T.translate(`${I18N_PREFIX}.searchTips5.description1`)}{' '}
          <i>{T.translate(`${I18N_PREFIX}.searchTips5.example`)}</i>
        </SearchTips>
      </SearchTipsList>
    </Container>
  );
};

export default MetadataHome;
