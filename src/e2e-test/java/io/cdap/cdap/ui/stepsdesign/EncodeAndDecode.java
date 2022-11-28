package io.cdap.cdap.ui.stepsdesign;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

public class EncodeAndDecode {

    @Given("Navigate to Home Page of Wrangle")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data Explorations card")
    public void clickOnTheDataExplorationCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if the Transformation Toolbar is displayed on the Grid Page")
    public void verifyIfTheTransformationToolbarIsDisplayedOnTheGridPage() {
        WaitHelper.waitForPageToLoad();
        try {
            boolean flag = true;
            while (flag == true) {
                if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            Assert.assertTrue(
                    Helper.isElementExists(Helper.getCssSelectorByDataTestId("transformations-toolbar-container")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Security icon")
    public void clickOnTheFragmentIcon() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("toolbar-icon-button-Security"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the encode")
    public void clickOnTheEncode() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-encode"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-encode']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Decode")
    public void clickOnTheDecode() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-decode"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-decode']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the encode base64")
    public void clickOnTheEncodeBase64() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-encode-base64"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-encode-base64']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the decode base64")
    public void clickOnTheDecodeBase64() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-decode-base64"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-decode-base64']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }


    @Then("Verify if the user is on the Add transformation step panel")
    public void verifyIfTheUserIsOnTheAddTransformationStepPanel() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed(
                    Helper.locateElementByTestId("add-transformation-drawer")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Select Column button")
    public void clickOnTheSelectColumnButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("select-column-button"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the radio button of any column")
    public void clickOnTheRadioButtonOfAnyColumn() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-2"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Done button")
    public void clickOnTheDoneButton() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("button_done"));
            WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='button_done']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Apply Step button")
    public void clickOnTheApplyButton() {
        try {
            WaitHelper.waitForPageToLoad();
            WebElement element = Helper.locateElementByTestId("apply-step-button");
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", element);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    }

