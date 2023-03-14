import React, { useReducer, useContext } from 'react';
import { DrawerIndexContext } from 'components/Shell/contexts/DrawerIndexContext';
import {
  UPDATE_STATE,
  REPLACE_STATE,
  TOGGLE_APP_HEADER,
  TOGGLE_APP_FOOTER,
  TOGGLE_ACTIONBAR,
  SET_ACTIONBAR,
  TOGGLE_TOOLBAR,
  SET_TOOLBAR,
  TOGGLE_SNACKBAR,
  SET_SNACKBAR,
  TOGGLE_FOOTERBAR,
  SET_FOOTERBAR,
  TOGGLE_CONTENT,
  SET_CONTENT,
  TOGGLE_MODAL,
  SET_MODAL,
  TOGGLE_LEFT_INLAY_DRAWER,
  ADD_LEFT_INLAY_DRAWER,
  CLOSE_LEFT_INLAY_DRAWERS,
  TOGGLE_RIGHT_INLAY_DRAWER,
  ADD_RIGHT_INLAY_DRAWER,
  CLOSE_RIGHT_INLAY_DRAWERS,
  TOGGLE_BOTTOM_OVERLAY_DRAWER,
  ADD_BOTTOM_OVERLAY_DRAWER,
  CLOSE_BOTTOM_OVERLAY_DRAWERS,
} from 'components/Shell/store/actions';
import {
  DrawerType,
  IShellConfig,
  IShellApi,
  IShellApiDeps,
  IShellController,
  IVisibilityToggle,
  IShellSlot,
  IShellDrawer,
  IDrawerIndex,
} from 'components/Shell/types';

interface IShellAction {
  type: string;
  payload?: any;
}

function reducer(state: IShellConfig, action: IShellAction): IShellConfig {
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, ...action.payload };

    case REPLACE_STATE:
      return { ...action.payload };

    case TOGGLE_APP_HEADER:
      return { ...state, showAppHeader: action.payload };

    case TOGGLE_APP_FOOTER:
      return { ...state, showAppFooter: action.payload };

    case TOGGLE_ACTIONBAR:
      return { ...state, showActionbar: action.payload };

    case SET_ACTIONBAR:
      return { ...state, actionbar: action.payload };

    case TOGGLE_TOOLBAR:
      return { ...state, showToolbar: action.payload };

    case SET_TOOLBAR:
      return { ...state, toolbar: action.payload };

    case TOGGLE_SNACKBAR:
      return { ...state, showSnackbar: action.payload };

    case SET_SNACKBAR:
      return { ...state, toolbar: action.payload };

    case TOGGLE_FOOTERBAR:
      return { ...state, showFooterbar: action.payload };

    case SET_FOOTERBAR:
      return { ...state, footerbar: action.payload };

    case TOGGLE_CONTENT:
      return { ...state, showContent: action.payload };

    case SET_CONTENT:
      return { ...state, content: action.payload };

    case TOGGLE_MODAL:
      return { ...state, showDialog: action.payload };

    case SET_MODAL:
      return { ...state, dialog: action.payload };

    case TOGGLE_LEFT_INLAY_DRAWER:
      return { ...state, showLeftInlayDrawer: action.payload };

    case ADD_LEFT_INLAY_DRAWER:
      return {
        ...state,
        showLeftInlayDrawer: true,
        leftInlayDrawers: [...state.leftInlayDrawers, action.payload],
      };

    case CLOSE_LEFT_INLAY_DRAWERS:
      return {
        ...state,
        leftInlayDrawers: state.leftInlayDrawers.slice(0, action.payload),
        showLeftInlayDrawer: action.payload !== 0,
      };

    case TOGGLE_RIGHT_INLAY_DRAWER:
      return { ...state, showRightInlayDrawer: action.payload };

    case ADD_RIGHT_INLAY_DRAWER:
      return {
        ...state,
        showRightInlayDrawer: true,
        rightInlayDrawers: [...state.rightInlayDrawers, action.payload],
      };

    case CLOSE_RIGHT_INLAY_DRAWERS:
      return {
        ...state,
        rightInlayDrawers: state.rightInlayDrawers.slice(0, action.payload),
        showRightInlayDrawer: action.payload !== 0,
      };

    case TOGGLE_BOTTOM_OVERLAY_DRAWER:
      return { ...state, showBottomOverlayDrawer: action.payload };

    case ADD_BOTTOM_OVERLAY_DRAWER:
      return {
        ...state,
        showBottomOverlayDrawer: true,
        bottomOverlayDrawers: [...state.bottomOverlayDrawers, action.payload],
      };

    case CLOSE_BOTTOM_OVERLAY_DRAWERS:
      return {
        ...state,
        bottomOverlayDrawers: state.bottomOverlayDrawers.slice(0, action.payload),
        showBottomOverlayDrawer: action.payload !== 0,
      };

    default:
      return state;
  }
}

function makeVisibilityApi(dispatch, visibility: boolean, toggleAction: string): IVisibilityToggle {
  return {
    isVisible: visibility,
    show() {
      dispatch({ type: toggleAction, payload: true });
    },
    hide() {
      dispatch({ type: toggleAction, payload: false });
    },
  };
}

function makeSlotApi(
  dispatch,
  visibility: boolean,
  toggleAction: string,
  renderAction: string
): IShellSlot {
  return {
    ...makeVisibilityApi(dispatch, visibility, toggleAction),
    renderWith(widget: React.ReactNode): void {
      dispatch({ type: renderAction, payload: widget });
      dispatch({ type: toggleAction, payload: true });
    },
    clear() {
      dispatch({ type: renderAction, payload: null });
      dispatch({ type: toggleAction, payload: false });
    },
  };
}

function makeDrawerApi(
  dispatch,
  type: DrawerType,
  visibility: boolean,
  elements: React.ReactNode[],
  drawerIndex?: IDrawerIndex,
  toggleAction: string,
  openAction: string,
  closeAction: string
): IShellDrawer {
  const selfIndex = drawerIndex && drawerIndex.type === type ? drawerIndex.index : -1;

  return {
    ...makeVisibilityApi(dispatch, visibility, toggleAction),
    openWith(widget: React.ReactNode): void {
      dispatch({ type: openAction, payload: widget });
    },
    close(index?: number = 0) {
      if (index < 0) {
        return;
      }
      dispatch({ type: closeAction, payload: index });
    },
    getLength(): number {
      return elements.length;
    },
    getDrawerIndex(): number {
      return selfIndex;
    },
  };
}

export function useShellReducer(initialState: IShellConfig): IShellController {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,

    replaceState(newState: IShellConfig): void {
      dispatch({ type: REPLACE_STATE, payload: newState });
    },

    updateState(newState: IShellConfig): void {
      return dispatch({ type: UPDATE_STATE, payload: newState });
    },

    shellApiGenerator(deps: IShellApiDeps): IShellApi {
      const { drawerIndex } = deps;
      return {
        appHeader: makeVisibilityApi(dispatch, state.showAppHeader, TOGGLE_APP_HEADER),
        appFooter: makeVisibilityApi(dispatch, state.showAppFooter, TOGGLE_APP_FOOTER),

        actionbar: makeSlotApi(dispatch, state.showActionbar, TOGGLE_ACTIONBAR, SET_ACTIONBAR),
        toolbar: makeSlotApi(dispatch, state.showToolbar, TOGGLE_TOOLBAR, SET_TOOLBAR),
        snackbar: makeSlotApi(dispatch, state.showSnackbar, TOGGLE_SNACKBAR, SET_SNACKBAR),
        footerbar: makeSlotApi(dispatch, state.showFooterbar, TOGGLE_FOOTERBAR, SET_FOOTERBAR),
        content: makeSlotApi(dispatch, state.showContent, TOGGLE_CONTENT, SET_CONTENT),
        dialog: makeSlotApi(dispatch, state.showDialog, TOGGLE_MODAL, SET_MODAL),

        leftInlayDrawers: makeDrawerApi(
          dispatch,
          DrawerType.LEFT,
          state.showLeftInlayDrawer,
          state.leftInlayDrawers,
          drawerIndex,
          TOGGLE_LEFT_INLAY_DRAWER,
          ADD_LEFT_INLAY_DRAWER,
          CLOSE_LEFT_INLAY_DRAWERS
        ),
        rightInlayDrawers: makeDrawerApi(
          dispatch,
          DrawerType.RIGHT,
          state.showRightInlayDrawer,
          state.rightInlayDrawers,
          drawerIndex,
          TOGGLE_RIGHT_INLAY_DRAWER,
          ADD_RIGHT_INLAY_DRAWER,
          CLOSE_RIGHT_INLAY_DRAWERS
        ),
        bottomOverlayDrawers: makeDrawerApi(
          dispatch,
          DrawerType.BOTTOM,
          state.showBottomOverlayDrawer,
          state.bottomOverlayDrawers,
          drawerIndex,
          TOGGLE_BOTTOM_OVERLAY_DRAWER,
          ADD_BOTTOM_OVERLAY_DRAWER,
          CLOSE_BOTTOM_OVERLAY_DRAWERS
        ),
      };
    },
  };
}
