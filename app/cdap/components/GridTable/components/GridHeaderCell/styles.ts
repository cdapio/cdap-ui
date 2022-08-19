import { makeStyles } from '@material-ui/core/styles';

export const useGridHeaderCellStyles = makeStyles({
  root: {
    minWidth: '216px',
    padding: '10px 0px 10px 30px',
    borderRadius: '0px',
    border: '0px',
    backgroundImage:
      'linear-gradient(0deg, rgba(70, 129, 244, 0) -49.23%, rgba(70, 129, 244, 0.1) 100%)',
  },
  tableHeaderCell: {
    padding: '0px',
    width: 'auto',
    fontSize: '14px',
    border: '1px solid #E0E0E0',
  },
  posRight: {
    marginLeft: '2px',
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#5F6368',
  },
  posLeft: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#5F6368',
  },
  pos: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#000000',
    marginBottom: '5px',
  },
});
