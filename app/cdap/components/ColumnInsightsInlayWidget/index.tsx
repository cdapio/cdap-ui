import React, { Fragment, useEffect, useState, IconButton } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';
import DrawerWidgetHeading from 'components/ColumnInsightsInlayWidget/DrawerWidgetHeading';

const PREFIX = 'features.NewWranglerUI.ColumnInsights';

const DrawerContainerStyle = styled(Box)`
  width: 389px;
  border-top: 1px solid #3994ff;
  height: calc(100vh - 190px);
  border-right: 1px solid #e0e0e0;
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

export default function({ children }) {
  return (
    <DrawerContainerStyle role="presentation" data-testid="column-view-panel-parent">
      <HeaderStyle>
        <HeaderTextWithBackIcon>
          <DrawerWidgetHeading
            headingText={T.translate(`${PREFIX}.columnInsightsHeadingText`).toString()}
          />
        </HeaderTextWithBackIcon>
        <HeaderRightIconWrapper>
          <IconButton
            data-testid="close-icon"
            aria-label="close-icon"
            className={classes.closeButtonStyle}
            onClick={closeClickHandler}
          >
            <CloseRoundedIcon color="action" fontSize="large" />
          </IconButton>
        </HeaderRightIconWrapper>
      </HeaderStyle>
      <Fragment>{children}</Fragment>
    </DrawerContainerStyle>
  );
}
