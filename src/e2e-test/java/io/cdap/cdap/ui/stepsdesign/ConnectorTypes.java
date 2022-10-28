package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ConnectorTypes {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Connector card")
    public void clickOnTheConnectorTypeCard() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("wrangle-card-File"));
    }
    @Then("verify user is on datasource page or not")
    public void verifyDataSourcePage() {
        WaitHelper.waitForPageToLoad();
        String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
        Assert.assertEquals(ActualText,"http://localhost:11011/cdap/ns/default/datasources/File");
    }
    @Then("Click on the Home link in Data Sources page")
    public void clickOnTheHomeLinkInDataSourcesPage() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(
                Helper.locateElementByTestId("breadcrumb-home-link"));
    }

}