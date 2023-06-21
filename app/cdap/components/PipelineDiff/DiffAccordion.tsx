import React, { useState } from 'react';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

// TODO: adjust colors to fit the app
const StyledTitleBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: lightgray;
  height: 40px;
  padding: 0 30px;
`;

const TitleBar = ({ isOpen, title, onClick }) => {
  return (
    <StyledTitleBar>
      <div style={{ flexGrow: 1 }}>{title}</div>
      <IconButton onClick={onClick}>
        {isOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    </StyledTitleBar>
  );
};

const StyledDiffContainer = styled.div`
  width: 100%;
  height: 0px;
  flex-grow: ${(props) => (props.isOpen ? 1 : 0)};
`;

export const DiffAccordion = ({ defaultOpen, children, title }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <>
      <TitleBar title={title} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <StyledDiffContainer isOpen={isOpen}>{children}</StyledDiffContainer>
    </>
  );
};
