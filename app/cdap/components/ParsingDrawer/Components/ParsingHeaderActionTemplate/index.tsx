import { Box } from '@material-ui/core';
import { IMPORT_SCHEMA } from 'components/ParsingDrawer/constants';
import { useStyles } from 'components/ParsingDrawer/styles';
import React from 'react';
import { parseImportedSchemas } from 'components/AbstractWidget/SchemaEditor/SchemaHelpers';

const ParsingHeaderActionTemplate = (props) => {
  const classes = useStyles();
  const handleFile = (event) => {
    const schemaFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(schemaFile, 'UTF-8');
    reader.onload = (evt) => {
      try {
        const fileContents = JSON.parse(evt.target.result.toString());
        const importedSchemas = parseImportedSchemas(fileContents);
        const schema = importedSchemas[0] && importedSchemas[0].schema;
        props.handleSchemaUpload(schema);
      } catch (e) {
        props.setErrorOnTransformation({
          open: true,
          message: 'Imported schema is not a valid Avro schema',
        });
        // setParsingErrorMessage('Imported schema is not a valid Avro schema');
      }
    };
  };
  return (
    <Box className={classes.pointerStyles}>
      <input
        id="file"
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <label htmlFor="file">
        <img
          className={classes.importIconStyles}
          src="/cdap_assets/img/import.svg"
          alt="import schema icon"
        />
      </label>
      <span className={classes.importSchemaTextStyles}>{IMPORT_SCHEMA}</span>
    </Box>
  );
};

export default ParsingHeaderActionTemplate;
