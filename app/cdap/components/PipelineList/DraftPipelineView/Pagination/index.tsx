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
import { connect } from 'react-redux';
import { Actions } from 'components/PipelineList/DraftPipelineView/store';
import PaginationStepper from 'components/shared/PaginationStepper';
import styled from 'styled-components';

interface IPaginationProps {
  setPage: (page: number) => void;
  currentPage: number;
  numPipelines: number;
  pageLimit: number;
  shouldDisplay: boolean;
}

const PaginationContainer = styled.div`
  margin-right: 50px;
`;

const PaginationView: React.SFC<IPaginationProps> = ({
  setPage,
  currentPage,
  numPipelines,
  pageLimit,
  shouldDisplay = true,
}) => {
  const numPages = Math.ceil(numPipelines / pageLimit);

  if (!shouldDisplay || numPages <= 1) {
    return null;
  }

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === numPages;

  function handleNext() {
    if (nextDisabled) {
      return;
    }

    setPage(currentPage + 1);
  }

  function handlePrev() {
    if (prevDisabled) {
      return;
    }

    setPage(currentPage - 1);
  }

  return (
    <PaginationContainer className="pagination-container float-right">
      <PaginationStepper
        onNext={handleNext}
        onPrev={handlePrev}
        nextDisabled={nextDisabled}
        prevDisabled={prevDisabled}
      />
    </PaginationContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    currentPage: state.drafts.currentPage,
    numPipelines: state.drafts.list.length,
    pageLimit: state.drafts.pageLimit,
  };
};

const mapDispatch = (dispatch) => {
  return {
    setPage: (page) => {
      dispatch({
        type: Actions.setPage,
        payload: {
          currentPage: page,
        },
      });
    },
  };
};

const Pagination = connect(mapStateToProps, mapDispatch)(PaginationView);

export default Pagination;
