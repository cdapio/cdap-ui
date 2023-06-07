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
import RenderObjectAsTable from 'components/shared/RenderObjectAsTable';
import capitalize from 'lodash/capitalize';
import classnames from 'classnames';

require('./Genericdetails.scss');

export default function GenericDetails({ details, className }) {
  return (
    <div className={classnames(className, 'generic-details')}>
      {Object.keys(details)
        .filter(
          (detail) => ['name', 'url', 'version', 'logs'].indexOf(detail) === -1
        )
        .map((detail, i) => {
          return (
            <div key={i} data-testid={`generic-details-${detail}`}>
              <strong>{capitalize(detail)}</strong>
              <RenderObjectAsTable obj={details[detail]} />
            </div>
          );
        })}
    </div>
  );
}
GenericDetails.propTypes = {
  details: PropTypes.object,
  className: PropTypes.string,
};
