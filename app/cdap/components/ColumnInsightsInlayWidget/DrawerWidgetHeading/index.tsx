import { Typography } from '@material-ui/core';
import React from 'react';
import { UnderlineIcon } from 'components/ColumnInsightsInlayWidget/IconStore/Underline';
import { IDrawerWidgetHeading } from 'components/ColumnInsightsInlayWidget/DrawerWidgetHeading/types';
import styled from 'styled-components';

const HeadingTextIconWrapper = styled(Typography)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const HeadingTextStyle = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: #000000;
`;

export default function({ headingText }: IDrawerWidgetHeading) {
  return (
    <HeadingTextIconWrapper component="span">
      <HeadingTextStyle component="div" data-testid="drawer-widget-heading-text">
        {headingText}
      </HeadingTextStyle>
      {UnderlineIcon}
    </HeadingTextIconWrapper>
  );
}
