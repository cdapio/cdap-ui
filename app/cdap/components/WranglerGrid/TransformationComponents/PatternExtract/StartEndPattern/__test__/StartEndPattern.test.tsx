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
import StartEndPattern from "components/WranglerGrid/TransformationComponents/PatternExtract/StartEndPattern/index";

describe("Testing StartEndPattern component", () => {

    beforeEach(() => {
        render(
            <StartEndPattern
              setStartValue={jest.fn()}
              setEndValue={jest.fn()}
              endValue={undefined}
              startValue={undefined}
            />
          );
    })
  it("should test default render of StartEndPattern and type in start value", () => {

    const startInputElement = screen.getByTestId(/custom-input-start-value/i)
    expect(startInputElement).toBeInTheDocument()
    fireEvent.change(startInputElement, {target: {value: 'apple'}})
    expect(startInputElement).toHaveValue('apple')
  });

  it("should test default render of StartEndPattern and type in end value", () => {

    const startInputElement = screen.getByTestId(/custom-input-end-value/i)
    expect(startInputElement).toBeInTheDocument()
    fireEvent.change(startInputElement, {target: {value: 'apple'}})
    expect(startInputElement).toHaveValue('apple')
  });
});
