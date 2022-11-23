package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cucumber.java.en.Given;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

public class CalculateTransformation {
    @Given("Navigate to the Home page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on ongoing exploration card")
            public void clickOngoingExplorationCard() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("wrangler-home-ongoing-data-exploration-card-iconWithText-0"));
        } catch (Exception e) {
            System.err.println("the error:" + e);
        }
    }
    @Then("Verify user is on grid page")
    public void verifyUserIsOnGridPage() {
        try {
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("the error:" + e);
        }
    }
    @Then("Click on Calculate option")
    public void clickOnCalculateOption() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("toolbar-icon-button-Math"));
            WaitHelper.waitForElementToBeEnabled(
                    Helper.locateElementByTestId("menu-item-button-algebra")
            );
            WebElement ele = Helper.locateElementByTestId("menu-item-button-algebra");
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
            WaitHelper.waitForElementToBeDisplayed(
                    Helper.locateElementByTestId("menu-item-button-ADD"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-button-ADD"));
            Assert.assertTrue(ElementHelper.isElementDisplayed
                    (Helper.locateElementByTestId("add-transformation-drawer")));
        } catch (Exception e) {
            System.err.println("the error:" + e);
        }
    }
    @Then("Select the column")
    public void selectTheColumn() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("select-column-button"));
            Assert.assertTrue(ElementHelper.isElementDisplayed
                    (Helper.locateElementByTestId("select-column-drawer")));
            SeleniumDriver.getDriver().manage().window().maximize();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-0"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("button_done"));
        } catch (Exception e) {
            System.err.println("the error:" + e);
        }
    }
    @Then("Enter the value in filed")
    public void enterTheValue() {
        try {
            WebElement ele = Helper.locateElementByTestId("calculate-input-value");
            ele.click();
            ele.sendKeys("2");
        } catch (Exception e) {
            System.err.println("the error:" + e);
        }
    }
    @Then("Click on Apply Button")
    public void clickOnApplyButton() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("apply-step-button"));
        } catch (Exception e) {
            System.err.println("the error:" + e);
        }
    }
}


