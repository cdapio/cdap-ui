import { Container } from '@material-ui/core';
import DrawerWidget from 'components/DrawerWidget';
import React, { useState } from 'react';
import { RECIPE } from './constants';
import RecipeHeaderActionTemplate from './RecipeHeaderActionTemplate';
import RecipeStepsEmptyScreen from './RecipeStepsEmptyScreen';
import RecipeStepsTableComponent from './RecipeStepsTableComponent';
import { useStyles } from './styles';

const recipes = [
  {
    actionType: 'Parse Column',
    description: "'Body' with delimiter 'comma' and set 'first row as header'",
  },
  {
    actionType: 'Delete Column',
    description: "'Body'",
  },
];

const RecipeSteps = (props) => {
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [recipeSteps, setRecipeSteps] = useState(recipes);

  const classes = useStyles();

  const closeClickHandler = () => {
    setDrawerStatus(false);
  };

  return (
    <DrawerWidget
      headingText={RECIPE}
      openDrawer={drawerStatus}
      showDivider={true}
      headerActionTemplate={<RecipeHeaderActionTemplate />}
      closeClickHandler={closeClickHandler}
    >
      <Container className={classes.RecipeStepsBodyStyles}>
        {recipeSteps.length ? (
          <RecipeStepsTableComponent recipeSteps={recipeSteps} />
        ) : (
          <RecipeStepsEmptyScreen />
        )}
      </Container>
    </DrawerWidget>
  );
};

export default RecipeSteps;
