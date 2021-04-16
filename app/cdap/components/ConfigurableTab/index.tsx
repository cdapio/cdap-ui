/*
 * Copyright © 2016 Cask Data, Inc.
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
import React, { Component } from 'react';
import Tabs from '../Tabs';
import TabHeaders from 'components/Tabs/TabHeaders';
import TabHead from 'components/Tabs/TabHead';
import TabGroup from 'components/Tabs/TabGroup';
import classnames from 'classnames';
import TabIcon, { IIcon } from 'components/ConfigurableTab/TabIcon';

require('./ConfigurableTab.scss');

export enum TabLayoutEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface ITabConfig {
  id?: string | number;
  name: string;
  content: React.ReactNode;
  contentClassName?: string;
  paneClassName?: string;
  type?: string;
  icon?: IIcon;
  subtabs?: ITabConfig[];
}

export interface ITabConfigObj {
  tabs: ITabConfig[];
  layout: TabLayoutEnum;
  defaultTab: string | number;
}

interface IConfigurableTabProps {
  onTabClick?: (tabId: string) => void;
  activeTab?: string | number;
  tabConfig: ITabConfigObj;
  tabClassName?: string;
  className?: string;
}
export default class ConfigurableTab extends Component<IConfigurableTabProps> {
  public componentWillReceiveProps(nextProps) {
    const newState = { tabs: nextProps.tabConfig.tabs, activeTab: this.state.activeTab };
    if (nextProps.activeTab && nextProps.activeTab !== this.state.activeTab) {
      newState.activeTab = nextProps.activeTab;
    }
    this.setState(newState);
  }

  public state = {
    tabs: this.props.tabConfig.tabs,
    layout: this.props.tabConfig.layout,
    activeTab: this.props.activeTab || this.props.tabConfig.defaultTab,
  };

  public setTab = (tabId) => {
    this.setState({ activeTab: tabId });
    document.querySelector('.tab-content').scrollTop = 0;

    if (typeof this.props.onTabClick === 'function') {
      this.props.onTabClick(tabId);
    }
  };

  public isActiveTab = (tabId) => {
    return this.state.activeTab === tabId;
  };

  public render() {
    let tabs = [];
    this.state.tabs.forEach((tab) => {
      if (tab.type === 'tab-group') {
        tabs = [...tabs, ...tab.subtabs];
        return;
      }
      tabs.push(tab);
    });
    const activeTab = tabs.find((tab) => this.state.activeTab === tab.id);
    return (
      <div className={classnames('cask-configurable-tab', this.props.className)}>
        <Tabs layout={this.state.layout} className={this.props.tabClassName}>
          <TabHeaders>
            {this.state.tabs.map((tab, index) => {
              if (tab.type === 'tab-group') {
                return (
                  <TabGroup
                    activeTab={this.state.activeTab}
                    onTabClick={this.setTab}
                    layout={this.state.layout}
                    tabGroup={tab}
                  />
                );
              }
              return (
                <TabHead
                  layout={this.state.layout}
                  key={index}
                  onClick={() => this.setTab(tab.id)}
                  activeTab={this.isActiveTab(tab.id)}
                  dataCy={`tab-head-${tab.name}`}
                >
                  <TabIcon iconObj={tab.icon} />
                  <span title={tab.name}>{tab.name}</span>
                </TabHead>
              );
            })}
          </TabHeaders>
          <div
            className={classnames('tab-content active', {
              [activeTab.contentClassName || '']: true,
            })}
            data-cy={`tab-content-${activeTab.name}`}
          >
            <div
              className={`tab-pane active ${
                activeTab.paneClassName ? activeTab.paneClassName : ''
              }`}
            >
              {activeTab.content}
            </div>
          </div>
        </Tabs>
      </div>
    );
  }
}
