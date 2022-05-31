/*
 * Copyright © 2018 Cask Data, Inc.
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

import React from 'react';
import PropTypes from 'prop-types';
import LoadingSVG from 'components/shared/LoadingSVG';
import classnames from 'classnames';
require('./BtnWithLoading.scss');

export default function BtnWithLoading({
  className,
  darker = false,
  label,
  loading,
  disabled,
  onClick,
  dataCy = null,
  dataTestId = null,
  ...restProps
}) {
  return (
    <button
      className={classnames(`btn btn-with-loading`, className, {
        'darker-loading-bars': darker,
      })}
      onClick={onClick}
      disabled={disabled || loading}
      data-cy={dataCy}
      data-testid={dataTestId}
      {...restProps}
    >
      {!loading ? (
        label
      ) : (
        <div>
          <LoadingSVG />
          {label}
        </div>
      )}
    </button>
  );
}

BtnWithLoading.propTypes = {
  darker: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  dataCy: PropTypes.string,
  dataTestId: PropTypes.string,
};
