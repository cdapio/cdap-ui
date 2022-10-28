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
        ElementHelper.clickOnElement(Helper.locateElementByTestId("item3"));
    }
    @Then("Click on the first tab of second column")
    public void clickOnTheFirstTabOfSecondColumn() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-button-EXL"));
    }
    @Then("Click on the first tab of third column")
    public void clickOnTheFirstTabOfThirdColumn() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-button-information_schema"));
    }
    @When("Hover&Click on the Wrangler")
    public void hoverAndClickOnTheWrangler() {
        WaitHelper.waitForPageToLoad();
        WebElement ele = Helper.locateElementByTestId("connections-tab-button-sql_features");
        Actions action = new Actions(SeleniumDriver.getDriver());
        WaitHelper.waitForPageToLoad();
        action.moveToElement(ele).perform();
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-explore"));
    }
    @Then("Check the Successful Snackbar is displayed or not & Click o the close icon")
    public void checkTheSuccessfulSnackbar(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
    }
    @Then("Click on the Home link in Wrangle Page")
    public void clickOnTheHomeLinkInWranglePage(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-text"));
    }
    @Then("Click on the second tab of third column")
    public void clickOnTheSecondTabOfTheThirdColumn(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-button-pg_catalog"));
    }
    @When("Hover&Click on the Wrangler pg_catalog")
    public void hoverAndClickOnTheWranglerPg_Catalog() {
        WaitHelper.waitForPageToLoad();
        WebElement ele = Helper.locateElementByTestId("connections-tab-button-pg_aggregate_fnoid_index");
        Actions action = new Actions(SeleniumDriver.getDriver());
        WaitHelper.waitForPageToLoad();
        action.moveToElement(ele).perform();
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-ref-explore"));
    }
    @Then("Check the Failure Snackbar is displayed or not & Click o the close icon")
    public void checkTheFailureSnackbar(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
    }
}