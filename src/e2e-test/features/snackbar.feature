@Integration_Tests
Feature: Snackbar - Checking all the Snack Bars Applying in the Wrangle Page

  @Snackbar
  Scenario: Check the Snackbar in the Wrangle Page
  Given Navigate to the Home Page
    Then Click on the Connector type
    Then Click on the first tab of second column
    Then Click on the first tab of third column
    Then Click on the first tab of fourth column
    Then Click on the first tab of fifth column
    When Hover&Click on the Wrangler of first file
    Then Check the Failure Snackbar is displayed or not & Click o the close icon
    When Hover&Click on the Wrangler next file
    Then Check the Successful Snackbar is displayed or not & Click o the close icon
