@Integration_Tests
Feature: ImportSchema

  @ADMIN_TEST
 Scenario: Go through the Import Schema functionality
    Given Navigate to the Home Page
    Then Click on the Connector type card
    Then Click on the wrangle button
    Then Click on the Import Schema button & Upload file
#    Then Click on the Apply button
#    Then Check if the Snackbar is displayed
#    Then Verify if the toast message is displayed
   Then Click on the Cross icon
#    Then Verify if the User is on grid table page
