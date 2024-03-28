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

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  return tab;
}

async function setActionTextAndColor(text, color, tabId) {
  await chrome.action.setBadgeText({
    tabId,
    text,
  });
  await chrome.action.setBadgeTextColor({
    tabId,
    color,
  });
}

async function getActivationStatus() {
  const tab = await getCurrentTab();
  const actionText = await chrome.action.getBadgeText({ tabId: tab.id });
  return actionText === 'ON';
}

async function activateAction(tabId) {
  await setActionTextAndColor('ON', 'green', tabId);
}

async function deactivateAction(tabId) {
  await setActionTextAndColor('OFF', 'black', tabId);
}

chrome.runtime.onInstalled.addListener(() => {
  setActionTextAndColor('OFF', 'black');
});

async function notifyStateChange(port) {
  const emailIds = await getConfiguredEmailIds();
  const popoverContentMode = await getPopoverContentMode();
  const active = await getActivationStatus();
  return port.postMessage({
    action: 'state_change',
    emailIds,
    active,
    popoverContentMode,
  });
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== 'cdap-get-data-testid') return;

  port.onMessage.addListener(async function(request) {
    const isActive = await getActivationStatus();
    switch (request.action) {
      case 'enable_testid_finder':
        await enableTestidFinder();
        await notifyStateChange(port);
        return;

      case 'disable_testid_finder':
        await disableTestidFinder();
        await notifyStateChange(port);
        return;

      case 'get_state':
        await notifyStateChange(port);
        return;

      case 'set_email_ids':
        await configureEmailIds(request.emailIds);
        await port.postMessage({ action: 'saved_emails' });
        return;

      case 'set_popover_content_mode':
        await configurePopoverContentMode(request.mode);
        if (isActive) {
          await disableTestidFinder();
          await enableTestidFinder();
        }
        await notifyStateChange(port);
        return;

      default:
        return;
    }
  });
});

async function enableTestidFinder() {
  const tab = await getCurrentTab();
  const emailIds = await getConfiguredEmailIds();
  const popoverContentMode = await getPopoverContentMode();
  chrome.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    func: modifyPage,
    args: [emailIds, popoverContentMode],
  });

  await activateAction(tab.id);
}

async function disableTestidFinder() {
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    func: unModifyPage,
  });

  await deactivateAction(tab.id);
}

function modifyPage(emailIds, popoverContentMode) {
  async function captureScreen () {
    const swidth = window.screen.width;
    const sheight = window.screen.height;
    const canvasId = "cdap-get-testid-screenshot-canvas";

    const wrapper = document.createElement('DIV');
    document.body.appendChild(wrapper);
    wrapper.innerHTML = `<canvas id="${canvasId}" width="${swidth}px" height="${sheight}px"/>`;
    const canvas = document.getElementById(canvasId);
    canvas.style.opacity = 0;
    const context = canvas.getContext("2d");

    const video = document.createElement("VIDEO");
    document.body.appendChild(video);
    video.autoplay = true;
    video.style.opacity = 0;

    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true });
      video.srcObject = captureStream;
      video.load();
      await new Promise((res) => video.addEventListener('loadeddata', res));

      context.drawImage(video, 0, 0, swidth, sheight);
      captureStream.getTracks().forEach(track => track.stop());

      await new Promise((resolve, reject) => {
        canvas.toBlob(async (png) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': png
              })
            ]);
            return resolve();
          } catch (err) {
            return reject(err);
          }
        });
      });

      document.body.removeChild(video);
      document.body.removeChild(wrapper);
      return true;
    } catch (err) {
      console.error("Error: " + err);
      return false;
    }
  }

  function isUniquelyIdentifiable (listOfTestids) {
    if (listOfTestids.length === 0) return false;

    const selector = listOfTestids.map(x => `[data-testid="${x}"]`).join(' ');
    return document.querySelectorAll(selector).length === 1;
  }

  function getUniqueXpath(el) {
    if (!el.dataset.testid) return '';
    const list = [];

    let cur = el;
    while (cur) {
      if (cur.dataset.testid) {
        list.unshift(cur.dataset.testid);
        if (isUniquelyIdentifiable(list)) {
          return list.map((x) => `//*[@data-testid="${x}"]`).join('');
        }
      }
      cur = cur.parentNode;
    }

    return '';
  }

  function getDOMPath(el) {
    const stack = [];
    while (el.parentNode !== null ) {
      const nodeName = el.nodeName;
      let siblingCount = 0;
      let siblingIndex = 0;
      for (let i=0; i<el.parentNode.childNodes.length; i++) {
        const sibling = el.parentNode.childNodes[i];
        if (sibling.nodeName == nodeName) {
          if (sibling === el) {
            siblingIndex = siblingCount;
          }
          siblingCount += 1;
        }
      }

      if (el.hasAttribute('id') && el.id !== '') {
        stack.unshift(`${nodeName.toLowerCase()}#${el.id}`);
      } else if (siblingCount > 1) {
        stack.unshift(`${nodeName.toLowerCase()}:eq(${siblingIndex})`);
      } else {
        stack.unshift(nodeName.toLowerCase());
      }

      el = el.parentNode;
    }

    return stack.slice(1).join(' > ');
  }

  function makeStyle(obj) {
    return Object.entries(obj).map(([key, val]) => `${key}:${val}`).join(';');
  }

  const info = document.createElement('DIV');
  info.style = makeStyle({
    position: 'fixed',
    background: 'white',
    color: 'black',
    display: 'none',
    width: 'fit-content',
    padding: '8px',
    border: '2px black dashed',
    fontWeight: 'bold',
  });
  document.body.appendChild(info);

  async function handleNodeClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const node = e.target;
    const popoverContent = popoverContentMode === 'xpath' ? getUniqueXpath(node) : node.dataset.testid;
    if (popoverContent) {
      await navigator.clipboard.writeText(popoverContent);
      info.innerText = `[COPIED] ${popoverContent}`;
      window.setTimeout(() => { info.innerText = popoverContent; }, 300);
      return;
    }

    node.dataset.cdapGetTestidClicked = true;
    const url = window.location.href;
    const path = getDOMPath(node);
    const emailIdList = emailIds.split(',').map(x => x.trim()).join(',');
    const subject = window.encodeURIComponent(`[cdap-ui-alert][e2e-tests] Missing data-testid`);
    const screenshotCaptured = await captureScreen();

    const body = window.encodeURIComponent(`
      Hi,

      The following ui element should have a data-testid.

      Page URL: ${url}
      Element path: ${path}
      Justification: [Add justification here]
      Suggested testid: [Suggest a data-testid here]


      Screenshot: [ Paste screenshot here ]
    `);

    delete node.dataset.cdapGetTestidClicked;
    unhighlightNode(node);
    window.open(`mailto:${emailIdList}?subject=${subject}&body=${body}`);
  }

  function onMouseOver(e) {
    const node = e.target;
    if (node.dataset.cdapGetTestidHovered) return;

    node.dataset.cdapGetTestidHovered = true;
    const popoverContent = popoverContentMode === 'xpath' ? getUniqueXpath(node) : node.dataset.testid;
    if (popoverContent) {
      info.style.top = `${Math.max(e.clientY - 20, 10)}px`;
      info.style.left = `${Math.min(e.clientX + 20, window.screen.width - 100)}px`;
      info.style.display = 'block';
      info.style.zIndex = 99999;
      info.innerText = popoverContent;
      highlightNode(node, 'rgba(153, 255, 102, 0.5)', 'green');
    } else {
      highlightNode(node, 'rgba(255, 153, 51, 0.5)', 'red');
    }

    node.addEventListener('click', handleNodeClick, true);
  }

  function onMouseOut(e) {
    const node = e.target;
    delete node.dataset.cdapGetTestidHovered;
    if (!node.dataset.cdapGetTestidClicked) {
      unhighlightNode(node);
    }
    node.removeEventListener('click', handleNodeClick, true);
    info.style.display = 'none';
    info.style.innerText = '';
  }

  function highlightNode(node, highlightColor, outlineColor) {
    const oldOutline = node.style.outline;
    const oldZindex = node.style.zIndex;
    const oldPosition = node.style.position;
    const oldBackground = node.style.background;

    if (!oldPosition) {
      node.style.position = 'relative';
    }
    node.style.outline = `1px ${outlineColor} solid`;
    node.style.zIndex = 99999;
    node.style.background = highlightColor;

    node.dataset.cdapGetTestidOldStyles = JSON.stringify({
      oldOutline,
      oldZindex,
      oldPosition,
      oldBackground,
    });
  }

  function unhighlightNode(node) {
    if (!node.dataset.cdapGetTestidOldStyles) return;

    const {
      oldOutline,
      oldPosition,
      oldZindex,
      oldBackground,
    } = JSON.parse(node.dataset.cdapGetTestidOldStyles);

    node.style.outline = oldOutline;
    node.style.position = oldPosition;
    node.style.zIndex = oldZindex;
    node.style.background = oldBackground;
    delete node.dataset.cdapGetTestidOldStyles;
  }

  document.body.addEventListener('mouseover', onMouseOver);
  document.body.addEventListener('mouseout', onMouseOut);

  window.__disableCdapGetDataTestIdExtension = function () {
    document.body.removeEventListener('mouseover', onMouseOver);
    document.body.removeEventListener('mouseout', onMouseOut);
    document.body.removeChild(info);
  }
}

function unModifyPage() {
  if (window.__disableCdapGetDataTestIdExtension) {
    window.__disableCdapGetDataTestIdExtension();
    delete window.__disableCdapGetDataTestIdExtension;
  }
}

async function getConfiguredEmailIds() {
  const result = await chrome.storage.local.get(['emailIds']);
  return result.emailIds || 'cdap-ui-eng@google.com';
}

function configureEmailIds(emailIds) {
  chrome.storage.local.set({ emailIds });
}

async function getPopoverContentMode() {
  const result = await chrome.storage.local.get(['popoverContentMode']);
  return result.popoverContentMode || 'xpath';
}

function configurePopoverContentMode(popoverContentMode) {
  chrome.storage.local.set({ popoverContentMode });
}
