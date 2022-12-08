/*
 * Copyright © 2017 Cask Data, Inc.
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

import DataPrepStore from 'components/DataPrep/store';
import { MyArtifactApi } from 'api/artifact';
import MyDataPrepApi from 'api/dataprep';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';
import Version from 'services/VersionRange/Version';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import NamespaceStore from 'services/NamespaceStore';

export function directiveRequestBodyCreator(directivesArray) {
  return {
    directives: directivesArray,
    limit: 1000,
  };
}

export function isCustomOption(selectedOption) {
  return selectedOption.substr(0, 6) === 'CUSTOM';
}

export function setPopoverOffset(
  element,
  popoverLevel = 'second-level-popover'
) {
  const elem = element;
  const elemBounding = elem.getBoundingClientRect();

  const popover = document.getElementsByClassName(popoverLevel);
  const popoverHeight = popover[0].getBoundingClientRect().height;
  const tableContainerScroll = document.getElementById('dataprep-table-id')
    .scrollTop;
  const popoverMenuItemTop = elemBounding.top;
  const bodyBottom = document.body.getBoundingClientRect().bottom;
  const bodyTop = document.body.getBoundingClientRect().top;

  // FIXME: 5 is the magic number for aligning the bottom of the popover menu with the popover item.
  // We should fix the logic of showing the menu to not account in these magic numbers.
  // JIRA: CDAP-12468 to track this for a subsequent release.
  let diff =
    bodyBottom -
    (popoverMenuItemTop + popoverHeight) -
    tableContainerScroll +
    5;

  if (elemBounding.bottom > popover[0].getBoundingClientRect().bottom) {
    // This is to align the bottom of second level popover menu with that of the main menu
    // 1 offset is for the border bottom
    diff =
      diff +
      (elemBounding.bottom - popover[0].getBoundingClientRect().bottom) +
      1;
  }

  if (diff < 0) {
    // this is to make sure the top doesn't go off screen
    if (diff < -popoverMenuItemTop + bodyTop) {
      diff = -popoverMenuItemTop + bodyTop + 10; // pad 10px at the top so that popover isn't stuck at very top
    }
    popover[0].style.top = `${diff}px`;
  } else {
    popover[0].style.top = 0;
  }
}

export function checkDataPrepHigherVersion() {
  const namespace = NamespaceStore.getState().selectedNamespace;

  // Check artifacts upgrade
  MyArtifactApi.list({ namespace })
    .combineLatest(MyDataPrepApi.getApp())
    .subscribe((res) => {
      const wranglerArtifactVersions = res[0]
        .filter((artifact) => {
          return artifact.name === 'wrangler-service';
        })
        .map((artifact) => {
          return artifact.version;
        });

      const highestVersion = findHighestVersion(wranglerArtifactVersions);
      const currentAppArtifactVersion = new Version(res[1].artifact.version);

      if (highestVersion.compareTo(currentAppArtifactVersion) === 1) {
        DataPrepStore.dispatch({
          type: DataPrepActions.setHigherVersion,
          payload: {
            higherVersion: highestVersion.toString(),
          },
        });
      }
    });
}

export function columnNameAlreadyExists(colName) {
  const headers = DataPrepStore.getState().dataprep.headers;
  return headers.indexOf(colName) !== -1;
}
