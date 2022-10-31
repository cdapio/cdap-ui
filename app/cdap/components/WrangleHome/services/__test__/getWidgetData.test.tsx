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

import React from 'react';
import { render, screen } from '@testing-library/react';
import { getWidgetData } from 'components/WrangleHome/services/getWidgetData';
import * as apiHelpers from 'components/Connections/Browser/SidePanel/apiHelpers';
import * as reducers from 'components/Connections/Create/reducer';
import * as utils from 'components/WrangleHome/Components/WidgetSVG/utils';
import {
  fetchConnectorMock,
  fileMock2,
  googleCloudMock,
  dataBaseMock,
  awsMock,
  msgSystemsMock,
  fileMock,
  postGresMock,
} from '../mock/mockData';

window.CDAP_CONFIG = {
  cdap: {
    uiDebugEnabled: true,
  },
};
describe('Test function getWidgetData', () => {
  it('invokes getWidgetData function with data from API`s data', async () => {
    jest.spyOn(reducers, 'fetchConnectors').mockReturnValue(Promise.resolve(fetchConnectorMock));
    const dummyRes = new Map();
    dummyRes.set('PostgreSql', postGresMock);
    dummyRes.set('File', fileMock);
    jest.spyOn(apiHelpers, 'getCategorizedConnections').mockReturnValue(Promise.resolve(dummyRes));

    const dummyReturnMap = new Map();
    dummyReturnMap.set('Messaging Systems', msgSystemsMock);
    dummyReturnMap.set('Amazon Web Services', awsMock);
    dummyReturnMap.set('Database', dataBaseMock);
    dummyReturnMap.set('Google Cloud Platform', googleCloudMock);
    dummyReturnMap.set('File', fileMock2);

    jest.spyOn(utils, 'getCategoriesToConnectorsMap').mockReturnValue(dummyReturnMap);

    let result;

    const expectedresult = {
      connectorTypes: [],
    };
    const updateState = (newState) => {
      result = { ...newState };
      // do nothing
    };
    await getWidgetData(updateState);
    expect(result).toStrictEqual(expectedresult);
  });
});
