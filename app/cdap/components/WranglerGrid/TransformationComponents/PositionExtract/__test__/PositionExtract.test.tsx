/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import PositionExtract from "components/WranglerGrid/TransformationComponents/PositionExtract/index";
import T from 'i18n-react';

describe("Testing PositionExtract component", () => {
    const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.extract.extractUsingPosition';

  beforeEach(() => {
    render(
      <PositionExtract
        anchorEl={null}
        setAnchorEl={jest.fn()}
        textSelectionRange={1}
        columnSelected={undefined}
        applyTransformation={jest.fn()}
        headers={["apple"]}
        open={true}
        handleClose={jest.fn()}
      />
    );
  });
  it("should test default render of PositionExtract ", () => {
    const parentWrapper = screen.getByTestId(/position-extract-wrapper/i);
    expect(parentWrapper).toBeInTheDocument();
  });

  it("should test default render of PositionExtract and trigger applyMaskTransformation ", () => {
    const buttonElement = screen.getByTestId(/apply-mask-button/i);
    fireEvent.click(buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(`${T.translate(`${PREFIX}.applyMask`)}`)
  });

  it("should test default render of PositionExtract and trigger onChange on input", () => {
    const ele = screen.getAllByTestId(/new-column-name-input/i);
    expect(ele[0]).toBeInTheDocument();
    fireEvent.change(ele[0], { target: { value: "apple" } });
    expect(ele[0]).toHaveValue("apple");
  });

  it('should show head font text as expected', () => {
    const headFontElement = screen.getByTestId(/position-extract-head-font/i);
    expect(headFontElement).toHaveTextContent(`${T.translate(`${PREFIX}.extractPosition`)}`)
  })
});
