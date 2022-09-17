import { Container } from '@material-ui/core';
import DataPrepStore from 'components/DataPrep/store';
import DrawerWidget from 'components/DrawerWidget';
import React, { useEffect, useState } from 'react';
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

const RecipeSteps = ({ setShowRecipePanel, showRecipePanel }) => {
  const [recipeSteps, setRecipeSteps] = useState(recipes);

  const classes = useStyles();

  useEffect(() => {
    const { dataprep } = DataPrepStore.getState();

    setRecipeSteps(dataprep.directives);
  }, []);

  const closeClickHandler = () => {
    setShowRecipePanel(false);
  };

  return (
    <DrawerWidget
      headingText={RECIPE}
      openDrawer={showRecipePanel}
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
