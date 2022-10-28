package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;

public class ConnectorTypes {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the View all option")
    public void clickOnTheViewAllOption() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("connector-types-view-all"));
    }
    @Then("Click on the Home link")
    public void  clickOnTheHomeLink(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("breadcrumb-home-link"));
    }
    @Then("Click on the Connector type card")
    public void clickOnTheConnectorTypeCard() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("item2"));
    }
    @Then("Click on the Home link in Data Sources page")
    public void clickOnTheHomeLinkInDataSourcesPage() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("breadcrumb-home-link"));
    }
    @Then("Click on the Exploration card")
    public void clickOnTheExplorationCard(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card"));
    }
    @Then("Click on the Home link on wrangle page")
    public void clickOnTheHomeLinkOnWranglePage(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("breadcrumb-home-text"));
    }
}