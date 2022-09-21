import { FormGroup } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import ParseComponent from '..';
import { DEPTH, DEPTH_PLACEHOLDER, PARSE_AS_XML_TO_JSON } from '../../constants';
import { useStyles } from '../../styles';
import FormInputFieldComponent from '../FormInputFieldComponent';

const ParseXMLToJSONComponent = (props) => {
  const { setDirectiveComponentsValue, directiveComponentValues } = props;
  const [depth, setDepth] = useState(1);

  const classes = useStyles();

  useEffect(() => {
    setDirectiveComponentsValue({ ...directiveComponentValues, depth });
  }, [depth]);

  return (
    <ParseComponent sectionHeading={PARSE_AS_XML_TO_JSON}>
      <FormGroup>
        <div className={classes.formLabelStyles}>{DEPTH}</div>
        <FormInputFieldComponent
          formInputValue={depth}
          classnames={classes.formFieldStyles}
          inputProps={{
            classes: { underline: classes.underlineStyles, input: classes.inputStyles },
            type: 'number',
            value: depth,
            onChange: (e) => setDepth(e.target.value),
            color: 'primary',
            placeholder: DEPTH_PLACEHOLDER,
          }}
        />
      </FormGroup>
    </ParseComponent>
  );
};

export default ParseXMLToJSONComponent;
