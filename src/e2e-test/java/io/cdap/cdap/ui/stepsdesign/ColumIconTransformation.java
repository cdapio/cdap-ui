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

import java.util.ArrayList;
import java.util.List;

public class ColumIconTransformation {

        @Given("Navigate to Home Page")
        public void navigateToTheHomePage() {
            SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
            WaitHelper.waitForPageToLoad();
        }

        @Then("Click on the Data Explorations card")
        public void clickOnTheDataExplorationCard() {
            try {
                WaitHelper.waitForPageToLoad();
//                ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-explore-card-link-1"));
                List<String> productName = new ArrayList<String>();
                List<WebElement> allProductsName = SeleniumDriver.getDriver().findElements(
                        By.xpath(".//*[@data-testid='wrangler-home-ongoing-data-exploration-card']"));
                ElementHelper.clickOnElement(allProductsName.get(1));
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

        @Then("Click on the column icon")
        public void clickOnTheStructureIcon() {
            try {
                WaitHelper.waitForPageToLoad();
                ElementHelper.clickOnElement(Helper.locateElementByTestId("toolbar-icon-button-Column"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Click on the copy column")
        public void clickOnTheCopyColumnOption() {
            try {
                WaitHelper.waitForPageToLoad();
                WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-label-copyColumn"));
                WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='toolbar-icon-label-copyColumn']"));
                JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
                executor.executeScript("arguments[0].click();", ele);
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }
    @Then("Click on the keep column")
    public void clickOnTheKeepColumnOption() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-label-keep"));
            WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='toolbar-icon-label-keep']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Delete column")
    public void clickOnTheDeleteColumnOption() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-label-delete"));
            WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='toolbar-icon-label-delete']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);

        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

        @Then("Verify if the user is on the Add transformation page")
        public void verifyIfTheUserIsOnTheAddTransformationPanel() {
            try {
                WaitHelper.waitForPageToLoad();
                Assert.assertTrue(ElementHelper.isElementDisplayed(
                        Helper.locateElementByTestId("form-input-new-column-name-input")));
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
                ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-0"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

    @Then("Click on more than 1 or 2 checkbox button of any column")
    public void clickOnTheCheckBoxesOfColumns() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("check-box-input-0"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("check-box-input-1"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on more than 2 checkbox button of any column")
    public void clickOnThreeCheckBoxesOfColumns() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("check-box-input-0"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("check-box-input-1"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("check-box-input-2"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("check-box-input-3"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

        @Then("Click on the Done button")
        public void clickOnTheDoneButton() {
            try {
                WaitHelper.waitForPageToLoad();
                WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='button_done']"));
                JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
                executor.executeScript("arguments[0].click();", ele);
//            ElementHelper.clickOnElement(Helper.locateElementByTestId("button_done"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Click on the value input field and enter new column name")
        public void clickOnTheValueInputField() {
            try {
                WaitHelper.waitForPageToLoad();
                JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
                js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
                WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("form-input-new-column-name-input"));
                WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='form-input-new-column-name-input']"));
                JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
                executor.executeScript("arguments[0].click();", ele);
                ele.sendKeys("newColumn");
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }


        @Then("Click on the Apply step button")
        public void clickOnTheApplyButton() {
            try {
                WaitHelper.waitForPageToLoad();
                ElementHelper.clickOnElement(Helper.locateElementByTestId("apply-step-button"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }
    }


