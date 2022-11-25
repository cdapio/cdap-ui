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

import { attachStaticCards } from 'components/WrangleHome/services/attachStaticCards';
import { getConnectorTypesDisplayNames } from 'components/WrangleHome/services/getConnectorTypesDisplayNames';
import { getUpdatedConnectorCards } from 'components/WrangleHome/services/getUpdatedConnectorCards';
import {
  fetchConnectorMock,
  propertiesMock,
  dummyDisplayNames,
  fetchConnectorMockResponse,
  connectorCardMockArgument,
} from 'components/WrangleHome/services/mock/mockData';
import * as getMapHelper from 'components/Connections/Create/reducer';
import * as apiHelpers from 'components/Connections/Browser/SidePanel/apiHelpers';
import {
  connectionListDummyResFile,
  connectionListDummyResPostGresSql,
} from 'components/ConnectionList/mock/mockDataForConnectionList';
import * as reducer from 'components/Connections/Create/reducer';

describe('Test function attachStaticCards', () => {
  it('invokes getWidgetData function with data ', () => {
    const dummyData = [];
    attachStaticCards(dummyData);
    expect(attachStaticCards).toBeTruthy();
  });

  it('test function getConnectorTypesDisplayNames', () => {
    jest
      .spyOn(getMapHelper, 'fetchAllConnectorPluginProperties')
      .mockReturnValue(Promise.resolve(propertiesMock));

    getConnectorTypesDisplayNames(fetchConnectorMock, dummyDisplayNames);
    expect(getConnectorTypesDisplayNames).toBeTruthy();
    expect(getMapHelper.fetchAllConnectorPluginProperties).toBeCalledTimes(1);
  });

  it('test function getUpdatedConnectorCards', () => {
    const dummyRes = new Map();
    dummyRes.set('PostgreSql', connectionListDummyResPostGresSql);
    dummyRes.set('File', connectionListDummyResFile);
    jest
      .spyOn(reducer, 'fetchConnectors')
      .mockReturnValue(Promise.resolve(fetchConnectorMockResponse));
    jest.spyOn(apiHelpers, 'getCategorizedConnections').mockReturnValue(Promise.resolve(dummyRes));
    getUpdatedConnectorCards(connectorCardMockArgument);
    expect(getUpdatedConnectorCards).toBeTruthy();
    expect(reducer.fetchConnectors).toBeCalledTimes(1);
  });
});
