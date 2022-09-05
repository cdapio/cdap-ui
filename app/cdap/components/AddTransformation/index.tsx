import { Button, Container } from '@material-ui/core';
import DrawerWidget from 'components/DrawerWidget';
import React, { Fragment, useState } from 'react';
import ActionsWidget from './ActionsWidget';
import {
  ADD_TRANSFORMATION_STEP,
  APPLY_STEP,
  SELECT_COLUMNS_TO_APPLY_THIS_FUNCTION,
  DONE_STEP,
} from './constants';
import FunctionNameWidget from './FunctionNameWidget';
import SelectColumnsList from './SelectColumnsList';
import SelectColumnsWidget from './SelectColumnsWidget';
import SelectedColumnCountWidget from './SelectedColumnCountWidget';
import DataPrepStore from 'components/DataPrep/store';
import { useStyles } from './styles';
import MyDataPrepApi from 'api/dataprep';
import { useParams } from 'react-router';

const AddTransformation = (props) => {
  const { functionName, columnData } = props;
  const params = useParams() as any;
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [columnsPopup, setColumnsPopup] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const { dataprep } = DataPrepStore.getState();
  console.log('state', dataprep);

  const classes = useStyles();

  const closeClickHandler = () => {
    setDrawerStatus(false);
  };

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    // ------------- For NULL Function
    const paramsData = {
      context: params.namespace,
      workspaceId: params.wid,
    };
    const directivesArray = selectedColumns.map(
      ({ label }) => `filter-rows-on condition-true ${label} == null || ${label} =~ \"^\\W*$\"`
    );
    const apiPayload = {
      directives: dataprep.directives.concat(directivesArray),
      limit: 1000,
      insights: dataprep.insights,
    };

    MyDataPrepApi.execute(paramsData, apiPayload).subscribe((response) => {
      console.log('response', response);
    });
  };

  const handleSelectColumn = () => {
    setColumnsPopup(true);
  };

  const closeSelectColumnsPopup = () => {
    setColumnsPopup(false);
  };

  const handleSelectAction = () => {};

  return (
    <Fragment>
      <DrawerWidget
        headingText={ADD_TRANSFORMATION_STEP}
        openDrawer={drawerStatus}
        closeClickHandler={closeClickHandler}
      >
        <Container className={classes.addTransformationBodyStyles}>
          <div className={classes.addTransformationBodyWrapperStyles}>
            <SelectedColumnCountWidget selectedColumnsCount={selectedColumns.length} />
            <FunctionNameWidget functionName={functionName} />
            <SelectColumnsWidget
              setSelectedColumns={setSelectedColumns}
              handleSelectColumn={handleSelectColumn}
              selectedColumns={selectedColumns}
            />
            <ActionsWidget
              functionName={functionName}
              setSelectedAction={setSelectedAction}
              selectedAction={selectedAction}
            />
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
        <Container className={classes.addTransformationBodyStyles}>
          <div className={classes.addTransformationBodyWrapperStyles}>
            <SelectColumnsList
              columnData={columnData}
              selectedColumnsCount={selectedColumns.length}
              setSelectedColumns={setSelectedColumns}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            classes={{ containedPrimary: classes.buttonStyles }}
            className={classes.applyStepButtonStyles}
            onClick={closeSelectColumnsPopup}
          >
            {DONE_STEP}
          </Button>
        </Container>
      </DrawerWidget>
    </Fragment>
  );
};

export default AddTransformation;
