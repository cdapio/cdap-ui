import React, { useEffect, useContext } from 'react';
import _identity from 'lodash/identity';

import {
  SlideIn,
  Collapsable,
  ShellContainer,
  AppHeaderContainer,
  ActionbarContainer,
  ToolbarContainer,
  SnackbarContainer,
  MainContainer,
  ContentContainer,
  FooterbarContainer,
  LeftDrawersContainer,
  RightDrawersContainer,
  BottomContainer,
  BottomDrawersContainer,
} from 'components/Shell/components/Layouts';
import AppHeader from 'components/shared/AppHeader';
import AppFooter from 'components/shared/Footer';
import { ModalContainer } from 'components/Shell/components/ModalContainer';

import { makePropSync } from 'components/Shell/helpers';
import { AppControlContext, IAppControlContext } from 'components/Shell/contexts/AppControlContext';
import { ShellConfigContext } from 'components/Shell/contexts/ShellConfigContext';
import { DrawerIndexContext } from 'components/Shell/contexts/DrawerIndexContext';
import {
  IShellConfig,
  IShellProps,
  DrawerType,
  ShellApiGenerator,
  IShellApi,
} from 'components/Shell/types';
import { useShellReducer } from 'components/Shell/store/reducer';

function makeDrawersArray(drawers): React.ReactNode[] {
  if (Array.isArray(drawers)) {
    return drawers;
  }
  if (drawers) {
    return [drawers];
  }
  return [];
}

function propsToState(props: IShellProps): IShellConfig {
  return {
    ...props,
    leftInlayDrawers: makeDrawersArray(props.leftInlayDrawers),
    rightInlayDrawers: makeDrawersArray(props.rightInlayDrawers),
    bottomOverlayDrawers: makeDrawersArray(props.bottomOverlayDrawers),
  };
}

export const Shell: React.FC<IShellProps> = (props) => {
  const { setAppControlToShell } = useContext<IAppControlContext>(AppControlContext);
  const { state, updateState, shellApiGenerator } = useShellReducer(propsToState(props));

  const usePropSync = makePropSync(props, updateState);
  usePropSync('showAppHeader');
  usePropSync('showAppFooter');
  usePropSync('showActionbar');
  usePropSync('actionbar');
  usePropSync('showToolbar');
  usePropSync('toolbar');
  usePropSync('showSnackbar');
  usePropSync('snackbar');
  usePropSync('showLeftInlayDrawer');
  usePropSync('leftInlayDrawers', makeDrawersArray);
  usePropSync('showRightInlayDrawer');
  usePropSync('rightInlayDrawers', makeDrawersArray);
  usePropSync('showBottomOverlayDrawer');
  usePropSync('bottomOverlayDrawers', makeDrawersArray);
  usePropSync('showFooterbar');
  usePropSync('footerbar');
  usePropSync('showContent');
  usePropSync('content');
  usePropSync('showDialog');
  usePropSync('dialog');

  const {
    showAppHeader = true,
    showAppFooter = true,
    showActionbar = true,
    actionbar = null,
    showToolbar = true,
    toolbar = null,
    showSnackbar = false,
    snackbar = null,
    showLeftInlayDrawer = false,
    leftInlayDrawers = [],
    showRightInlayDrawer = false,
    rightInlayDrawers = [],
    showBottomOverlayDrawer = false,
    bottomOverlayDrawers = [],
    showFooterbar = true,
    footerbar = null,
    showContent = true,
    content = null,
    showDialog = false,
    dialog = null,
  } = state;

  useEffect(() => {
    setAppControlToShell(true);

    return () => setAppControlToShell(false);
  }, []);

  return (
    <ShellConfigContext.Provider value={shellApiGenerator}>
      <ShellContainer {...{ showAppHeader }}>
        <AppHeaderContainer isVisible={showAppHeader}>
          <AppHeader inShell={true} />
        </AppHeaderContainer>
        {showSnackbar && snackbar && (
          <SlideIn entry={showSnackbar}>
            <SnackbarContainer>{snackbar}</SnackbarContainer>
          </SlideIn>
        )}
        <ActionbarContainer isVisible={showActionbar}>{actionbar}</ActionbarContainer>
        {showToolbar && toolbar && (
          <ToolbarContainer isVisible={showToolbar}>{toolbar}</ToolbarContainer>
        )}
        <MainContainer
          {...{
            showAppHeader,
            showActionbar,
            showToolbar,
            showFooterbar,
          }}
        >
          {showLeftInlayDrawer &&
            leftInlayDrawers.map((drawer, index) => (
              <LeftDrawersContainer>
                <DrawerIndexContext.Provider value={{ type: DrawerType.LEFT, index }}>
                  {drawer}
                </DrawerIndexContext.Provider>
              </LeftDrawersContainer>
            ))}
          <ContentContainer>{showContent && content}</ContentContainer>
          {showRightInlayDrawer &&
            rightInlayDrawers.map((drawer, index) => (
              <RightDrawersContainer>
                <DrawerIndexContext.Provider value={{ type: DrawerType.RIGHT, index }}>
                  {drawer}
                </DrawerIndexContext.Provider>
              </RightDrawersContainer>
            ))}
        </MainContainer>
        <BottomContainer isVisible={showFooterbar}>
          {showBottomOverlayDrawer &&
            bottomOverlayDrawers.map((drawer, index) => (
              <BottomDrawersContainer>
                <DrawerIndexContext.Provider value={{ type: DrawerType.BOTTOM, index }}>
                  {drawer}
                </DrawerIndexContext.Provider>
              </BottomDrawersContainer>
            ))}
          {showFooterbar && footerbar && <FooterbarContainer>{footerbar}</FooterbarContainer>}
        </BottomContainer>
        {showAppFooter && <AppFooter />}
        {dialog && <ModalContainer content={dialog} />}
      </ShellContainer>
    </ShellConfigContext.Provider>
  );
};

export function useShell(): IShellApi {
  const drawerIndex = useContext(DrawerIndexContext);
  const shellApiGenerator = useContext<ShellApiGenerator>(ShellConfigContext);
  return shellApiGenerator({ drawerIndex });
}
