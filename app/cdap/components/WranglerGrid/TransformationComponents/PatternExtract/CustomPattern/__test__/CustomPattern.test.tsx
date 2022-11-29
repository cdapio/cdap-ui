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
import CustomPattern from "components/WranglerGrid/TransformationComponents/PatternExtract/CustomPattern/index";

describe("Testing CustomPattern component", () => {
  it("should test default render of CustomPattern", () => {
    render(
      <CustomPattern customInput={undefined} setCustomInput={jest.fn()} />
    );

    const parentWrapperElement = screen.getByTestId(/custom-pattern-wrapper/i)
    expect(parentWrapperElement).toBeInTheDocument()

    const inputElement = screen.getByTestId(/custom-input-regex/i)
    expect(inputElement).toBeInTheDocument()
    fireEvent.change(inputElement, {target:{value: 'apple'}})
    expect(inputElement).toHaveValue('apple')
  });
});
