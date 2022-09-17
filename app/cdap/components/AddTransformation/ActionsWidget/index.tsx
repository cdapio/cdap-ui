import React from 'react';
import { SELECT_ACTION_TO_TAKE } from '../constants';
import { useStyles } from '../styles';

const ActionsWidget = (props) => {
  const classes = useStyles();

  return (
    <section className={classes.functionSectionStyles}>
      <div className={classes.funtionSectionWrapperStyles}>
        <div className={classes.functionHeadingTextStyles}>{SELECT_ACTION_TO_TAKE}</div>
        <img
          className={classes.greenCheckIconStyles}
          src="/cdap_assets/img/green-check.svg"
          alt="tick icon"
        />
      </div>
    </section>
  );
};

export default ActionsWidget;
