@Integration_Tests
Feature: Snackbar - Checking all the Snack Bars Applying in the Wrangle Page

  @Snackbar
  Scenario: Check the Snackbar in the Wrangle Page
    Given Navigate to the Home Page
    Then Click on the Connector type
    Then Click on the first tab of second column
    Then Click on the first tab of third column
    When Hover&Click on the Wrangler
    Then Check the Successful Snackbar is displayed or not & Click o the close icon
    Then Click on the Home link in Wrangle Page
    Then Click on the Connector type
    Then Click on the first tab of second column
    Then Click on the second tab of third column
    When Hover&Click on the Wrangler pg_catalog
    Then Check the Failure Snackbar is displayed or not & Click o the close icon