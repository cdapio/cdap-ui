/*
 * Copyright © 2021 Cask Data, Inc.
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
import makeStyles from '@material-ui/core/styles/makeStyles';
import Heading, { HeadingTypes } from 'components/shared/Heading';

const useStyle = makeStyles((theme) => {
  return {
    center: {
      textAlign: 'center',
    },
    title: {
      color: theme.palette.grey[200],
      fontWeight: 'bold',
    },
  };
});

interface IMetricColumnProps {
  title: string;
  metric: number;
}

const MetricColumn: React.FC<IMetricColumnProps> = ({ title, metric }) => {
  const classes = useStyle();

  return (
    <div>
      <Heading
        type={HeadingTypes.h6}
        label={title.toUpperCase()}
        className={`${classes.center} ${classes.title}`}
      />
      <Heading type={HeadingTypes.h1} label={metric} className={classes.center} />
    </div>
  );
};

export default MetricColumn;
