import React from 'react';
import { SELECT_ACTION_TO_TAKE, REMOVE_ROWS, REPLACE_ROWS, REPLACE_WITH } from '../constants';
import { useStyles } from '../styles';
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
} from '@material-ui/core';

const ActionsWidget = (props) => {
  const { selectedAction, setSelectedAction, setReplaceValue, replaceValue } = props;
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
      <FormControl>
        <RadioGroup
          name="actions"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <FormControlLabel
            value="remove"
            className={classes.radioStyles}
            control={<Radio color="primary" />}
            label={REMOVE_ROWS}
          />
          <FormControlLabel
            value="replace"
            className={classes.radioStyles}
            control={<Radio color="primary" />}
            label={REPLACE_ROWS}
          />
        </RadioGroup>
      </FormControl>
      <br />
      {selectedAction == 'replace' && (
        <FormControl className={classes.replaceWithInput}>
          <FormLabel className={classes.replaceWithText}>{REPLACE_WITH}</FormLabel>
          <TextField
            variant="outlined"
            value={replaceValue}
            onChange={(e) => setReplaceValue(e.target.value)}
          />
        </FormControl>
      )}
    </section>
  );
};

export default ActionsWidget;
