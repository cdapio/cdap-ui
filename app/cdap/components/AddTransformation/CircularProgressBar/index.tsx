import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';
import { useStyles } from '../styles';

const CircularDeterminate = (props) => {
  const [progress, setProgress] = useState(props.percentage);
  const classes = useStyles();
  useEffect(() => {
    setProgress(props.percentage);
  }, [props]);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={parseInt(progress)}
        className={
          progress < 100
            ? classes.circularProgress + ' ' + classes.circularProgressRed
            : classes.circularProgress + ' ' + classes.circularProgressSuccess
        }
        size={60}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          className={progress < 100 ? classes.circularProgressRed : classes.circularProgressSuccess}
        >
          {`${parseInt(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularDeterminate;
