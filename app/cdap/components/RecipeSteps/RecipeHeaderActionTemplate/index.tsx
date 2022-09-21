import React from 'react';
import { useStyles } from '../styles';

const RecipeHeaderActionTemplate = (props) => {
  const classes = useStyles();

  return (
    <div>
      <img
        className={classes.importIconStyles}
        src="/cdap_assets/img/import.svg"
        alt="Download icon"
      />
      <img src="/cdap_assets/img/more-options.svg" alt="More icon" />
    </div>
  );
};

export default RecipeHeaderActionTemplate;
