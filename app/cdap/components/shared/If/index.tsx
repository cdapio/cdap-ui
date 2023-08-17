/*
 * Copyright © 2018 Cask Data, Inc.
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
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

interface IIfComponentProps {
  condition: boolean;
  children: React.ReactNode;
  invisible?: boolean;
}

const InvisibleBox = styled(Box)`
  visibility: hidden;
`;

const If: React.FC<IIfComponentProps> = ({
  condition,
  children,
  invisible = false,
}) => {
  if (!condition) {
    if (!invisible) {
      return null;
    }
    return <InvisibleBox>{children}</InvisibleBox>;
  }

  return <>{children}</>;
};

export default If;
