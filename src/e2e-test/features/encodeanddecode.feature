@Integration_Tests
Feature: Encode and Decode functionality

@Encode_Decode
Scenario: Go through the encode functionality
  Given Navigate to Home Page of Wrangle
  Then Click on the Data Explorations card
  Then Verify if the Transformation Toolbar is displayed on the Grid Page
  Then Click on the Security icon
  Then Click on the encode
  Then Click on the encode base64
  Then Verify if the user is on the Add transformation step panel
  Then Click on the Select Column button
  Then Click on the radio button of any column
  Then Click on the Done button
  Then Click on the Apply Step button

  Scenario: Go through the encode functionality
    Given Navigate to Home Page of Wrangle
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the Security icon
    Then Click on the Decode
    Then Click on the decode base64
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column
    Then Click on the Done button
    Then Click on the Apply Step button
