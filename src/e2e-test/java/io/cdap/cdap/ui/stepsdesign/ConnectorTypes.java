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
    @Then("Click on the connections available")
    public void clickOnConnections() {
        if (Helper.isElementExists("wrangle-card-Add Connection")) {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-Add Connection"));
            WaitHelper.waitForPageToLoad();
            String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/connections/create");
        }
        if (Helper.isElementExists("wrangle-card-PostgreSQL")) {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-PostgreSQL"));
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-link"));
        }
        if (Helper.isElementExists("wrangle-card-File")) {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-File"));
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-link"));
        }
    }
    @Then("Check import data is displayed by default or not")
    public void importDataByDefault() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
        if (Helper.isElementExists("wrangle-card-Import Data")) {
            String text = Helper.locateElementByTestId("wrangle-card-Import Data").getText();
            Assert.assertEquals(text, "Import Data");
        }
    }
}