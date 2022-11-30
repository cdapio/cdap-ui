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
import T from 'i18n-react';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import {
  StyledMenuItem,
  WorkspaceListTypography,
} from 'components/OpenWorkspacesList/StyledComponents';
import { createRef, Ref, useEffect, useState } from 'react';
import { IWorkspaceList } from 'components/OpenWorkspacesList';

interface IOngoingWorkspaceListMenuProps {
  workspace: IWorkspaceList;
  index: number;
  handleMenuClick: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    currentWorkspaceId: string
  ) => void;
}

export default function({ workspace, index, handleMenuClick }: IOngoingWorkspaceListMenuProps) {
  const myLabelRef: Ref<HTMLSpanElement> = createRef();
  const [refValue, setRefValue] = useState(false);

  useEffect(() => {
    /**
     * In case, the size of the lable or file name exceeds the maximum width
     * of it's wrapping container we are showing ellipses using styles and
     * we are also showing the custom tooltip using the following logic.
     * So the following statement checks whether the size of the text is greater than the maximum
     * width of the wrapping element or not. if the size is greater then it sets true for custom tooltip
     * otherwise it sets false.
     */
    setRefValue(myLabelRef?.current?.offsetWidth < myLabelRef?.current?.scrollWidth);
  }, []);

  return (
    <>
      {refValue ? (
        <CustomTooltip title={`${workspace.workspaceName}`}>
          <StyledMenuItem
            role="button"
            onClick={(e) => handleMenuClick(e, workspace.workspaceId)}
            key={index}
            data-testid={`open-workspace-list-item-${index}`}
          >
            <WorkspaceListTypography ref={myLabelRef}>
              {T.translate(workspace.workspaceName)}
            </WorkspaceListTypography>
          </StyledMenuItem>
        </CustomTooltip>
      ) : (
        <StyledMenuItem
          role="button"
          onClick={(e) => handleMenuClick(e, workspace.workspaceId)}
          key={index}
          data-testid={`open-workspace-list-item-${index}`}
        >
          <WorkspaceListTypography ref={myLabelRef} data-testid="workspace-name">
            {T.translate(workspace.workspaceName)}
          </WorkspaceListTypography>
        </StyledMenuItem>
      )}
    </>
  );
}
