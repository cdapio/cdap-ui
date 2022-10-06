/*
 * Copyright © 2022 Cask Data, Inc.
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
import { useStyles } from '../styles';
import T from 'i18n-react';

export default function(props) {
  const { functionName } = props;
  const classes = useStyles();

  return (
    <section className={classes.functionSectionStyles}>
      <div className={classes.funtionSectionWrapperStyles}>
        <div className={classes.functionHeadingTextStyles}>
          {T.translate('features.WranglerNewAddTransformation.function')}
        </div>
        <img
          className={classes.greenCheckIconStyles}
          src="/cdap_assets/img/green-check.svg"
          alt="tick icon"
        />
      </div>
      <div className={classes.functionInfoSectionStyles}>
        <span className={classes.functionTextStyles}>{functionName}</span>
        <img className={classes.infoIconTextStyles} src="/cdap_assets/img/info.svg" alt="info" />
      </div>
    </section>
  );
}
