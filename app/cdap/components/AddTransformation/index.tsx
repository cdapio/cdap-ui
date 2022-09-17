import { Button, Container } from '@material-ui/core';
import DrawerWidget from 'components/DrawerWidget';
import React, { Fragment, useState } from 'react';
import ActionsWidget from './ActionsWidget';
import {
  ADD_TRANSFORMATION_STEP,
  APPLY_STEP,
  SELECT_COLUMNS_TO_APPLY_THIS_FUNCTION,
} from './constants';
import FunctionNameWidget from './FunctionNameWidget';
import SelectColumnsList from './SelectColumnsList';
import SelectColumnsWidget from './SelectColumnsWidget';
import SelectedColumnCountWidget from './SelectedColumnCountWidget';
import { useStyles } from './styles';

const AddTransformation = (props) => {
  const { functionName, showAddTransformationHandler } = props;

  // const [drawerStatus, setDrawerStatus] = useState(functionName);
  const [columnsPopup, setColumnsPopup] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const classes = useStyles();

  const closeClickHandler = () => {
    props.callBack();
  };

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const handleSelectColumn = () => {
    setColumnsPopup(true);
  };

  const closeSelectColumnsPopup = () => {
    setColumnsPopup(false);
  };

  return (
    <Fragment>
      <DrawerWidget
        headingText={ADD_TRANSFORMATION_STEP}
        openDrawer={functionName}
        closeClickHandler={closeClickHandler}
      >
        <Container className={classes.addTransformationBodyStyles}>
          <div className={classes.addTransformationBodyWrapperStyles}>
            <SelectedColumnCountWidget selectedColumnsCount={selectedColumns.length} />
            <FunctionNameWidget functionName={functionName} />
            <SelectColumnsWidget
              setSelectedColumns={setSelectedColumns}
              handleSelectColumn={handleSelectColumn}
            />
            <ActionsWidget functionName={functionName} />
          </div>
          <Button
            variant="contained"
            color="primary"
            classes={{ containedPrimary: classes.buttonStyles }}
            className={classes.applyStepButtonStyles}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleApply(e)}
          >
            {APPLY_STEP}
          </Button>
        </Container>
      </DrawerWidget>
      <DrawerWidget
        headingText={SELECT_COLUMNS_TO_APPLY_THIS_FUNCTION}
        openDrawer={columnsPopup}
        showBackIcon={true}
        closeClickHandler={closeSelectColumnsPopup}
      >
        <SelectColumnsList />
      </DrawerWidget>
    </Fragment>
  );
};

export default AddTransformation;
