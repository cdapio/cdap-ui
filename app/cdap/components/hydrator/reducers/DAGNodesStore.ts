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

import { createAction, createReducer, current } from '@reduxjs/toolkit';
import { GLOBALS } from 'services/global-constants';
import uuidV4 from 'uuid/v4';
import { santizeStringForHTMLID } from 'services/helpers';

const addNode = createAction<any>('ADD_NODE')
const updateNodeUIPosition = createAction<any>('UPDATE_NODE_UI_POSITION')
const reset = createAction<any>('LEFTPANELSTORE_RESET');

const getInitialState = () => {
    return {
        nodes: [],
        connections: [],
        activeNodeId: null,
        currentSourceCount: 0,
        currentTransformCount: 0,
        currentSinkCount: 0,
        canvasPanning: {
            top: 0,
            left: 0
        },
    }
}

const setNodeInitialPosition = (config, state) => {
    const canvasPanning = state.canvasPanning;

    const sourcePosition = {
      top: 150 - canvasPanning.top,
      left: (10/100 * document.documentElement.clientWidth) - canvasPanning.left
    };
    const transformPosition = {
      top: 150 - canvasPanning.top,
      left: (30/100 * document.documentElement.clientWidth) - canvasPanning.left
    };
    const sinkPosition = {
      top: 150 - canvasPanning.top,
      left: (50/100 * document.documentElement.clientWidth) - canvasPanning.left
    };
  
    const offset = 35;
  
    // set initial position
    switch (GLOBALS.pluginConvert[config.type]) {
      case 'source':
        const sourceOffset = state.currentSourceCount * offset;
        config._uiPosition = {
          top: (sourcePosition.top + sourceOffset) + 'px',
          left: (sourcePosition.left + sourceOffset) + 'px'
        };
        break;
      case 'sink':
        const sinkOffset = state.currentSinkCount * offset;
        config._uiPosition = {
          top: (sinkPosition.top + sinkOffset) + 'px',
          left: (sinkPosition.left + sinkOffset) + 'px'
        };
        break;
      default:
        const transformOffset = state.currentTransformCount * offset;
        config._uiPosition = {
          top: (transformPosition.top + transformOffset) + 'px',
          left: (transformPosition.left + transformOffset) + 'px'
        };
        break;
    }
    if (!config.name) {
        config.name = config.plugin.label + '-' + uuidV4();
    }
    if (!config.id) {
        config.id = santizeStringForHTMLID(config.plugin.label) + '-' + uuidV4();
    }
    return config;
}

export const nodeReducer = createReducer({
    ...getInitialState()
}, (builder) => {
    builder.addCase(addNode, (state, action) => {
        const config = setNodeInitialPosition(action.payload.config, state)
        switch (GLOBALS.pluginConvert[config.type]) {
            case 'source':
              state.currentSourceCount++
              break;
            case 'sink':
              state.currentSinkCount++
              break;
            default:
              state.currentTransformCount++
              break;
          }
          state.nodes.push(config);
    })
    .addCase(updateNodeUIPosition, (state, action) => {
        const {id, position} = action.payload
        const nodeToUpdate = state.nodes.filter(node => node.id === id)[0]
        nodeToUpdate._uiPosition = position._uiPosition
    })
        .addCase(reset, (state, action) => {
            state = getInitialState()
        })
})