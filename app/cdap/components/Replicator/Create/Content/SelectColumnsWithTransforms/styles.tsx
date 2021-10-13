import styled from 'styled-components';

import { Button, Checkbox, Radio, RadioGroup } from '@material-ui/core';

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 5;
`;

export const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 30px;
  background-color: ${(props) => props.theme.palette.white[50]};
  border: 1px solid ${(props) => props.theme.palette.white[50]};
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  background-color: #f5f5f5;
  padding: 64px 30px 15px;
  border: 0;
`;

export const ActionButtons = styled.div`
  text-align: right;
  & > button:not(:last-child): {
    margin-right: 25px;
  }
`;

export const GridWrapper = styled.div`
  height: calc(100% - 100px - 40px);
  & .grid.grid-container.grid-compact: {
    maxHeight: 100%;

  & .grid-header: {
    z-index: 5;
  }

  & .grid-row: {
    grid-template-columns: 40px 40px 1fr 200px 55px 100px;
    align-items: center;
  }

  & > div[class^="grid-"] .grid-row > div: {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const radioStyles = 'padding: 0;';

export const StyledRadio = styled(Radio)`
  ${radioStyles}
  margin-right: 10px;
`;

export const StyledCheckbox = styled(Checkbox)`
  ${radioStyles}
`;

export const SubtitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div: {
    margin-right: 25px;
  }
`;

export const RadioContainer = styled.div`
  padding-left: 10px;
  margin-top: 15px;
  margin-bottom: 5px;
`;

export const ButtonWithMarginRight = styled(Button)`
  margin-right: 25px;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  align-items: flex-start;
`;

export const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;
