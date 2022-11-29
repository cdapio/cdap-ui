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

import { render, screen } from "@testing-library/react";
import React from "react";
import DelimiterForExtract from "components/WranglerGrid/TransformationComponents/DelimiterForExtract/index";
import T from 'i18n-react';


describe("Testing DelimiterForExtractcomponent", () => {
    const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.extract';

  it("should test default render of DelimiterForExtract", () => {
    render(
      <DelimiterForExtract
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={undefined}
      />
    );
    const parentElement = screen.getByTestId(
      /delimiter-extract-parent-wrapper/i
    );
    expect(parentElement).toBeInTheDocument();

    const subHeadElement = screen.getByTestId(/delimiter-sub-head/i)
    expect(subHeadElement).toHaveTextContent(`${T.translate(`${PREFIX}.selectDelimiter`)}`)
  });
});
