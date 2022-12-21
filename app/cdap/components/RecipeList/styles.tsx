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
import styled, { css } from 'styled-components';

export const RecipeTableDiv = styled.div`
    width: 100%;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
    background-color: #FFFFFF;
    border-radius: 4px;

    .grid.grid-container {
      max-height: 100%;
      .grid-header > .grid-row {       
        background: #F5F5F5;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.12);       

        .sortable {
          cursor: pointer;
        }
      }
      .grid-row {
        grid-template-columns: ${(props) => {
          if (props.showallcolumns) {
            return props.showactions ? '1fr 100px 1fr 200px 80px' : '1fr 100px 1fr 200px';
          } else {
            return '1fr 100px 200px';
          }
        }};
        
        > div {
          padding-top: 5px;
          padding-bottom: 5px;
        }

        > * {
          &:first-child {
            padding-left: 25px;
          }
        }
      }

      .grid-body .grid-row {u
        color: $row-color;

        &:hover {
          background-color: $row-hover-color;
          text-decoration: none;
          cursor : ${(props) => (props.showallcolumns ? 'auto' : 'pointer')};
        }
        ${(props) =>
          props.showactions &&
          css`
            > * {
              &:last-child {
                display: flex;
                padding-right: 30px;
                justify-content: flex-end;
              }
            }
          `}
      }     
`;

export const PaginationContainer = styled.div`
  margin-right: 20px;
  display: block;
  div {
    display: inline-block;
    margin-right: 10px;
  }
`;

export const NoDataText = styled.span`
  margin: 15px 0;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
