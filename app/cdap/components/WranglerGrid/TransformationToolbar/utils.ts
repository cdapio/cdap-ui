import { MENU_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/menuOptions';
import {
  ColumnIcon,
  FragmentIcon,
  GridIcon,
  MathIcon,
  NullIcon,
  OtherIcon,
  SecurityIcon,
  StructureIcon,
} from 'components/WranglerGrid/TransformationToolbar/iconStore';
import ReplayIcon from '@material-ui/icons/Replay';
import { TOOLBAR_ICONS_LABEL_PREFIX } from 'components/WranglerGrid/TransformationToolbar/constants';
import T from 'i18n-react';
import { IMenuItem } from 'components/WranglerGrid/NestedMenu/MenuItemComponent';

export const nestedMenuOptions: IMenuItem[] = [
  {
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.undoIcon`).toString(),
    action: 'undo',
    dataType: ['all'],
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.undoIcon`).toString(),
    icon: ReplayIcon,
    options: [],
    open: false,
  },
  {
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.redoIcon`).toString(),
    action: 'redo',
    dataType: ['all'],
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.redoIcon`).toString(),
    icon: ReplayIcon,
    options: [],
    open: false,
  },
  {
    options: [],
    iconSVG: NullIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.nullIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.nullIcon`).toString(),
    open: false,
  },
  {
    options: [],
    iconSVG: ColumnIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.columnIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.columnIcon`).toString(),
    open: false,
  },
  {
    options: MENU_OPTIONS,
    iconSVG: StructureIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.structureIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.structureIcon`).toString(),
    open: false,
  },
  {
    options: [],
    iconSVG: FragmentIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.fragmentIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.fragmentIcon`).toString(),
    open: false,
  },
  {
    options: [],
    iconSVG: MathIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.mathIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.mathIcon`).toString(),
    open: false,
  },
  {
    options: [],
    iconSVG: SecurityIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.securityIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.securityIcon`).toString(),
    open: false,
  },
  {
    options: [],
    iconSVG: OtherIcon,
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.otherIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.otherIcon`).toString(),
    open: false,
  },
  {
    title: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.gridIcon`).toString(),
    toolName: T.translate(`${TOOLBAR_ICONS_LABEL_PREFIX}.gridIcon`).toString(),
    iconSVG: GridIcon,
    options: [],
    open: false,
  },
];
