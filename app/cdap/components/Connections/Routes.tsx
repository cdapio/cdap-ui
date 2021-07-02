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
import { Route, Switch } from 'react-router-dom';
import { CreateConnection } from 'components/Connections/Create';
import { ConnectionsHome } from 'components/Connections/Home';

export function ConnectionRoutes() {
  return (
    <Switch>
      <Route exact path="/ns/:namespace/connections/create">
        <CreateConnection />
      </Route>
      <Route path="/ns/:namespace/connections/:connectionid">
        <ConnectionsHome />
      </Route>
      <Route path="/ns/:namespace/connections">
        <ConnectionsHome />
      </Route>
      <Route path="/ns/:namespace/connection-upload">
        <ConnectionsHome />
      </Route>
    </Switch>
  );
}
