/*
 * Copyright © 2024 Cask Data, Inc.
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

const enableBtn = document.getElementById("enable_button");
const saveBtn = document.getElementById("save_button");
const emailInput = document.getElementById("email_input");
const dataTestidRadio = document.getElementById("data_testid_radio");
const xpathRadio = document.getElementById("xpath_radio");

(async () => {
  const port = chrome.runtime.connect({ name: "cdap-get-data-testid" });
  port.postMessage({ action: 'get_state' });

  function savePopoverContentMode(mode) {
    port.postMessage({ action: 'set_popover_content_mode', mode });
  }

  xpathRadio.addEventListener('change', function (e) {
    const isChecked = xpathRadio.checked;
    if (isChecked) savePopoverContentMode('xpath');
  });

  dataTestidRadio.addEventListener('change', function (e) {
    const isChecked = dataTestidRadio.checked;
    if (isChecked) savePopoverContentMode('data_testid');
  });

  saveBtn.addEventListener('click', async function() {
    const emailIds = emailInput.value;
    port.postMessage({ action: "set_email_ids", emailIds });
  });

  enableBtn.addEventListener('click', async function() {
    port.postMessage({ action: enableBtn.innerText === 'Enable'
      ? 'enable_testid_finder' : 'disable_testid_finder' });
    window.close();
  });

  port.onMessage.addListener(function(msg) {
    switch (msg.action) {
      case 'state_change':
        updateUiState(msg.active, msg.emailIds, msg.popoverContentMode);
        return;

      case 'saved_emails':
        blinkSaved();
        return;

      default:
        return;
    }
  });
})();


function updateUiState(active, emailIds, popoverContentMode) {
  if (active) {
    enableBtn.innerText = 'Disable';
    enableBtn.style.background = 'red';
  } else {
    enableBtn.innerText = 'Enable';
    enableBtn.style.background = 'green';
  }

  emailInput.value = emailIds;

  if (popoverContentMode === 'xpath') {
    xpathRadio.checked = true;
  } else {
    dataTestidRadio.checked = true;
  }
}

function blinkSaved() {
  saveBtn.innerText = 'Saved';
  window.setTimeout(() => saveBtn.innerText = 'Save', 500);
}
