import { makeStyles } from '@material-ui/core/styles';

export const useGridKPICellStyles = makeStyles({
  root: {
    minWidth: '216px',
    width: 'fit-content',
    backgroundColor: '#fff',
    padding: '10px 10px 0px 30px',
    borderRadius: '0px',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeaderCell: {
    padding: '0px',
    width: 'auto',
    fontSize: '14px',
    border: '1px solid #E0E0E0',
  },
  KPICell: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '5px',
  },
  posRight: {
    lineHeight: '21px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'red',
  },
  posLeft: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#5F6368',
  },
});
