@Integration_Tests
Feature: Snackbar

  @Snackbar
  Scenario: Check the Snackbar in the Wrangle Page
    Given Navigate to the Home Page
    Then Click on the data exploration card
    Then Click on the Snackbar close icon
