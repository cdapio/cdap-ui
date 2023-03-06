import React from 'react';

export enum DrawerType {
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
}

export interface IShellProps {
  showAppHeader?: boolean;
  showAppFooter?: boolean;
  showActionbar?: boolean;
  actionbar?: React.ReactNode;
  showToolbar?: boolean;
  toolbar?: React.ReactNode;
  showSnackbar?: boolean;
  snackbar?: React.ReactNode;
  showLeftInlayDrawer?: boolean;
  leftInlayDrawers?: React.ReactNode | React.ReactNode[];
  showRightInlayDrawer?: boolean;
  rightInlayDrawers?: React.ReactNode | React.ReactNode[];
  showBottomOverlayDrawer?: boolean;
  bottomOverlayDrawers?: React.ReactNode | React.ReactNode[];
  showFooterbar?: boolean;
  footerbar?: React.ReactNode;
  showContent?: boolean;
  content?: React.ReactNode;
  showDialog?: boolean;
  dialog?: React.ReactElement<any> | null;
}

export interface IShellConfig
  extends Omit<IShellProps, 'leftInlayDrawers' | 'rightInlayDrawers' | 'bottomOverlayDrawers'> {
  leftInlayDrawers?: React.ReactNode[];
  rightInlayDrawers?: React.ReactNode[];
  bottomOverlayDrawers?: React.ReactNode[];
}

export interface IVisibilityToggle {
  isVisible: boolean;
  show(): void;
  hide(): void;
}

export interface IShellSlot extends IVisibilityToggle {
  renderWith(widget: React.ReactNode): void;
  clear(): void;
}

export interface IShellDrawer extends IVisibilityToggle {
  openWith(widget: React.ReactNode): void;
  getLength(): number;
  close(index?: number): void;
  getDrawerIndex(): number;
}

export interface IShellApi {
  appHeader?: IVisibilityToggle;
  appFooter?: IVisibilityToggle;
  actionbar?: IShellSlot;
  toolbar?: IShellSlot;
  snackbar?: IShellSlot;

  leftInlayDrawers?: IShellDrawer;
  rightInlayDrawers?: IShellDrawer;
  bottomOverlayDrawers?: IShellDrawer;

  content?: IShellSlot;
  footerbar?: IShellSlot;
  dialog?: IShellSlot;
}

export interface IDrawerIndex {
  type?: DrawerType;
  index?: number;
}

export interface IShellApiDeps {
  drawerIndex?: IDrawerIndex;
}

export type ShellApiGenerator = (deps: IShellApiDeps) => IShellApi;

export interface IShellController {
  state: IShellConfig;
  replaceState(newState: IShellConfig): void;
  updateState(newState: IShellConfig): void;
  shellApiGenerator: ShellApiGenerator;
}
