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

import * as React from 'react';

import { IPluginProperty, IWidgetProperty } from 'components/shared/ConfigurationGroup/types';
import withStyles, { StyleRules, WithStyles } from '@material-ui/core/styles/withStyles';

import AbstractWidget from 'components/AbstractWidget';
import DescriptionTooltip from 'components/shared/ConfigurationGroup/PropertyRow/DescriptionTooltip';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import PropTypes from 'prop-types';
import ThemeWrapper from 'components/ThemeWrapper';
import classnames from 'classnames';
import { objectQuery } from 'services/helpers';

const styles = (theme): StyleRules => {
  return {
    widgetWrapper: {
      border: '1px solid',
      borderColor: theme.palette.grey[300],
      borderRadius: '6px',
      position: 'relative',
      padding: '7px 10px 5px',
    },
    errorBorder: {
      border: '2px solid',
      borderColor: theme.palette.red[50],
    },
    noWrapper: {
      border: 0,
      padding: 0,
    },
    label: {
      fontSize: '12px',
      position: 'absolute',
      top: '-10px',
      left: '15px',
      padding: '0 5px',
      backgroundColor: theme.palette.white[50],
    },
    required: {
      fontSize: '14px',
      marginLeft: '5px',
      lineHeight: '12px',
      verticalAlign: 'middle',
    },
    widgetContainer: {
      width: 'calc(100% - 30px)',
    },
    tooltipContainer: {
      position: 'absolute',
      right: '5px',
      top: '10px',
    },
    focus: {
      borderColor: theme.palette.blue[200],
      '& $label': {
        color: theme.palette.blue[100],
      },
    },
    large: {
      width: '100%',
    },
    medium: {
      width: '300px',
    },
    small: {
      width: '200px',
    },
  };
};

export enum Size {
  Large = 'large',
  Small = 'small',
  Medium = 'medium',
}

interface IWidgetWrapperProps extends WithStyles<typeof styles> {
  widgetProperty: IWidgetProperty;
  pluginProperty?: IPluginProperty;
  value: string;
  onChange: (value: string) => void;
  updateAllProperties?: (values) => void;
  extraConfig?: any;
  disabled?: boolean;
  hideDescription?: boolean;
  errors?: IErrorObj[];
  size?: Size;
  hideLabel?: boolean;
}

const WidgetWrapperView: React.FC<IWidgetWrapperProps> = ({
  widgetProperty,
  pluginProperty = {},
  value,
  onChange,
  updateAllProperties,
  extraConfig,
  disabled,
  hideDescription = false,
  classes,
  errors,
  size = 'large',
  hideLabel = false,
}) => {
  const widgetType = objectQuery(widgetProperty, 'widget-type');
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  function onFocus() {
    setIsFocused(true);
  }

  function onBlur() {
    setIsFocused(false);
  }

  const hideWrapper = !!objectQuery(widgetProperty, 'widget-category');

  return (
    <div
      className={classnames(classes.widgetWrapper, {
        [classes.focus]: isFocused && !disabled,
        [classes.noWrapper]: hideWrapper,
        [classes.errorBorder]: errors && Boolean(errors.length),
        [classes[size]]: size,
      })}
      onFocus={onFocus}
      onBlur={onBlur}
      data-cy="widget-wrapper-container"
      data-testid="widget-wrapper-container"
    >
      {!hideWrapper && !hideLabel && (
        <div className={`widget-wrapper-label ${classes.label}`}>
          {widgetProperty.label}
          {pluginProperty.required && <span className={classes.required}>*</span>}
        </div>
      )}
      <div className={classes.widgetContainer}>
        <AbstractWidget
          type={widgetType}
          value={value}
          onChange={onChange}
          updateAllProperties={updateAllProperties}
          widgetProps={widgetProperty['widget-attributes']}
          extraConfig={extraConfig}
          disabled={disabled}
          errors={errors}
          dataCy={pluginProperty.name}
          dataTestId={pluginProperty.name}
        />
      </div>
      {!hideDescription && !hideWrapper && (
        <div className={classes.tooltipContainer}>
          <DescriptionTooltip description={pluginProperty.description} />
        </div>
      )}
    </div>
  );
};

const WidgetWrapper = withStyles(styles)(WidgetWrapperView);
export default WidgetWrapper;

export function WrappedWidgetWrapper(props) {
  return (
    <ThemeWrapper>
      <WidgetWrapper {...props} />
    </ThemeWrapper>
  );
}

(WrappedWidgetWrapper as any).propTypes = {
  widgetProperty: PropTypes.object,
  pluginProperty: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  extraConfig: PropTypes.object,
  disabled: PropTypes.bool,
  hideDescription: PropTypes.bool,
};
