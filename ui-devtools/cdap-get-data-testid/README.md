# [Chrome extension] cdap-get-data-testid
_Updated on: 30 January 2024_

## Why is it needed ?

Currently the cdap-ui codebase is tightly coupled with the e2e-tests codebases across the cdap ecosystem.
This is caused by a lack of clear and established contract between the test and application codebases.
Ideally, the application codebase should **always** provide `data-testid` attributes for UI elements
that need to be accessed by the test code. However, this is not followed consistently in case of cdap-ui.
Therefore, many times the test engineers have resorted to writing UI element locators in their test code 
using CSS selectors or similar xpath selectors. This method of locating UI elements is inherently dependent
on the DOM structure, making it difficult to make structural changes to the UI without breaking the tests.

To decouple the UI code and test code, we need to standardize the accepted methods of writing UI element
locators in test code (i.e. only accept test code which locate UI elements based on `data-testid`). But, as
in many cases, the UI elements do not have `data-testid` attributes, we also need to establish an easy
process of identifying such elements and communicating them to the UI engineers, so that the UI engineers
can add `data-testid` attributes on these elements in the UI code.

This chrome extension is provided here to 
1. make it easy for test engineers and UI engineers to find elements with `data-testid` attributes visually
2. make it easy for test engineers to communicate clearly (in a mostly automated process) the cases where the `data-testid` attributes are not present.
3. make it easy for the UI engineers to consume the communicated information about UI elements lacking the `data-testid` attributes, so that they can easily update the UI codebase to add the required attributes.

## How does it work ?

### Installation

1. Clone the cdap-ui repository (if not cloned already).
2. The chrome extension code is located in the directory `cdap-ui/ui-devtools/cdap-get-data-testid`. This directory will be referred as **extension root**.
3. Open a new chrome tab and go to the page `chrome://extensions/` .
4. At the top left of the chrome extensions page, click the **Load unpacked** button.
5. Select the **extension root** directory in the file dialog.
6. This should install the extension. Now you may want to pin the extension to the toolbar for easier access. (recommended)

### Usage

This section assumes that the extension has been installed and pinned to the chrome toolbar.

1. The extension is in disabled (OFF) mode initially. (Indicated by the OFF text on the extension icon)
2. Clicking the extension icon should open a popup with an **Enable** button.
3. Clicking the **Enable** button will modify the webpage, so that hovering on UI elements indicates if the `data-testid` attribute is present on the element or not.
4. If `data-testid` is present, the element is highlighted in green and the value of the `data-testid` attribute is displayed as a popover. Clicking such elements (green) copies the value of `data-testid` to clipboard.
5. If `data-testid` is not present, the element is highlighted in red. **Clicking such elements takes a screenshot of the page and copies the screenshot to the clipboard. It also opens an email (prefilled with details about the element). Please paste the copied screenshot (copied automatically) in the email body before sending it.**
6. The extension also allows you to configure the email address to which such emails will be sent.

## Contributing

Currently this extension is written in vanilla javascript and html using the chrome apis. The source code is 
in the **extension root** directory. We are not providing this extension as a packaged tool right now. 
Currently only the source distribution of this extension is maintained. Code contributions in form of PRs
are welcome. Please consider reporting any issues or feature requests as Github issues.
