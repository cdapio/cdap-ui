@Integration_Tests
Feature: Column Transform functions

  @ColumnTransform
  Scenario: Go through the copy column functionality
    Given Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the column icon
    Then Click on the copy column
    Then Verify if the user is on the Add transformation page
    Then Click on the Select Column button
    Then Click on the radio button of any column
    Then Click on the Done button
    Then Click on the value input field and enter new column name
    Then Click on the Apply step button

  Scenario: Go through the keep column functionality
    Given Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the column icon
    Then Click on the keep column
    Then Verify if the user is on the Add transformation page
    Then Click on the Select Column button
    Then Click on more than 2 checkbox button of any column
    Then Click on the Done button
    Then Click on the Apply step button

  Scenario: Go through the Delete column functionality
    Given Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the column icon
    Then Click on the Delete column
    Then Verify if the user is on the Add transformation page
    Then Click on the Select Column button
    Then Click on more than 1 or 2 checkbox button of any column
    Then Click on the Done button
    Then Click on the Apply step button