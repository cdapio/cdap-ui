package io.cdap.cdap.ui.stepsdesign;

import com.google.cloud.FieldSelector;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ParsingPanel {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Connector type card")
    public void clickOnTheConnectorTypeCard() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connector-type-File"));
    }

    @Then("Click on the Wrangle button2")
    public void clickOnFirstTabOfTheSecondColumn() {
        try {
            for (int i = 1; i <= 10; i++) {


                WebElement eachTab = Helper.locateElementByTestId("connection-tab-each-" + i + "0");
                ElementHelper.hoverOverElement(eachTab);
                if (Helper.isElementExists("load-to-grid-wrapper", eachTab)) {
                    WebElement wrangleButton = Helper.locateElementByTestId("load-to-grid-wrapper");
                    ElementHelper.clickOnElement(wrangleButton);
                    System.out.println("clicked on wrangle button wrapper");
                    i = 11;
                }
//                if(Helper.isElementExists("connections-label-" + i + "0")){
//                    WebElement button = Helper.locateElementByTestId("connections-label-" + i + "0");
//                    System.out.println("found the element connection-tab-each-" + i + "0");
//                    System.out.println("found the element tab-label-can-sample-" + i + "0");
//                    ElementHelper.hoverOverElement(button);
//                    if (Helper.isElementExists("load-to-grid-wrapper")) {
//                        WebElement wrangleButton = Helper.locateElementByTestId("load-to-grid-wrapper");
//                        ElementHelper.clickOnElement(wrangleButton);
//                        System.out.println("clicked on wrangle button wrapper");
//                        i = 11;
//                    }

                else {
                    eachTab.click();

                    System.out.println("clicked on connection-tab-each-" + i + "0");
                }
            }
            } catch(Exception e){
                System.err.println("error: " + e);
            }
        }


    @Then("Click on the Wrangle button")
    public void clickOnFirstTabOfTheSecondColumn2() {
        try {
            for (int i = 1; i <= 10; i++) {
                WebElement ele = Helper.locateElementByTestId("connection-tab-each-" + i + "0");
//                    if (Helper.isElementExists("connections-label-" + i + "0")) {
                        WebElement button = Helper.locateElementByTestId("connections-label-" + i + "0");
                        System.out.println("label button found");
//                        ElementHelper.hoverOverElement(button);
             try {
                 if(i==6){
                     WebElement gridBtn = Helper.locateElementByTestId("load-to-grid-wrapper");
                     ElementHelper.clickOnElement(gridBtn);
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

    // @Then("Click on the Format field and Select the value")
    // public void clickOnTheFormatFieldAndSelectTheValue() {
    // WaitHelper.waitForPageToLoad();
    // ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-drawer-format"));
    // WaitHelper.waitForPageToLoad();
    // ElementHelper.clickOnElement(Helper.locateElementByTestId("input-select-4"));
    // }

    // @Then("Click on the Encoding field and Select the value")
    // public void clickOnTheEncodingFieldAndSelectTheValue() {
    // WaitHelper.waitForPageToLoad();
    // ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-drawer-encoding"));
    // WaitHelper.waitForPageToLoad();
    // ElementHelper.clickOnElement(Helper.locateElementByTestId("input-select-2"));
    // }

    @Then("Click on the Checkboxes")
    public void clickOnTheCheckboxes() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-drawer-enable-quoted-values"));
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-drawer-use-first-row-as-header"));
    }

    @Then("Click on the Apply button")
    public void clickOnTheApplyButton() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-apply-button"));
    }
}
