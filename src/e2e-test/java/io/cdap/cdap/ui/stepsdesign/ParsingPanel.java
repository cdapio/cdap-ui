package io.cdap.cdap.ui.stepsdesign;

import com.google.cloud.FieldSelector;
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

//    @Then("Click on the Wrangle button2")
//    public void clickOnFirstTabOfTheSecondColumn() {
//        try {
//            boolean flag = true;
//            while (flag == true) {
//                flag = Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"));
//            }
//            for (int i = 1; i <= 10; i++) {
//                while (flag == true) {
//                    flag = Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"));
//                }
//                if(Helper.isElementExists("connections-label-" + i + "0")) {
//                    WebElement eachTab = Helper.locateElementByTestId("connection-tab-each-" + i + "0");
//                    ElementHelper.hoverOverElement(eachTab);
//                    if (Helper.isElementExists("load-to-grid-wrapper")) {
//                        WebElement wrangleButton = Helper.locateElementByTestId("load-to-grid-wrapper");
//                        ElementHelper.clickOnElement(wrangleButton);
//                        System.out.println("clicked on wrangle button wrapper");
//                        i = 11;
//                    }
//                    else {
//                        eachTab.click();
//                        System.out.println("clicked on connection-tab-each-" + i + "0");
//                    }
//                }
////                if(Helper.isElementExists("connections-label-" + i + "0")){
////                    WebElement button = Helper.locateElementByTestId("connections-label-" + i + "0");
////                    System.out.println("found the element connection-tab-each-" + i + "0");
////                    System.out.println("found the element tab-label-can-sample-" + i + "0");
////                    ElementHelper.hoverOverElement(button);
////                    if (Helper.isElementExists("load-to-grid-wrapper")) {
////                        WebElement wrangleButton = Helper.locateElementByTestId("load-to-grid-wrapper");
////                        ElementHelper.clickOnElement(wrangleButton);
////                        System.out.println("clicked on wrangle button wrapper");
////                        i = 11;
////                    }
//
//
//            }
//            } catch(Exception e){
//                System.err.println("error: " + e);
//            }
//        }


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
//                     WaitHelper.waitForElementToBePresent(By.cssSelector("load-to-grid-wrapper"));
                        WebElement gridBtn = SeleniumDriver.getDriver().findElement(By.xpath
                                ("//button[@data-testid='load-to-grid-wrapper']//p[@data-testid='load-to-grid-button']"));
//                     ElementHelper.hoverOverElement(gridBtn);
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

    @Then("Verify if parsing panel is displayed")
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
//        Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByCssSelector("presentation")));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Click on the Checkboxes")
    public void clickOnTheCheckboxes() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-checkbox-Enable quoted values"));
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-checkbox-Use first row as header"));
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
    @Then("Click on the Apply button")
    public void clickOnTheApplyButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-apply-button"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
}


