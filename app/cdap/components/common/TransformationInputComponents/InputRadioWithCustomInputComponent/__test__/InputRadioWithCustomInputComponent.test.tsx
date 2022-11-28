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
import InputRadioWithCustomInputComponent from "components/common/TransformationInputComponents/InputRadioWithCustomInputComponent/index";

describe("Test InputRadioWithCustomInputComponent Component", () => {
  it("Should render the InputRadioWithCustomInputComponent Component and trigger the input component", () => {
    render(
      <InputRadioWithCustomInputComponent
        options={[]}
        radioValue={"Abhilash"}
        setRadioValue={jest.fn()}
        customInputType={"Abhilash"}
        customInput={""}
        setCustomInput={jest.fn()}
      />
    );

    const inputElement = screen.getByTestId(/custom-input/i)
    fireEvent.change(inputElement.firstChild, {target: {value: 'Abhilash'}})
    expect(inputElement.firstChild).toBeInTheDocument()

});
});
