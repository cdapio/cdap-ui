/*
 * Copyright © 2023 Cask Data, Inc.
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
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from 'react-router-dom';
import { Studio, IStudioCreateState } from './Studio';

type IStudioRoutesProps = IStudioCreateState;

export const StudioRoutes = (props: IStudioRoutesProps) => {
  // get artifacts
  // const location = useLocation();
  console.log('groose goose\n\n\n\n\n',props.topPanelCtrl,'goose 2 \n\n\n\n', props.leftPanelCtrl);
  return (
    <Router basename="/pipelines">
      <Switch>
        <Route path="/ns/:namespace/studio">
          {/* {(props.leftPanelCtrl.selectedArtifact) && */}
            <Studio leftPanelCtrl={props.leftPanelCtrl} topPanelCtrl={props.topPanelCtrl}/>
          {/* } */}
        </Route>
        <Route path="/">
          <p> fake stuff</p>
        </Route>
        <Route path="*">
          <p>mr no match</p>
        </Route>
      </Switch>
    </Router>
  );
};

