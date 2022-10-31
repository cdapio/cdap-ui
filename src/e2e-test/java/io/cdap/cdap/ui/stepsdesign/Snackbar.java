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
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.junit.Assert;
import java.util.List;
import org.openqa.selenium.By;
import java.lang.Thread;

public class Snackbar {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Connector type")
    public void clickOnConnection() throws InterruptedException{
        System.out.println("User navigated to data source page");
        WaitHelper.waitForPageToLoad();
        Thread.sleep(1000);
        String cssSelector = "div[data-testid*='connectionstabs-eachtab-0-0'] >";
        if(cssSelector.length() > 0) {
            System.out.println("cssSelector found" + cssSelector);
            ElementHelper.clickOnElement(Helper.locateElementByTestId("connectionstabs-eachtab-0-0"));
            String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/datasources/PostgreSQL");
            System.out.println("Clicked on Postgrl 1");
        }
        else {
            System.out.println("cssSelector not found" + cssSelector);
        }

        if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("connectionstabs-eachtab-0-0")))
        {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("connectionstabs-eachtab-0-0"));
            String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/datasources/PostgreSQL");
            System.out.println("Clicked on Postgrl");
        } else{
            System.out.println("Cant find the PostgreSQL element");
        }
    }
    @Then("Click on the first tab of second column")
    public void clickOnTheFirstTabOfSecondColumn() throws InterruptedException{
        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("connectionstabs-eachtab-0-0"));
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-button-ex2"));

        for(int i=1;i <2 ;i ++)
        {
            // WaitHelper.waitForPageToLoad(5000);
            Thread.sleep(1000);
            System.out.println("Checking for file or folder");
            if(Helper.isElementExists("connection-tabs-column-1")) {
                System.out.println("tab found in "+i+"-0");

                // iterates thru columns
                // for(int j=0;j<10;j++) {
                    // iterates thru rows in specific column, i
                    WebElement ele = Helper.locateElementByTestId("connectionstabs-eachtab-"+1+"-0");
                    System.out.println("tab found in "+i+"-0");

                    Actions action = new Actions(SeleniumDriver.getDriver());
                    WaitHelper.waitForPageToLoad();
                    action.moveToElement(ele).perform();
                    System.out.println("hovered on the tab");

                    if(Helper.isElementExists("connection-list-wrangle-link")){
                        System.out.println("wrangle icon is existing");

                        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-list-wrangle-link"));
                        System.out.println("clicked on wrangle icon");

                        if (Helper.isElementExists("snackbar-success-icon"))
                        {
                            WaitHelper.waitForPageToLoad();
                            ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-success-icon"));
                            System.out.println("inside snack bar success icon");
                        }
                        else {
                            ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-failure-icon"));
                            System.out.println("inside snack bar failure icon");
                        }
                        break;
                    }
                    else
                    {
                        ele.click();
                        System.out.println("clicked on the tab");
                    }
                //}
            }
            else {
                System.out.println("tab not found in "+i+"-0"+"->   connection-tabs-column-1");
            }
        }
    }
//    @Then("Click on the first tab of third column")
//    public void clickOnTheFirstTabOfThirdColumn() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-button-information_schema"));
//    }
////    @Then("Click on the first tab of fourth column")
////    public void clickOnTheFirstTabOfFourthColumn() {
////        WaitHelper.waitForPageToLoad();
////        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-tab-divami"));
////    }
////    @Then("Click on the first tab of fifth column")
////    public void clickOnTheFirstTabOfFifthColumn() {
////        WaitHelper.waitForPageToLoad();
////        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-tab-Desktop"));
////    }
//    @When("Hover&Click on the Wrangler of first file")
//    public void hoverAndClickOnTheWranglerFirstFile() {
//        WaitHelper.waitForPageToLoad();
//        WebElement ele = Helper.locateElementByTestId("connections-tab-label-simple");
//        Actions action = new Actions(SeleniumDriver.getDriver());
//        WaitHelper.waitForPageToLoad();
//        action.moveToElement(ele).perform();
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-list-wrangle-link"));
//    }
//    @Then("Check the Successful Snackbar is displayed or not & Click o the close icon")
//    public void checkTheSuccessfulSnackbar(){
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-success-icon"));
//    }
//    @Then ("Check user navigates to wrangle page")
//    public void verifyWranglePage() {
//        String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
//        Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/wrangler-grid/a59679fe-5a88-419d-aeaa-6dc2bcd84292");
//    }
//    @Then("check user navigate back to home page")
//    public void navigateBackToHomePage() {
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-link"));
//        String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
//        Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/home");
//
//    }
//    @Then("Click on the second tab of third column")
//    public void clickOnSecondTabOfThirdColumn(){
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-button-pg_catalog"));
//    }
//    @When("Hover&Click on the Wrangler next file")
//    public void hoverAndClickOnTheWranglerNextFile() {
//        WaitHelper.waitForPageToLoad();
//        WebElement ele = Helper.locateElementByTestId("connections-tab-button-pg_aggregate_fnoid_index");
//        Actions action = new Actions(SeleniumDriver.getDriver());
//        WaitHelper.waitForPageToLoad();
//        action.moveToElement(ele).perform();
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-list-wrangle-link"));
//    }
//    @Then("Check the Failure Snackbar is displayed or not & Click o the close icon")
//    public void checkTheFailureSnackbar(){
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-failure-icon"));
//    }
//    @Then("Click on the first tab of second column")
//            public void clickOnTheFirstTabOfSecondColumn(){
//        List<WebElement> myList=Helper.locateElementByTestId("accordion-toggle"));
//}
}
