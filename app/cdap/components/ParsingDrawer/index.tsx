import React, { useEffect, useState, useReducer, useContext } from 'react';
import Box from '@material-ui/core/Box';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Button } from '@material-ui/core';
import { useStyles } from './styles';
import { APPLY_BUTTON, IMPORT_SCHEMA, PARSING, PARSING_INFO_TEXT } from './constants';
import ParsingPopupBody from './Components/ParsingPopupBody';
import DrawerWidget from 'components/DrawerWidget';
import ParsingHeaderActionTemplate from './Components/ParsingHeaderActionTemplate';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import DataPrepStore from 'components/DataPrep/store';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import MyDataPrepApi from 'api/dataprep';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import { objectQuery } from 'services/helpers';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import Snackbar from 'components/SnackbarComponent/index';

const ParsingDrawer = (props) => {
  const [drawerStatus, setDrawerStatus] = useState(true);
  const [formatValue, setFormatValue] = useState();
  const [encodingValue, setEncodingValue] = useState();
  const [quotedValuesChecked, setQuotedValuesChecked] = useState(false);
  const [headerValueChecked, setHeaderValueChecked] = useState(false);
  const [schemaValue, setSchemaValue] = useState(null);
  const { dataprep } = DataPrepStore.getState();
  const { onWorkspaceCreate } = useContext(ConnectionsContext);
  const [errorOnTranformation, setErrorOnTransformation] = useState({
    open: false,
    message: '',
  });
  const [connectionPayload, setConnectionPayload] = useState({
    path: '',
    connection: '',
    sampleRequest: {
      properties: {
        format: formatValue,
        fileEncoding: encodingValue,
        skipHeader: headerValueChecked,
        enableQuotedValues: quotedValuesChecked,
        schema: schemaValue,
        _pluginName: null,
      },
      limit: 1000,
    },
  });
  const classes = useStyles();

  useEffect(() => {
    setConnectionPayload({
      path: dataprep.insights.path,
      connection: dataprep.connectorType,
      sampleRequest: {
        properties: {
          format: formatValue,
          fileEncoding: encodingValue,
          skipHeader: headerValueChecked,
          enableQuotedValues: quotedValuesChecked,
          schema: JSON.stringify(schemaValue),
          _pluginName: null,
        },
        limit: 1000,
      },
    });
    setDrawerStatus(true);
  }, [dataprep, formatValue, encodingValue, quotedValuesChecked, headerValueChecked, schemaValue]);

  const closeClickHandler = () => {
    setDrawerStatus(false);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as any;
    setFormatValue(value);
  };

  const handleEncodingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as any;
    setEncodingValue(value);
  };

  const handleQuoteValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuotedValuesChecked(event.target.checked);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderValueChecked(event.target.checked);
  };

  const handleSchemaUpload = (schema) => {
    setSchemaValue(schema);
  };

  const handleApply = (event: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm(connectionPayload);
  };

  const createWorkspaceInternal = async (entity, parseConfig = {}) => {
    try {
      const wid = await createWorkspace({
        entity,
        connection: dataprep.insights.name,
        properties: connectionPayload.sampleRequest.properties,
      });
      if (onWorkspaceCreate) {
        return onWorkspaceCreate(wid);
      }
      setDrawerStatus(false);
      props.updateDataTranformation(wid);
    } catch (err) {
      setErrorOnTransformation({
        open: true,
        message: 'Selected Transformation Cannot Be Applied',
      });
    }
  };

  const onConfirm = async (parseConfig) => {
    try {
      await createWorkspaceInternal(connectionPayload, parseConfig);
    } catch (e) {
      console.log('error', e);
    }
  };

  const componentToRender = (
    <DrawerWidget
      headingText={PARSING}
      openDrawer={setDrawerStatus}
      showDivider={true}
      headerActionTemplate={
        <ParsingHeaderActionTemplate
          handleSchemaUpload={(schema) => handleSchemaUpload(schema)}
          setErrorOnTransformation={setErrorOnTransformation}
        />
      }
      closeClickHandler={closeClickHandler}
    >
      <Box className={classes.bodyContainerStyles}>
        <ParsingPopupBody
          formatValue={formatValue}
          handleFormatChange={handleFormatChange}
          encodingValue={encodingValue}
          handleEncodingChange={handleEncodingChange}
          quotedValuesChecked={quotedValuesChecked}
          handleQuoteValueChange={handleQuoteValueChange}
          headerValueChecked={headerValueChecked}
          handleCheckboxChange={handleCheckboxChange}
        />

        <Box className={classes.bottomSectionStyles}>
          <Box className={classes.infoWrapperStyles}>
            <ErrorOutlineIcon />
            <span className={classes.infoTextStyles}>{PARSING_INFO_TEXT}</span>
          </Box>
          <Button
            variant="contained"
            color="primary"
            classes={{ containedPrimary: classes.buttonStyles }}
            className={classes.applyButtonStyles}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleApply(e)}
          >
            {APPLY_BUTTON}
          </Button>
        </Box>
      </Box>
      {errorOnTranformation.open && (
        <Snackbar
          handleCloseError={() => {
            setErrorOnTransformation({ open: false, message: '' });
          }}
        />
      )}
    </DrawerWidget>
  );

  return drawerStatus && componentToRender;
};

export default ParsingDrawer;
