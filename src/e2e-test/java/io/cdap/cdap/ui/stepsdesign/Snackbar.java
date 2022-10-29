package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class Snackbar {
   @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Connector type")
    public void clickOnTheConnectorType(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-File"));
    }
    @Then("Click on the first tab of second column")
    public void clickOnTheFirstTabOfSecondColumn() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-tab-ss"));
    }
    @Then("Click on the first tab of third column")
    public void clickOnTheFirstTabOfThirdColumn() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-tab-Users"));
    }
    @Then("Click on the first tab of fourth column")
    public void clickOnTheFirstTabOfFourthColumn() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-tab-divami"));
    }
    @Then("Click on the first tab of fifth column")
    public void clickOnTheFirstTabOfFifthColumn() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-tab-Desktop"));
    }
    @When("Hover&Click on the Wrangler of first file")
    public void hoverAndClickOnTheWranglerFirstFile() {
        WaitHelper.waitForPageToLoad();
        WebElement ele = Helper.locateElementByTestId("connection-tab-desktop.ini");
        Actions action = new Actions(SeleniumDriver.getDriver());
        WaitHelper.waitForPageToLoad();
        action.moveToElement(ele).perform();
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-list-wrangle-link"));
    }
    @Then("Check the Successful Snackbar is displayed or not & Click o the close icon")
    public void checkTheSuccessfulSnackbar(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-success-icon"));
    }
    @When("Hover&Click on the Wrangler next file")
    public void hoverAndClickOnTheWranglerNextFile() {
        WaitHelper.waitForPageToLoad();
        WebElement ele = Helper.locateElementByTestId("connection-tab-Eclipse Java");
        Actions action = new Actions(SeleniumDriver.getDriver());
        WaitHelper.waitForPageToLoad();
        action.moveToElement(ele).perform();
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-list-wrangle-link"));
    }
    @Then("Check the Failure Snackbar is displayed or not & Click o the close icon")
    public void checkTheFailureSnackbar(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-failure-icon"));
    }



}