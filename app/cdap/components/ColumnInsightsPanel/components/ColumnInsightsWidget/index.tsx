import React, { Fragment } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DrawerWidgetHeading from 'components/ColumnInsightsPanel/components/DrawerWidgetHeading';

const PREFIX = 'features.WranglerNewUI.ColumnInsights';

const DrawerContainerStyle = styled(Box)`
  width: 471px;
  border-top: 1px solid #3994ff;
  height: calc(100vh - 150px);
  border-right: 1px solid #e0e0e0;
  overflow-y: scroll;
`;

const HeaderStyle = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTextWithBackIcon = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
`;

const HeaderRightIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  padding-right: 24px;
`;

const CloseButtonStyle = styled(IconButton)`
cursor: 'pointer'
display: 'flex',
justifyContent: 'flex-end !important',
`;

export default function({ children, closeClickHandler }) {
  return (
    <DrawerContainerStyle role="presentation" data-testid="column-insights-panel-parent">
      <HeaderStyle>
        <HeaderTextWithBackIcon>
          <DrawerWidgetHeading
            headingText={T.translate(`${PREFIX}.columnInsightsHeadingText`).toString()}
          />
        </HeaderTextWithBackIcon>
        <HeaderRightIconWrapper>
          <CloseButtonStyle
            data-testid="close-icon"
            aria-label="close-icon"
            onClick={closeClickHandler}
          >
            <CloseRoundedIcon color="action" fontSize="large" />
          </CloseButtonStyle>
        </HeaderRightIconWrapper>
      </HeaderStyle>
      <Fragment>{children}</Fragment>
    </DrawerContainerStyle>
  );
}
