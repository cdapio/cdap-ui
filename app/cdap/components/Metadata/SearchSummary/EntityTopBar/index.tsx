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
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { Theme } from 'services/ThemeHelper';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

const I18N_PREFIX = 'features.MetadataSummary';

const Container = styled.div`
  background: white;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--grey05);
  height: 50px;
`;

const EntityDetail = styled.div`
  padding: 0 30px 0 10px;
  width: 200px;
  border-left: 1px solid var(--grey05);
`;

const EntityId = styled.h3`
  font-size: 1.24rem !important;
  margin: 0 0 3px 0;
`;

const EntityType = styled.div`
  color: var(--grey03);
  font-size: 0.92rem;
`;

const EntityTab = styled(Tab)`
  font-size: 1rem !important;
`;

interface IEntityTopBarProps {
  goBack: () => void;
  defaultTab: number;
  entityId: string;
  entityType: string;
  query: string;
}

const EntityTopBar: React.FC<IEntityTopBarProps> = ({
  goBack,
  defaultTab,
  entityType,
  entityId,
  query,
}) => {
  const entityTypeTabAriaLabel = T.translate(`${I18N_PREFIX}.entityTypeTabAriaLabel`);
  const [redirectUrl, setRedirectUrl] = useState(null);

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  function handleTabChange(event, newValue: number) {
    if (defaultTab !== newValue) {
      setRedirectUrl(
        getMetadataPageUrl(newValue === 1 ? 'lineage' : 'summary', {
          query,
          entityType,
          entityId,
        })
      );
    }
  }

  return (
    <Container>
      <div>
        <IconButton onClick={goBack}>
          <ChevronLeft />
        </IconButton>
      </div>
      <EntityDetail>
        <EntityId>{entityId}</EntityId>
        <EntityType>
          <span className="icon-datasets"></span> <span>Dataset</span>
        </EntityType>
      </EntityDetail>
      <Tabs value={defaultTab} onChange={handleTabChange} aria-label={`${entityTypeTabAriaLabel}`}>
        <EntityTab
          label={T.translate(`${I18N_PREFIX}.summary`)}
          id={'0'}
          aria-controls="tabpanel-summary"
        />
        {Theme.showLineage !== false && (
          <EntityTab
            label={T.translate(`${I18N_PREFIX}.lineage`)}
            id={'1'}
            aria-controls="tabpanel-lineage"
          />
        )}
      </Tabs>
    </Container>
  );
};

export default EntityTopBar;
