import React from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: "216px",
    // maxWidth: '202px',
    width: "fit-content",
    backgroundColor: "#fff",
    padding: "10px 10px 10px 30px",
    borderRadius: "0px",
    display: "flex",
    flexDirection: "column",
  },
  KPICell: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "5px",
  },
  posRight: {
    lineHeight: "21px",
    fontSize: "14px",
    fontWeight: 400,
    color: "red",
  },
  posLeft: {
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 400,
    color: "#5F6368",
  },
});

const StringIndicatorBox = styled(Box)({
  display: "flex",
});

const GridKPICell = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Box className={classes.KPICell}>
        <Typography className={classes.posLeft}>{"Missing/Null"}</Typography>
        <Typography className={classes.posRight}>{"794"}</Typography>
      </Box>
      <Box className={classes.KPICell}>
        <Typography className={classes.posLeft}>{"Invalid"}</Typography>
        <Typography className={classes.posRight}>{"142"}</Typography>
      </Box>
    </Card>
  );
};

export default GridKPICell;
