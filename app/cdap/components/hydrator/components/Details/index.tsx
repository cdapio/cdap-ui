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

import React, {useEffect, useState} from 'react';
import { LeftPanel } from 'components/hydrator/components/LeftPanel/LeftPanel';
import { PipelineDetailsTopPanel } from 'components/PipelineDetails/PipelineDetailsTopPanel';
import { WrapperCanvas } from 'components/hydrator/components/Canvas';
import PipelineDetailsRunLevelInfo from 'components/PipelineDetails/RunLevelInfo';
import PipelineTriggers from 'components/PipelineTriggers';

export interface IPipeDetails {
  // topPanelCtrl: any;
  // leftPanelCtrl: any;
  // canvasCtrl: any;
  studioCtrl: any;
  pipeCanvas: any;
  dagCtrl: any;
  counter: number;
  // metadataExpanded: any;
  pipeDetails: any;
}

export const Details = ({pipeCanvas, dagCtrl, pipeDetails}: IPipeDetails) => {
  const [pipeline, setPipeline] = useState<any>();
  useEffect(() => {
    const waitForPipeline = async function() {
      const pipelineRes = await pipeDetails;
      setPipeline(pipelineRes);
    };

    waitForPipeline().catch(console.error)
  }, []);
  if (!pipeline) {
    return <p> LOADING</p>;
  }
  // debugger;
  // console.log('metadata expanded', metadataExpanded)
  // console.log('top', topPanelCtrl);
  // console.log('left', leftPanelCtrl);
  // console.log('canvas', canvasCtrl);
  // console.log(nodes)
  // const [cnodes, setNodes] = useState(canvasCtrl.nodes);
  // const [preview, setPreview] = useState(canvasCtrl.previewMode);
  // setInterval(() => {
  //   // cnodes = dagCtrl.getNodes();;
  //   // console.log('these should change here too', canvasCtrl.nodes);
  //   console.log('IN STUDIO COMP', canvasCtrl.previewMode);
  //   console.log('in studio component these shoudl be the angular nodes from get nodes', cnodes)
  // }, 4000);
  // useEffect(() => {
  //   console.log('this is happening forr the use effect');
  //   setPreview(canvasCtrl.previewMode);
  //   setNodes(dagCtrl.getNodes());
  // }, [dagCtrl.getNodes(), canvasCtrl.previewMode])
  // if (
  //   leftPanelCtrl.artifacts?.length < 1 ||
  //   !leftPanelCtrl.selectedArtifact
  //   ) {
  //     console.log('here')
  //     return <p>LOADINGLOADING</p>;
  // }
  return (
    <div>
      <div className="react-version">
        <div className="canvas-wrapper">
          <div className="top-panel">
            <PipelineDetailsTopPanel />
          </div>
          <div className="right-wrapper">
          {/* <my-dag-plus
  data-is-disabled="true"
  ng-class="{'canvas-scroll': CanvasCtrl.setScroll}"
  context="CanvasCtrl"
  show-metrics="true"
  metrics-data="CanvasCtrl.metrics"
  metrics-popover-template="/assets/features/hydrator/templates/partial/metrics-popover.html"
  disable-metrics-click="CanvasCtrl.totalRuns > 0 ? false : true"
  run-id="CanvasCtrl.runId"
> */}
            
            {/* <PipelineDetailsRunLevelInfo></PipelineDetailsRunLevelInfo> */}
            <WrapperCanvas
              angularNodes={dagCtrl.getNodes()}
              angularConnections={dagCtrl.getConnections()}
              isDisabled={dagCtrl.isDisabled}
              previewMode={pipeCanvas.preview}
              updateNodes={dagCtrl.updateNodesStoreNodes}
              updateConnections={dagCtrl.updateNodesStoreConnections}
              onPropertiesClick={dagCtrl.onNodeClick}
              onMetricsClick={dagCtrl.onMetricsClick}
              getAngularConnections={dagCtrl.getConnections}
              getAngularNodes={dagCtrl.getNodes}
              setSelectedNodes={dagCtrl.setSelectedNodes}
              setSelectedConnections={dagCtrl.setSelectedConnections}
              onKeyboardCopy={dagCtrl.onKeyboardCopy}
              setPluginActiveForComment={dagCtrl.setPluginActiveForComment}
              getActivePluginForComment={dagCtrl.getActivePluginForComment}
              setPluginComments={dagCtrl.setComments}
              getPluginConfiguration={dagCtrl.getPluginConfiguration}
              getCustomIconSrc={dagCtrl.getCustomIconSrc}
              shouldShowAlertsPort={dagCtrl.shouldShowAlertsPort}
              shouldShowErrorsPort={dagCtrl.shouldShowErrorsPort}
              undoActions={dagCtrl.undoActions}
              redoActions={dagCtrl.redoActions}
              pipelineComments={dagCtrl.pipelineComments}
              setPipelineComments={dagCtrl.setPipelineComments}
              onPreviewData={dagCtrl.onPreviewData}
              cleanUpGraph={dagCtrl.cleanUpGraph}
              pipelineArtifactType={dagCtrl.pipelineArtifactType}
              metricsData={{}}
              metricsDisabled={true}
              redoStates={dagCtrl.redoStates}
              undoStates={dagCtrl.undoStates}
              updateNodePositions={dagCtrl.updateNodePositions}
            ></WrapperCanvas>

          </div>
          {(pipeline.appInfo.pipelineId && (pipeline.pipelineType === 'cdap-data-pipeline'|| pipeline.pipelineType === 'cdap-sql-pipeline')) &&
            <PipelineTriggers
              pipelineCompositeTriggersEnabled={true}
              lifecycleManagementEditEnabled={true}
              pipelineName=""
              namespace={pipeline.$rootScope.$stateParams.namespace}
              pipelineType={pipeline.pipelineType}
            />
          }
          
        </div>
      </div>
    </div>
  );
};
