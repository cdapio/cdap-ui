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

import React from 'react';
import { connect } from 'react-redux';
import T from 'i18n-react';
import classnames from 'classnames';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { setSort } from 'components/RecipeList/store/ActionCreator';
import { SortOrder } from './types';

const PREFIX = 'features.WranglerNewUI.Recipe';

interface ISortableHeaderProps {
  sortColumn: string;
  sortOrder: SortOrder;
  columnName: string;
  disabled: boolean;
  setSort: (columnName: string) => void;
}

const SortableHeaderView: React.SFC<ISortableHeaderProps> = ({
  sortColumn,
  sortOrder,
  columnName,
  disabled,
  setSort,
}) => {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    setSort(columnName);
  };

  return (
    <strong
      className={classnames({ sortable: !disabled })}
      onClick={handleClick}
      data-testid={`recipelist-${columnName}`}
    >
      {T.translate(`${PREFIX}.${columnName}`)}

      {sortColumn === columnName &&
        (sortOrder === SortOrder.ASCENDING ? (
          <ArrowUpwardIcon></ArrowUpwardIcon>
        ) : (
          <ArrowDownwardIcon></ArrowDownwardIcon>
        ))}
    </strong>
  );
};

const mapStateToProps = (state, ownProp) => {
  return {
    sortColumn: state.recipeList.sortColumn,
    sortOrder: state.recipeList.sortedOrder,
    columnName: ownProp.columnName,
  };
};

const mapDispatch = () => {
  return {
    setSort,
  };
};

const SortableHeader = connect(mapStateToProps, mapDispatch)(SortableHeaderView);

export default SortableHeader;
