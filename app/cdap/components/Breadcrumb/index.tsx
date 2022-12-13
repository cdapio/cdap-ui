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

import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { grey } from '@material-ui/core/colors';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface IBreadcrumbItemProps {
  link?: string;
  label: string;
}

export interface IBreadcrumbProps {
  breadcrumbsList: IBreadcrumbItemProps[];
}

const StyledBreadcrumb = styled(Breadcrumbs)`
  display: flex;
  justify-content: space-between;
  height: 48px;
  align-items: center;
  margin-right: 30px;
  margin-left: 34px;
`;

const StyledLink = styled(Link)`
    color: blue[500];
    font-size: 14px;
    font-weight: 400;
    width: 41px,
    height: 21px,
`;

const StyledTypography = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.15px;
  color: ${grey[900]};
`;

const getBreadcrumbLabel = (breadcrumbData: IBreadcrumbItemProps) => {
  if (breadcrumbData.link) {
    return (
      <StyledLink
        to={breadcrumbData.link}
        data-testid={`breadcrumb-home-${breadcrumbData.label
          .toLowerCase()
          .split(' ')
          .join('-')}`}
      >
        {breadcrumbData.label}
      </StyledLink>
    );
  }
  return (
    <StyledTypography color="textPrimary" data-testid="breadcrumb-workspace-name">
      {breadcrumbData.label}
    </StyledTypography>
  );
};

export default function({ breadcrumbsList }: IBreadcrumbProps) {
  return (
    <StyledBreadcrumb separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {breadcrumbsList?.map((eachBreadcrumb) => getBreadcrumbLabel(eachBreadcrumb))}
    </StyledBreadcrumb>
  );
}
