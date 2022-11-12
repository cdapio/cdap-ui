package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class ImportSchema {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Connector type card")
    public void clickOnTheConnectorTypeCard() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("file-connector-type"));
    }

    @Then("Click on the wrangle button")
    public void clickOnFirstTabOfTheSecondColumn() {
        boolean flag = true;
        try {
            for (int i = 1; flag != false; i++) {
                if (ElementHelper.isElementDisplayed(Helper.locateElementByTestId("connection-tab-" + i + "0"))) {
                    System.out.println("element found");
                    WebElement ele = Helper.locateElementByTestId("connection-tab-" + i + "0");

                    Actions action = new Actions(SeleniumDriver.getDriver());
                    action.moveToElement(ele).perform();
                    if (Helper.isElementExists("connections-tab-explore")) {
                        ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-text"));
                        System.out.println("wrangle clicked");
                        if (Helper.isElementExists("snackbar-alert")) {
                            ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
                            break;
                        }
                        break;
                    } else {
                        ele.click();
                        flag = true;
                        System.out.println("folder clicked");
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
//
        @Then("Click on the Import Schema button & Upload file")
        public void clickOnTheImportSchemaButtonAndUploadFile () {
            WaitHelper.waitForPageToLoad();
            WebElement ele = Helper.locateElementByTestId("import-schema-text");
            ele.click();
            String file = "/Users/divami/Downloads/f2b01a87-fd9a-4af2-bcb1-c02a35f07d08-schema.json";
            ele.sendKeys(file);
        }
        @Then("Click on the Apply button")
        public void clickOnTheApplyButton () {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-apply-button"));
        }
//        @Then("Check if the Snackbar is displayed")
//        public void checkIfTheSnackbarIsDisplayed () {
//            WaitHelper.waitForPageToLoad();
//            ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
//        }
//        @Then("Verify if the toast message is displayed")
//        public void verifyIfTheToastMessageIsDisplayed () {
//            WaitHelper.waitForPageToLoad();
//            ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
//        }
        @Then("Click on the Cross icon")
        public void clickOnTheCrossIcon () {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("drawer-widget-close-round-icon"));
        }
//        @Then("Verify if the User is on grid table page")
//        public void verifyIfTheUserIsOnTheGridTablePage () {
//            WaitHelper.waitForPageToLoad();
//            ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
//        }
    }

