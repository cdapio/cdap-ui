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

import {
  calculateDistinctValues,
  calculateDistributionGraphData,
  calculateEmptyValueCount,
  characterCount,
  checkAlphaNumericAndSpaces,
  convertNonNullPercentForColumnSelected,
  getColumnNames,
} from "components/GridTable/utils";

describe("Testing Grid Table Utils", () => {
  const mockArray = [
    {
      feature_id: "X305",
      is_supported: "NO",
      comments: "",
      feature_name: "XMLTable: initializing an XQuery variable",
      sub_feature_id: "",
      sub_feature_name: "",
    },
    {
      feature_id: "    ",
      is_supported: "YES",
      comments: "",
      feature_name: "Name and identifier mapping",
      sub_feature_id: "",
      sub_feature_name: "",
    },
    {
      feature_id: "X410",
      is_supported: "YES",
      comments: "",
      feature_name: "Alter column data type: XML type",
      sub_feature_id: "",
      sub_feature_name: "",
    },
  ];
  it("Should test calculateDistinctValues function and should return expected output", () => {
    expect(calculateDistinctValues(mockArray, "feature_id")).toStrictEqual(3);
  });

  it("Should test characterCount function and should return expected output", () => {
    expect(characterCount(mockArray, "feature_id")).toStrictEqual({
      max: 4,
      min: 4,
    });
  });

  it("Should test getColumnNames function and should return expected output", () => {
    expect(getColumnNames(mockArray)).toStrictEqual([
      "feature_id",
      "is_supported",
      "comments",
      "feature_name",
      "sub_feature_id",
      "sub_feature_name",
    ]);
  });

  it("Should test calculateEmptyValueCount function and should return expected output", () => {
    expect(calculateEmptyValueCount(mockArray, "feature_id")).toStrictEqual(1);
  });

  it("Should test checkAlphaNumericAndSpaces function and should return expected output", () => {
    expect(checkAlphaNumericAndSpaces(mockArray, "feature_id")).toStrictEqual(
      "features.WranglerNewUI.GridTable.containsLetterNumberLeadingTrailingSpaces"
    );
  });

  it("Should test calculateDistributionGraphData function and should return expected output", () => {
    expect(
      calculateDistributionGraphData(mockArray, "feature_id")
    ).toStrictEqual([
      { text: "X305", value: 1 },
      { text: "    ", value: 1 },
      { text: "X410", value: 1 },
    ]);
  });

  it("Should test convertNonNullPercentForColumnSelected function and should return expected output", () => {
    expect(
      convertNonNullPercentForColumnSelected(mockArray, "feature_id")
    ).toStrictEqual("0");
  });
});
