import { makeStyles } from '@material-ui/core/styles';

export const useGridTextCellStyles = makeStyles({
  root: {
    minWidth: '216px',
    backgroundColor: '#fff',
    padding: '5px 5px 5px 30px',
    borderRadius: '0px',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  tableRowCell: {
    minWidth: '150.6px',
    border: '1px solid #E0E0E0',
    fontSize: '14px',
    width: 'auto',
    lineHeight: '21px',
    padding: '0px',
    borderBottom: '1px solid #E0E0E0',
    color: '#5F6368',
    boxSizing: 'content-box',
  },
  pos: {
    lineHeight: '21px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#5F6368',
  },
});
