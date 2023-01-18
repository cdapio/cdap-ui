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

import React from 'react';
import { connect } from 'react-redux';
import { INamespaceAdmin } from './store';
import styled from 'styled-components';

const StyledDescription = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

interface IDescriptionProps {
  description: string;
}

const DescriptionView: React.FC<IDescriptionProps> = ({ description }) => {
  return <StyledDescription>{description}</StyledDescription>;
};

const mapStateToProps = (state: INamespaceAdmin) => {
  return {
    description: state.description,
  };
};

const Description = connect(mapStateToProps)(DescriptionView);
export default Description;
