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
  const { functionName, columnData, setLoading, missingDataList } = props;
  const params = useParams() as any;
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [columnsPopup, setColumnsPopup] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const { dataprep } = DataPrepStore.getState();
  console.log('state', dataprep);

  const classes = useStyles();

  const closeClickHandler = () => {
    setDrawerStatus(false);
  };

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    // ------------- For NULL Function
    const paramsData = {
      context: params.namespace,
      workspaceId: params.wid,
    };
    const directivesArray =
      selectedAction == 'remove'
        ? selectedColumns.map(
            ({ label }) =>
              `filter-rows-on condition-true ${label} == null || ${label} =~ \"^\\W*$\"`
          )
        : selectedColumns.map(({ label }) => `fill-null-or-empty :${label} '${replaceValue}'`);
    const apiPayload = {
      directives: dataprep.directives.length
        ? dataprep.directives.concat(directivesArray)
        : directivesArray,
      limit: 1000,
      insights: dataprep.insights,
    };

    MyDataPrepApi.execute(paramsData, apiPayload)
      .subscribe((response) => {
        props.callBack(response);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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
              setReplaceValue={setReplaceValue}
              replaceValue={replaceValue}
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
              dataQuality={missingDataList}
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
