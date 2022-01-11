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
import styled from 'styled-components';
import WidgetWrapper from 'components/shared/ConfigurationGroup/WidgetWrapper';

const WidgetContainer = styled.div`
  margin-top: 40px;
`;

interface ITextboxProps {
  properties?: any,
  value?: string,
  broadcastChange: (target: string, value: string) => void;
}

const Textbox = ({ properties, value, broadcastChange }: ITextboxProps) => { 
  const handleChange = (val) => {
    broadcastChange(properties.name, val)
  };

  return (
    <WidgetContainer>
      <WidgetWrapper
        widgetProperty={properties}
        value={value}
        onChange={handleChange}
      />
    </WidgetContainer>
  );
};

export default Textbox;