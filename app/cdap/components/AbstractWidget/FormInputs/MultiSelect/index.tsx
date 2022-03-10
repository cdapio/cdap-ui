/*
 * Copyright © 2019 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IWidgetProps } from 'components/AbstractWidget';
import { Tooltip, Checkbox, ListItemText, MenuItem, Box, Chip, Select } from '@material-ui/core';
import { WIDGET_PROPTYPES } from 'components/AbstractWidget/constants';
import { objectQuery } from 'services/helpers';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import ThemeWrapper from 'components/ThemeWrapper';

export interface IOption {
  id: string;
  label: string;
}

interface IMultiSelectWidgetProps {
  delimiter?: string;
  options: IOption[] | string[];
  showSelectionCount?: boolean;
  emptyPlaceholder?: string;
}
const styles = (theme) => {
  return {
    root: {
      margin: theme.Spacing(2),
    },
    // unable to use styled component for Tooltip
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  };
};

const StyledChip = styled(Chip)`
  margin: 3px;
  background-color: white;
`;

const Hyperlink = styled.a`
  margin: 3px;
`;

interface IMultiSelectProps
  extends IWidgetProps<IMultiSelectWidgetProps>,
    WithStyles<typeof styles> {}

function MultiSelectBase({
  value,
  widgetProps,
  disabled,
  onChange,
  classes,
  dataCy,
}: IMultiSelectProps) {
  const delimiter = objectQuery(widgetProps, 'delimiter') || ',';

  let options = objectQuery(widgetProps, 'options') || [];

  // Convert 'option' to IOption if it is string
  options = options.map((opt) => {
    return typeof opt === 'string' ? { id: opt, label: opt } : opt;
  });

  const showSelectionCount = objectQuery(widgetProps, 'showSelectionCount') || false;
  const emptyPlaceholder = objectQuery(widgetProps, 'emptyPlaceholder') || '';

  const initSelection = value.toString().split(delimiter);
  const [selections, setSelections] = useState<string[]>(initSelection);

  // Get the width of the select box for different window size
  const ref = useRef(null);
  const [selectWidth, setSelectWidth] = useState(600);

  //  onChangeHandler takes array, turns it into string w/delimiter, and calls onChange on the string
  const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = event.target.value as any; // it's expecting a string but multiple select returns an array
    const selectionsString = values.filter((val) => val).join(delimiter);
    setSelections(values);
    setSelectWidth(ref.current.offsetWidth);
    onChange(selectionsString);
  };

  useEffect(() => {
    function handleResize() {
      setSelectWidth(ref.current.offsetWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const selection = value.toString().split(delimiter);
    setSelections(selection);
  }, [value]);

  function renderValue(values: any) {
    if (selections.length === 0 || (selections.length === 1 && selections[0] === '')) {
      return emptyPlaceholder;
    }

    if (!showSelectionCount) {
      return (
        <Box>
          {selections.map((item) => (
            <StyledChip variant="outlined" key={item} label={item} />
          ))}
        </Box>
      );
    }
    const shownSelections = [];
    let additionalSelectionCount = '';
    let additionalSelectionText = '';
    for (let i = 0; i < selections.length; i++) {
      // 100 is some magic number that I think will be able to render all options
      if (shownSelections.length * 100 < selectWidth) {
        // can show more
        shownSelections.push(selections[i]);
      } else {
        additionalSelectionCount = `...${selections.length - i} more`;
        additionalSelectionText = selections.slice(i, selections.length).join(', ');
        break;
      }
    }
    return (
      <Box>
        {shownSelections.map((item) => (
          <StyledChip variant="outlined" key={item} label={item} />
        ))}
        {additionalSelectionCount !== '' && (
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            title={additionalSelectionText}
            placement="right-start"
          >
            <Hyperlink>{additionalSelectionCount}</Hyperlink>
          </Tooltip>
        )}
      </Box>
    );
  }
  const selectionsSet = new Set(selections);
  return (
    <Select
      multiple
      fullWidth
      value={selections}
      onChange={onChangeHandler}
      disabled={disabled}
      renderValue={renderValue}
      inputProps={{
        'data-cy': dataCy,
      }}
      data-cy={`multiselect-${dataCy}`}
      MenuProps={{
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      }}
      classes={classes}
      ref={ref}
    >
      {options.map((opt) => (
        <MenuItem value={opt.id} key={opt.id} data-cy={`multioption-${opt.label}`}>
          <Checkbox checked={selectionsSet.has(opt.id)} color="primary" />
          <ListItemText primary={opt.label} />
        </MenuItem>
      ))}
    </Select>
  );
}

const StyledMultiSelect = withStyles(styles)(MultiSelectBase);
export default function MultiSelect(props) {
  return (
    <ThemeWrapper>
      <StyledMultiSelect {...props} />
    </ThemeWrapper>
  );
}

(MultiSelect as any).propTypes = WIDGET_PROPTYPES;
(MultiSelect as any).getWidgetAttributes = () => {
  return {
    options: { type: 'IOption[]|string[]', required: true },
    showSelectionCount: { type: 'boolean', required: false },
    delimiter: { type: 'string', required: false },
    // including additional property that was found from the docs
    default: { type: 'string', required: false },
  };
};
