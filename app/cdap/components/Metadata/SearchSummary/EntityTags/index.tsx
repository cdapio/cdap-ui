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
import T from 'i18n-react';
import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import { MySearchApi } from 'api/search';
import { IPropertiesResponse, ISearchParams } from 'components/Metadata/SearchSummary/helper';

const I18N_PREFIX = 'features.MetadataSummary';

const EntityContainer = styled.div`
  padding: 20px;
`;

const Headers = styled.h4`
  color: var(--grey01);
  font-size: 1.08rem !important;
  margin: 0;
`;

const TagHeaders = styled(Headers)`
  margin-bottom: 6px;
`;

const TagsContainer = styled.div`
  margin-bottom: 40px;
`;

const TagChip = styled(Chip)`
  margin: 0 6px 8px 0;
  font-size: 1rem;
`;

const TagInput = styled(Input)`
  padding: 4px;
  background: var(--white);
`;

interface IEntityTagsProps {
  onSearch: (searchQuery: string) => void;
  searchParams: ISearchParams;
  properties: IPropertiesResponse;
}

const EntityTags: React.FC<IEntityTagsProps> = ({ searchParams, onSearch, properties }) => {
  const enterTagPlaceholder = T.translate(`${I18N_PREFIX}.enterTagPlaceholder`);
  const [tagNameToAdd, setTagNameToAdd] = useState('');
  const [invalidTagFormat, setInvalidTagFormat] = useState(false);
  const [hasDuplicateTag, setHasDuplicateTag] = useState(false);
  const [userTags, setUserTags] = useState([]);

  function addTag(event) {
    if (tagNameToAdd.trim() === '') {
      event.preventDefault();
      return;
    }
    setInvalidTagFormat(false);
    const isDuplicate =
      userTags.filter((tag) => tagNameToAdd.toLowerCase() === tag.toLowerCase()).length > 0;
    setHasDuplicateTag(isDuplicate);
    if (!isDuplicate) {
      MySearchApi.addTag(searchParams, [tagNameToAdd]).subscribe(
        () => {
          getUserTags();
          setTagNameToAdd('');
        },
        (err) => {
          if (err.statusCode === 400) {
            setInvalidTagFormat(true);
          }
        }
      );
    }
    event.preventDefault();
  }

  function deleteTag(tag: string) {
    const deleteParams = Object.assign({ ...searchParams }, { tag });
    MySearchApi.deleteTag(deleteParams).subscribe(() => {
      getUserTags();
    });
  }

  function onTagInputChange(event) {
    setInvalidTagFormat(false);
    setHasDuplicateTag(false);
    setTagNameToAdd(event.target.value);
  }

  function getUserTags() {
    MySearchApi.getUserTags(searchParams).subscribe((response) => {
      setUserTags(response.tags.map((tag) => tag.name));
    });
  }

  useEffect(() => {
    getUserTags();
  }, []);

  return (
    <EntityContainer>
      <TagHeaders>{T.translate(`${I18N_PREFIX}.businessTags`)}</TagHeaders>
      <TagsContainer>
        {userTags.map((tag) => (
          <TagChip
            key={tag}
            label={tag}
            onClick={onSearch.bind(this, tag)}
            onDelete={deleteTag.bind(this, tag)}
          />
        ))}
        <form onSubmit={addTag}>
          <TagInput
            error={invalidTagFormat || hasDuplicateTag}
            value={tagNameToAdd}
            inputProps={{
              maxLength: 50,
            }}
            placeholder={enterTagPlaceholder}
            onChange={onTagInputChange}
          />
          <IconButton type="submit" aria-label={'' + T.translate(`${I18N_PREFIX}.addTag`)}>
            <Add />
          </IconButton>
        </form>
        {(invalidTagFormat || hasDuplicateTag) && (
          <p className="text-danger">
            <span className="fa fa-exclamation-triangle"></span>
            {invalidTagFormat && T.translate(`${I18N_PREFIX}.invalidTag`)}
            {hasDuplicateTag && T.translate(`${I18N_PREFIX}.duplicateTag`)}
          </p>
        )}
      </TagsContainer>
      <TagHeaders>{T.translate(`${I18N_PREFIX}.systemTags`)}</TagHeaders>
      {properties.systemTags.map((tag) => (
        <TagChip key={tag} label={tag} onClick={onSearch.bind(this, tag)} />
      ))}
      {properties.systemTags.length === 0 && userTags.length === 0 && (
        <Headers>{T.translate(`${I18N_PREFIX}.noTags`)}</Headers>
      )}
    </EntityContainer>
  );
};

export default EntityTags;
