/*
 * Copyright © 2016 Cask Data, Inc.
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

import PropTypes from 'prop-types';

import React from 'react';
const classnames = require('classnames');
require('./SearchTextBox.scss');

export default function SearchTextBox({
  value,
  defaultValue,
  onChange,
  className,
  placeholder,
}) {
  return (
    <div className="cask-search-textbox">
      <i className="fa fa-search"></i>
      <input
        className={classnames('form-control', className)}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}
SearchTextBox.propTypes = {
  value: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};
