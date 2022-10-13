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

import styled from 'styled-components';

export const PipelineHistoryTableDiv = styled.div`
  &.pipeline-history-list-table.grid-wrapper {
    background-color: white;
    padding: 0 4px;
    height: calc(100% - #{$header-height});

    .grid.grid-container {
      max-height: 100%;

      .grid-header > .grid-row {
        border-width: 3px;

        .sortable {
          cursor: pointer;
        }

        .fa.fa-lg {
          vertical-align: top;
          margin-left: 5px;
        }
      }

      .grid-row {
        grid-template-columns: 300px 300px 1fr 1fr;

        > div {
          padding-top: 5px;
          padding-bottom: 5px;
        }

        > * {
          &:first-child {
            padding-left: 25px;
          }

          &:last-child {
            padding-right: 25px;
          }
        }
      }

      .grid-body .grid-row {
        color: $row-color;

        &:hover {
          background-color: $row-hover-color;
          text-decoration: none;
        }
      }
    }

    .status {
      .text {
        vertical-align: middle;
      }
      .fa {
        margin-right: 2px;
      }
      .status-light-grey {
        color: $grey-03;
      }
      .status-light-green {
        color: $green-01;
      }
      .status-blue {
        color: $blue-02;
      }
      .status-light-red {
        color: $red-02;
      }
    }

    .action {
      text-align: right;
    }
  }
`;
