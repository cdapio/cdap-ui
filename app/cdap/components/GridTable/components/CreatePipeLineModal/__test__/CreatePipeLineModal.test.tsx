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
import CreatePipeLineModal from "components/GridTable/components/CreatePipeLineModal/index";
import T from "i18n-react";

describe("Test CreatePipeLineModal Component", () => {
  beforeEach(() => {
    render(<CreatePipeLineModal setOpenPipeline={jest.fn()} />);
  });

  it("Should have header title as expected", () => {
    const headerTitleElement = screen.getByTestId(
      /create-pipeline-header-title/i
    );
    expect(headerTitleElement).toHaveTextContent(
      `${T.translate("features.WranglerNewUI.CreatePipeline.labels.title")}`
    );
  });

  it("Should have sub-title as expected", () => {
    const subTitleElement = screen.getByTestId(
      /create-pipeline-label-sub-title/i
    );
    expect(subTitleElement).toHaveTextContent(
      `${T.translate("features.WranglerNewUI.CreatePipeline.labels.subTitle")}`
    );
  });

  it("Should have label as expected", () => {
    const labelElement = screen.getByTestId(/create-pipeline-batch-pipeline/i);
    expect(labelElement).toHaveTextContent(
      `${T.translate(
        "features.WranglerNewUI.CreatePipeline.labels.batchPipeline"
      )}`
    );
  });

  it("Should have text as expected", () => {
    const textElement = screen.getByTestId(/create-pipeline-realTimePipeline/i);
    expect(textElement).toHaveTextContent(
      `${T.translate(
        "features.WranglerNewUI.CreatePipeline.labels.realTimePipeline"
      )}`
    );
  });

  it("Should trigger generateLinks function ", () => {
    const batchElement = screen.getAllByTestId(/create-pipeline-batch/i);
    fireEvent.click(batchElement[0]);
    expect(batchElement[0]).not.toBeInTheDocument();
  });

  it("Should trigger handle close function", () => {
    const closeIconElement = screen.getByTestId(/create-pipeline-close-icon/i);
    fireEvent.click(closeIconElement);
    expect(closeIconElement).toBeInTheDocument();
  });
});
