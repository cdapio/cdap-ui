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
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createTheme, ThemeOptions } from '@material-ui/core/styles';
import {
  blue,
  grey,
  green,
  red,
  bluegrey,
  orange,
  yellow,
  white,
  primary,
} from 'components/ThemeWrapper/colors';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface IThemeWraperProps {
  render?: () => React.ReactNode;
  component?: React.ReactNode;
  children?: any;
}

declare module '@material-ui/core/styles/createPalette' {
  // tslint:disable-next-line:interface-name
  interface Palette {
    blue: PaletteColor;
    green: PaletteColor;
    red: PaletteColor;
    bluegrey: PaletteColor;
    orange: PaletteColor;
    yellow: PaletteColor;
    white: PaletteColor;
  }

  // tslint:disable-next-line:interface-name
  interface PaletteOptions {
    blue?: PaletteColorOptions;
    green?: PaletteColorOptions;
    red?: PaletteColorOptions;
    bluegrey?: PaletteColorOptions;
    orange?: PaletteColorOptions;
    yellow?: PaletteColorOptions;
    white?: PaletteColorOptions;
  }
}

const Theme = createTheme({
  palette: {
    primary: {
      main: primary,
    },
    blue,
    grey,
    green,
    red,
    bluegrey,
    orange,
    yellow,
    white,
  },
  navbarBgColor: 'var(--navbar-color)',
  buttonLink: {
    '&:hover': {
      color: 'inherit',
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
    },
    fontSize: '1rem',
    color: 'white',
  },
  iconButtonFocus: {
    '&:focus': {
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
    },
  },
  grow: {
    flexGrow: 1,
  },
  typography: {
    fontSize: 13,
    fontFamily: 'var(--font-family)',
    useNextVariants: true,
  },
  zIndex: {
    drawer: 1300, // Must be < z-index of NUX in services/GuidedTour/GuidedTour.scss
  },
  overrides: {
    MuiTypography: {
      caption: {
        fontSize: '0.92rem',
      },
    },
  },
  Spacing: (factor) => [0, 4, 8, 16, 24, 32, 40, 48, 56, 64][factor],
} as ThemeOptions);

export default class ThemeWrapper extends React.PureComponent<IThemeWraperProps> {
  public render() {
    let Component;
    if (this.props.component) {
      Component = this.props.component;
    }
    if (!this.props.render && !this.props.component && !this.props.children) {
      return null;
    }
    if (this.props.children) {
      return (
        <MuiThemeProvider theme={Theme}>
          <StyledThemeProvider theme={Theme}>{this.props.children}</StyledThemeProvider>
        </MuiThemeProvider>
      );
    }
    if (this.props.render) {
      return (
        <MuiThemeProvider theme={Theme}>
          <StyledThemeProvider theme={Theme}>{this.props.render()}</StyledThemeProvider>
        </MuiThemeProvider>
      );
    }
    return (
      <MuiThemeProvider theme={Theme}>
        <StyledThemeProvider theme={Theme}>
          <Component />
        </StyledThemeProvider>
      </MuiThemeProvider>
    );
  }
}
