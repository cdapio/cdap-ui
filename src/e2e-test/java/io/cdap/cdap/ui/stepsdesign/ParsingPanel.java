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


public class ParsingPanel {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Connector type card \\\"(.*)\\\"")
    public void clickOnTheConnectorTypeCard(String type) {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connector-type-" + type));
    }

    @Then("Click on the Wrangle button \\\"(.*)\\\" and \\\"(.*)\\\"")
    public void clickOnFirstTabOfTheSecondColumn2(int fTab, int fFile) {
        try {
            for (int i = 1; i <= 10; i++) {
                WebElement ele = Helper.locateElementByTestId("connection-tab-each-" + i + "0");
                try {
                    if(i == fTab){
                        JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
                        js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
                        Helper.locateElementByTestId("connection-tab-each-" + i + "12").click();
                        Helper.locateElementByTestId("connection-tab-each-" + fFile);
                        WebElement button = Helper.locateElementByTestId("connections-label-" + fFile);
                        System.out.println("label button found");
                        ElementHelper.hoverOverElement(button);
                        WebElement gridBtn = SeleniumDriver.getDriver().findElement(By.xpath
                      ("//button[@data-testid='load-to-grid-wrapper']//p[@data-testid='load-to-grid-button']"));
                        JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
                        executor.executeScript("arguments[0].click();", gridBtn);
                        System.out.println("wrangle clicked");
                        break;
                    }
                } catch (Exception e) {
                    System.err.println("error: " + e);
                }
                if (Helper.isElementExists("snackbar-alert")) {
                    ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
                    break;
                }

                else {
                    ele.click();
                    System.out.println("folder clicked");
                }
            }

        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Verify if grid page is displayed")
    public void parsingPanel() {
        try {
            boolean flag = true;
            while (flag == true) {
                flag = Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"));
            }
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            System.out.println(url);
            Assert.assertTrue(url.contains
                    ("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Click on the Checkboxes")
    public void clickOnTheCheckboxes() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-checkbox-Enable-quoted-values"));
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-checkbox-Use-first-row-as-header"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Click on the close button")
    public void clickOnTheCloseButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("drawer-widget-close-round-icon"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
    @Then("Verify if the Apply button is displayed")
    public void clickOnTheApplyButton() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("parsing-apply-button")));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
}


