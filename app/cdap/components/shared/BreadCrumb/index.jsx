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
import IconSVG from 'components/shared/IconSVG';
import { Link } from 'react-router-dom';
require('./BreadCrumb.scss');

export default function BreadCrumb({
  previousPaths,
  currentStateIcon,
  currentStateLabel,
}) {
  return (
    <div className="bread-crumb">
      {previousPaths.map((previousPath) => (
        <Link to={previousPath.pathname} key={previousPath.pathname}>
          {previousPath.label}
        </Link>
      ))}
      <IconSVG name={currentStateIcon} />
      <span>{currentStateLabel}</span>
    </div>
  );
}

BreadCrumb.propTypes = {
  previousPaths: PropTypes.arrayOf(
    PropTypes.shape({
      pathname: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  currentStateIcon: PropTypes.string,
  currentStateLabel: PropTypes.string,
};
