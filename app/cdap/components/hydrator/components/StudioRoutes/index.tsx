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
import { Details, IPipeDetails } from '../Details';

// counter is necessary because ngReact is weird in how it can trigger prop changes
type IStudioRoutesProps = IStudioCreateState & IPipeDetails;

export const StudioRoutes = (props: IStudioRoutesProps) => {

  return (
    <Router basename="/pipelines">
      <Switch>
        <Route path="/ns/:namespace/studio">
          {/* {(props.leftPanelCtrl.selectedArtifact) && */}
            <Studio
              // nodes={props.nodes}
              metadataExpanded={props.metadataExpanded}
              
              // connections={props.connections}
              // previewMode={props.previewMode}
              counter={props.counter}
              studioCtrl={props.studioCtrl}
              leftPanelCtrl={props.leftPanelCtrl}
              topPanelCtrl={props.topPanelCtrl}
              canvasCtrl={props.canvasCtrl}
              dagCtrl={props.dagCtrl}
            />
          {/* } */}
        </Route>
        <Route path="/ns/:namespace/view/:pipelineId">
          <Details
            counter={props.counter}
            pipeDetails={props.pipeDetails}
            pipeCanvas={props.pipeCanvas}
            studioCtrl={props.studioCtrl}
            dagCtrl={props.dagCtrl}
          />
          <p> details</p>
        </Route>
        <Route path="*">
          <p>mr no match</p>
        </Route>
      </Switch>
    </Router>
  );
};

