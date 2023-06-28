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

import React, { MouseEventHandler, PropsWithChildren, useState } from 'react';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

const DiffAccordionTitleBarRoot = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: lightgray;
  height: 40px;
  padding: 0 30px;
`;

interface IDiffAccordionTitleBar {
  isOpen: boolean;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const DiffAccordionTitleBar = ({ isOpen, title, onClick }: IDiffAccordionTitleBar) => {
  return (
    <DiffAccordionTitleBarRoot>
      <div style={{ flexGrow: 1 }}>{title}</div>
      <IconButton onClick={onClick}>
        {isOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    </DiffAccordionTitleBarRoot>
  );
};

const DiffAccordionContent = styled.div`
  width: 100%;
  height: 0px;
  flex-grow: ${(props) => (props.isOpen ? 1 : 0)};
`;

interface IDiffAccordion {
  defaultOpen: boolean;
  title: string;
}

// TODO: Use MUI Accordion rather than custom component
export const DiffAccordion = ({
  defaultOpen,
  children,
  title,
}: PropsWithChildren<IDiffAccordion>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <>
      <DiffAccordionTitleBar title={title} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <DiffAccordionContent isOpen={isOpen}>{children}</DiffAccordionContent>
    </>
  );
};
