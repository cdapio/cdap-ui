import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
export interface State extends SnackbarOrigin {
  open: boolean;
}
