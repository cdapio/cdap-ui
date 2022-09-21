import { Container } from '@material-ui/core';
import React, { Fragment } from 'react';
import { RECIPE_STEPS_EMPTY_INFO_TEXT, START_WRANGLING_YOUR_DATA } from '../constants';
import { useStyles } from '../styles';

const RecipeStepsEmptyScreen = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.emptyScreenStyles}>
      <img src="/cdap_assets/img/recipe-steps_infographic.svg" alt="Empty infographic" />
      <div className={classes.emptyScreenText}>{START_WRANGLING_YOUR_DATA}</div>
      <div className={classes.emptyScreenInfoText}>{RECIPE_STEPS_EMPTY_INFO_TEXT}</div>
    </Container>
  );
};

export default RecipeStepsEmptyScreen;
