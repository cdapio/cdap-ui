/*
 * Copyright © 2017 Cask Data, Inc.
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
import { humanReadableDate } from 'services/helpers';
import { Link } from 'react-router-dom';
import { setPrefix } from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore/ActionCreator';
import { preventPropagation } from 'services/helpers';
import classnames from 'classnames';
import EmptyMessageContainer from 'components/EmptyMessageContainer';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';
import DataPrepStore from 'components/DataPrep/store';
const PREFIX = 'features.DataPrep.DataPrepBrowser.S3Browser.BucketData';

// Lazy load polyfill in safari as InteresectionObservers are not implemented there yet.
(async () => {
  typeof IntersectionObserver === 'undefined'
    ? await import(/* webpackChunkName: "intersection-observer" */ 'intersection-observer')
    : Promise.resolve();
})();

interface IBucketData {
  directory?: boolean;
  name: string;
  'last-modified': string;
  owner: string;
  size: string;
  wrangle?: boolean;
  type?: string;
  scrollId: number;
}

interface ITableContentsProps {
  enableRouting: boolean;
  search: string;
  data: Partial<IBucketData>[];
  onWorkspaceCreate: (file: string) => void;
  prefix: string;
  clearSearch: () => void;
  connectionId: string;
}
interface ITableContentState {
  windowSize: number;
  data: Partial<IBucketData>[];
}

export default class TableContents extends React.PureComponent<
  ITableContentsProps,
  ITableContentState
> {
  private static DEFAULT_WINDOW_SIZE = 100;

  public state: ITableContentState = {
    windowSize: TableContents.DEFAULT_WINDOW_SIZE,
    data: this.props.data.map((d, i) => ({ ...d, scrollId: i })),
  };

  public componentDidMount() {
    Array.from(document.querySelectorAll('#s3-buckets-container .row')).forEach((entry) => {
      this.io.observe(entry);
    });
  }

  public componentDidUpdate() {
    Array.from(document.querySelectorAll('#s3-buckets-container .row')).forEach((entry) => {
      this.io.observe(entry);
    });
  }

  public componentWillReceiveProps(nextProps: Partial<ITableContentsProps>) {
    this.setState({
      data: nextProps.data.map((d, i) => ({ ...d, scrollId: i })),
    });
  }
  private io = new IntersectionObserver(
    (entries) => {
      let lastVisibleElement = this.state.windowSize;
      for (const entry of entries) {
        let id = entry.target.getAttribute('id');
        id = id.split('-').pop();
        const scrollId = parseInt(id, 10);
        if (entry.isIntersecting) {
          lastVisibleElement =
            scrollId + 50 > this.state.windowSize
              ? scrollId + TableContents.DEFAULT_WINDOW_SIZE
              : scrollId;
        }
      }
      if (lastVisibleElement > this.state.windowSize) {
        this.setState({
          windowSize: lastVisibleElement,
        });
      }
    },
    {
      root: document.getElementById('s3-buckets-container'),
      threshold: [0, 1],
    }
  );

  private renderIcon = (type) => {
    switch (type) {
      case 'bucket':
        return <IconSVG name="icon-S3_bucket" />;
      case 'directory':
        return <IconSVG name="icon-folder-o" />;
      default:
        return <IconSVG name="icon-file-o" />;
    }
  };

  private getPrefix = (file, prefix) => {
    const handleSlashAtEnd = (path) => {
      return path.length > 1 && path[path.length - 1] === '/'
        ? path.slice(0, path.length - 1)
        : path;
    };
    const addSuffixSlash = (path) => `${handleSlashAtEnd(path)}/`;
    return file.type === 'bucket'
      ? `/${file.name}`
      : `${handleSlashAtEnd(prefix)}/${addSuffixSlash(file.name)}`;
  };

  private onClickHandler = (enableRouting, onWorkspaceCreate, file, prefix, e) => {
    if (!file.directory) {
      if (file.wrangle) {
        this.props.onWorkspaceCreate(file);
      }
      preventPropagation(e);
      return false;
    }
    if (enableRouting) {
      return;
    }
    if (file.directory) {
      setPrefix(this.getPrefix(file, prefix));
    }
    preventPropagation(e);
    return false;
  };

  private renderData() {
    const { enableRouting, onWorkspaceCreate, prefix } = this.props;
    const { data } = this.state;
    const ContainerElement = enableRouting ? Link : 'div';
    const pathname = window.location.pathname.replace(/\/cdap/, '');

    const {
      connectionid,
      key,
      'bucket-name': bucketName,
    } = DataPrepStore.getState().dataprep.insights;
    const selectedPath = `/${bucketName}/${key}/`;

    if (enableRouting) {
      return (
        <div className="s3-buckets" id="s3-buckets-container">
          {data.slice(0, this.state.windowSize).map((file, i) => {
            const lastModified = humanReadableDate(file['last-modified'], true);
            const filePath = this.getPrefix(file, prefix);
            const isSelected =
              connectionid === this.props.connectionId && filePath === selectedPath;

            return (
              <ContainerElement
                className={classnames({
                  disabled: !file.directory && !file.wrangle,
                  selected: isSelected,
                })}
                to={`${pathname}?prefix=${filePath}`}
                onClick={this.onClickHandler.bind(
                  null,
                  enableRouting,
                  onWorkspaceCreate,
                  file,
                  prefix
                )}
                key={`${file.name}-${i}`}
              >
                <div className="row" id={`s3connection-${file.scrollId}`}>
                  <div className="col-3">
                    {this.renderIcon(file.type)}
                    {file.name}
                  </div>
                  <div className="col-3">{file.owner || '--'}</div>
                  <div className="col-3">{file.size || '--'}</div>
                  <div className="col-3">{lastModified}</div>
                </div>
              </ContainerElement>
            );
          })}
        </div>
      );
    }

    return (
      <div className="s3-buckets" id="s3-buckets-container">
        {data.slice(0, this.state.windowSize).map((file, i) => {
          const filePath = this.getPrefix(file, prefix);
          const isSelected = connectionid === this.props.connectionId && filePath === selectedPath;

          return (
            <ContainerElement
              className={classnames({
                disabled: !file.directory && !file.wrangle,
                selected: isSelected,
              })}
              to={`${pathname}?prefix=${this.getPrefix(file, prefix)}`}
              onClick={this.onClickHandler.bind(
                null,
                enableRouting,
                onWorkspaceCreate,
                file,
                prefix
              )}
              key={`${file.name}-${i}`}
            >
              <div className="row" id={`s3connection-${file.scrollId}`}>
                <div className="col-12">
                  {this.renderIcon(file.type)}
                  {file.name}
                </div>
              </div>
            </ContainerElement>
          );
        })}
      </div>
    );
  }

  public renderContents() {
    const { search, data, clearSearch } = this.props;
    if (!data.length) {
      return (
        <div className="s3-buckets empty-message">
          <div className="row">
            <div className="col-12">
              <EmptyMessageContainer searchText={search}>
                <ul>
                  <li>
                    <span className="link-text" onClick={clearSearch}>
                      {T.translate('features.EmptyMessageContainer.clearLabel')}
                    </span>
                    <span>
                      {T.translate(`${PREFIX}.Content.EmptymessageContainer.suggestion1`)}
                    </span>
                  </li>
                </ul>
              </EmptyMessageContainer>
            </div>
          </div>
        </div>
      );
    }
    return this.renderData();
  }
  public render() {
    return <div className="s3-content-body">{this.renderContents()}</div>;
  }
}
