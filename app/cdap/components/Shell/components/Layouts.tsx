import React from 'react';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';

// Heights in px
const appHeaderHeight = 48;
const actionbarHeight = 48;
const toolbarHeight = 48;
const snackbarHeight = 48;
const footerbarHeight = 40;

// Colors
const grey = '#E0E0E0';

// animation config
const animEasing = 'cubic-bezier(0, 0, 0.2, 1)';
const animDurationInMs = 200;
const animDuration = `${animDurationInMs / 1000}s`;

interface ITransitionProps {
  entry: boolean;
  children?: React.ReactElement<any>;
  onEntered?(): void;
  onExited?(): void;
}

export const Collapsable: React.FC<ITransitionProps> = ({
  children,
  entry,
  onEntered,
  onExited,
}) => {
  return (
    <Collapse
      in={entry}
      mountOnEnter
      unmountOnExit
      timeout={animDurationInMs}
      onEntered={onEntered}
      onExited={onExited}
    >
      {children}
    </Collapse>
  );
};

interface ISlideInProps extends ITransitionProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const SlideIn: React.FC<ISlideInProps> = ({
  children,
  entry,
  direction = 'down',
  onEntered,
  onExited,
}) => {
  return (
    <Slide
      direction={direction}
      in={entry}
      mountOnEnter
      unmountOnExit
      timeout={animDurationInMs}
      onEntered={onEntered}
      onExited={onExited}
    >
      {children}
    </Slide>
  );
};

interface IShellContainerProps {
  showAppHeader?: boolean;
}

export const ShellContainer = styled.div<IShellContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

interface IShellSlotProps {
  isVisible?: boolean;
}

export const AppHeaderContainer = styled.div<IShellSlotProps>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.isVisible ? appHeaderHeight : 0)}px;
  flex-grow: ${(props) => (props.isVisible ? 1 : 0)};
  transition: all ${animDuration} ${animEasing};
  overflow: hidden;
`;

export const ActionbarContainer = styled.div<IShellSlotProps>`
  width: 100%;
  border-bottom: 1px ${grey} solid;
  height: ${(props) => (props.isVisible ? actionbarHeight : 0)}px;
  flex-grow: ${(props) => (props.isVisible ? 1 : 0)};
  transition: all ${animDuration} ${animEasing};
  overflow: hidden;
`;

export const ToolbarContainer = styled.div<IShellSlotProps>`
  width: 100%;
  border-bottom: 1px ${grey} solid;
  height: ${(props) => (props.isVisible ? toolbarHeight : 0)}px;
  flex-grow: ${(props) => (props.isVisible ? 1 : 0)};
  transition: all ${animDuration} ${animEasing};
  overflow: hidden;
`;

export const SnackbarContainer = styled.div`
  position: absolute;
  top: 0;
  height: ${snackbarHeight}px;
  width: 100%;
`;

interface IMainContainerProps {
  showAppHeader?: boolean;
  showActionbar?: boolean;
  showToolbar?: boolean;
  showFooterbar?: boolean;
}

function getExcludedHeightFromProps(props: IMainContainerProps): number {
  let excludedHeight = 0;

  if (props.showAppHeader) {
    excludedHeight += appHeaderHeight;
  }
  if (props.showActionbar) {
    excludedHeight += actionbarHeight;
  }
  if (props.showToolbar) {
    excludedHeight += toolbarHeight;
  }
  if (props.showFooterbar) {
    excludedHeight += footerbarHeight;
  }

  return excludedHeight;
}

export const MainContainer = styled.div<IMainContainerProps>`
  position: relative;
  display: flex;
  align-items: stretch;
  height: calc(100vh - ${getExcludedHeightFromProps}px);
  transition: all ${animDuration} ${animEasing};
`;

export const ContentContainer = styled.div`
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  transition: all ${animDuration} ${animEasing};
`;

export const FooterbarContainer = styled.div`
  position: relative;
  height: ${footerbarHeight}px;
  border-top: 1px ${grey} solid;
  transition: all ${animDuration} ${animEasing};
`;

export const LeftDrawersContainer = styled.div`
  height: 100%;
  min-width: 300px;
  flex-grow: 1;
  border-right: 1px ${grey} solid;
  transition: all ${animDuration} ${animEasing};
`;

export const RightDrawersContainer = styled.div`
  height: 100%;
  min-width: 300px;
  flex-grow: 1;
  border-left: 1px ${grey} solid;
  transition: all ${animDuration} ${animEasing};
`;

export const BottomContainer = styled.div<IShellSlotProps>`
  width: 100%;
  flex-grow: ${(props) => (props.isVisible ? 1 : 0)};
  transition: all ${animDuration} ${animEasing};
`;

export const BottomDrawersContainer = styled.div`
  width: 100%;
  min-height: 80px;
  border-top: 1px ${grey} solid;
`;
