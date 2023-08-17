/*
 * Copyright © 2017 Cask Data, Inc.
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
import classnames from 'classnames';
require('./IconSVG.scss');
require('../../../styles/fonts/symbol-defs.svg');
require('../../../styles/fonts/symbol-defs_new.svg');

export default function IconSVG(props) {
  const { name, className, dataCy, dataTestId, tooltip, ...moreProps } = props;
  const iconClassName = classnames('icon-svg', name, className);
  const path = `${window.location.href}#symbol-defs_${name}`;
  const newPath = `${window.location.href}#symbol-defs_new_${name}`;
  return (
    <svg
      className={iconClassName}
      data-cy={dataCy}
      data-testid={dataTestId}
      {...moreProps}
    >
      <use xlinkHref={path} />
      <use xlinkHref={newPath} />
      {tooltip && <title>{tooltip}</title>}
    </svg>
  );
}

IconSVG.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  dataCy: PropTypes.string,
  dataTestId: PropTypes.string,
  tooltip: PropTypes.string,
};
