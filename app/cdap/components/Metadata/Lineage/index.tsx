/*
 * Copyright © 2022 Cask Data, Inc.
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
import { Redirect, useHistory, useParams, useLocation } from 'react-router-dom';
import T from 'i18n-react';
import { MySearchApi } from 'api/search';
import Helmet from 'react-helmet';
import { getCurrentNamespace } from 'services/NamespaceStore';
import SearchBar from 'components/Metadata/SearchBar';
import EntityTopBar from 'components/Metadata/SearchSummary/EntityTopBar';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Theme } from 'services/ThemeHelper';
import {
  secondLineageParser,
  ILineageResponse,
  INodeDisplay,
} from 'components/Metadata/Lineage/helper';
import ExpandableTimeRange from 'components/shared/TimeRangePicker/ExpandableTimeRange';
import LineageDiagram from 'components/Metadata/Lineage/LineageDiagram';
import ProgramModal from 'components/Metadata/Lineage/ProgramModal';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';
import { TimeRangeOptions } from 'components/Metadata/Lineage/timeRangeOptions';
import {
  Container,
  Loader,
  TimeRange,
  DateSelect,
  CustomDateRange,
  FieldLineage,
} from 'components/Metadata/Lineage/styles';

const I18N_PREFIX = 'features.MetadataLineage';

interface IDateRange {
  label: any;
  start: string | number;
  end: string | number;
  id: string;
}

const Lineage: React.FC = () => {
  const params = useParams() as any;
  const query = params.query;
  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const startDate = queryParams.get('start') || TimeRangeOptions[1].start;
  const endDate = queryParams.get('end') || TimeRangeOptions[1].end;
  const history = useHistory();
  const defaults = getDefaultTimeRange();
  const [dateRange, setDateRange] = useState(defaults.selectedDateRange);
  const [customDateTimeRange, setCustomDateTimeRange] = useState(defaults.customRange);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldLevelLineageLink, setfieldLevelLineageLink] = useState(null);
  const [lineageData, setLineageData] = useState({
    connections: [],
    nodes: [],
    graph: null,
  });
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    // In case custom selection, use custom date time range.
    const isCustom = dateRange.start === TimeRangeOptions[0].start;
    if (isCustom && (!customDateTimeRange.start || !customDateTimeRange.end)) {
      return;
    }
    const dataRange = {
      start: isCustom ? customDateTimeRange.start : dateRange.start,
      end: isCustom ? customDateTimeRange.end : dateRange.end,
    };
    getLineage(dataRange);
  }, [dateRange, customDateTimeRange]);

  function getLineage(searchParams) {
    const baseParams = {
      namespace: getCurrentNamespace(),
      entityId: params.entityId,
      entityType: params.entityType,
      start: dateRange.start,
      end: dateRange.end,
      levels: 1,
      rollup: 'workflow',
      ...searchParams,
    };
    setLoading(true);
    MySearchApi.getLineage(baseParams).subscribe((response: ILineageResponse) => {
      setLoading(false);
      const fieldLevelLineageLinkBase = (window as any)
        .getAbsUIUrl({
          namespaceId: baseParams.namespace,
          entityType: params.entityType,
          entityId: params.entityId,
        })
        .concat('/fields');
      setfieldLevelLineageLink(addTimeRangeParams(fieldLevelLineageLinkBase));
      secondLineageParser(response, query, baseParams).then((parsedResponse) => {
        setLineageData(parsedResponse);
      });
    });
  }

  function addTimeRangeParams(url: string) {
    url += `?time=${dateRange.id}`;
    if (dateRange.id === 'custom') {
      url += `&start=${startDate}&end=${endDate}`;
    }
    return url;
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

  function onDateRangeChange(event) {
    const selectedRange = TimeRangeOptions.find((option) => option.start === event.target.value);
    setDateRange(selectedRange);
    if (selectedRange.start !== TimeRangeOptions[0].start) {
      addParams(selectedRange);
    }
  }

  function addParams(currentDateRange: IDateRange) {
    const urlParams = new URLSearchParams();
    urlParams.append('start', `${currentDateRange.start}`);
    urlParams.append('end', `${currentDateRange.end}`);
    history.push({ search: urlParams.toString() });
  }

  function onCustomDateRangeChange({ start, end }) {
    const customRange = { start, end: end ? end : parseInt(`${Date.now() / 1000}`, 10) };
    setCustomDateTimeRange(customRange);
    addParams(customRange as IDateRange);
  }

  function getDefaultTimeRange() {
    const match = TimeRangeOptions.filter(
      (option) => option.start === startDate && option.end === endDate
    );
    let customRange = { start: null, end: null };
    // if custom range set the date & time range.
    if (match.length === 0) {
      const last7Days = parseInt(`${new Date().setDate(new Date().getDate() - 7) / 1000}`, 10);
      customRange = {
        start: parseInt(startDate, 10) || last7Days,
        end: parseInt(endDate, 10) || parseInt(`${Date.now() / 1000}`, 10),
      };
    }
    return {
      selectedDateRange: match.length > 0 ? match[0] : TimeRangeOptions[0],
      customRange,
    };
  }

  function addSelectedNode(node: INodeDisplay) {
    setSelectedNode(node);
  }

  function clearSelectedNode() {
    setSelectedNode(null);
  }

  return (
    <>
      <Helmet
        title={T.translate(`${I18N_PREFIX}.pageTitle`, {
          productName: Theme.productName,
          entityId: params.entityId,
        })}
      />
      <SearchBar query={query} onSearch={onSearch} />
      <Container>
        <EntityTopBar
          query={query}
          defaultTab={1}
          entityType={params.entityType}
          entityId={params.entityId}
          goBack={goBack}
        />
        {loading && (
          <Loader>
            <span className="fa fa-spinner fa-spin"></span>{' '}
            <span>{T.translate(`${I18N_PREFIX}.loading`)}</span>
          </Loader>
        )}
        {!loading && (
          <>
            <TimeRange>
              <div>
                <FormControl variant="outlined">
                  <DateSelect
                    value={dateRange.start}
                    inputProps={{ 'aria-label': T.translate(`${I18N_PREFIX}.dateRange.label`) }}
                    onChange={onDateRangeChange}
                  >
                    {TimeRangeOptions.map((option) => (
                      <MenuItem key={option.start} value={option.start}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </DateSelect>
                </FormControl>
                {dateRange.start === TimeRangeOptions[0].start && (
                  <CustomDateRange>
                    <ExpandableTimeRange
                      onDone={onCustomDateRangeChange}
                      inSeconds={true}
                      start={customDateTimeRange.start}
                      end={customDateTimeRange.end}
                    />
                  </CustomDateRange>
                )}
              </div>
              {fieldLevelLineageLink && (
                <FieldLineage variant="outlined" href={fieldLevelLineageLink}>
                  {T.translate(`${I18N_PREFIX}.fieldLevelLineage`)}
                </FieldLineage>
              )}
            </TimeRange>
            {lineageData.graph && (
              <LineageDiagram
                onNodeClick={addSelectedNode}
                getLineage={getLineage}
                lineageData={lineageData}
              />
            )}
            <ProgramModal node={selectedNode} onClose={clearSelectedNode} />
          </>
        )}
      </Container>
    </>
  );
};

export default Lineage;
