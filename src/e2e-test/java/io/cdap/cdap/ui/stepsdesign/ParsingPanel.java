package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java8.Th;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

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

    @Then("Click on the Wrangle button")
    public void clickOnFirstTabOfTheSecondColumn() {
        try {
            for (int i = 1; i <= 10; i++) {
                WebElement ele = Helper.locateElementByTestId("connection-tab-each-" + i + "0");
                if (ElementHelper.isElementDisplayed(ele)) {
                    System.out.println("element found at index = " + i);
                    WebElement button = Helper.locateElementByTestId("tab-label-can-sample-" + i + "0");
                    Actions action = new Actions(SeleniumDriver.getDriver());
                    action.moveToElement(button).build().perform();
                    if (Helper.isElementExists("load-to-grid-wrapper", button)) {
                        ElementHelper.clickOnElement(Helper.locateElementByTestId("load-to-grid-button"));
                        System.out.println("wrangle clicked");
//                        if (Helper.isElementExists("snackbar-alert")) {
//                            ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
//                            break;
//                        }
                        break;
                    } else {
                        ele.click();
                        System.out.println("folder clicked");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

//    @Then("Click on the Format field and Select the value")
//    public void clickOnTheFormatFieldAndSelectTheValue() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-drawer-format"));
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("input-select-4"));
//    }

//    @Then("Click on the Encoding field and Select the value")
//    public void clickOnTheEncodingFieldAndSelectTheValue() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-drawer-encoding"));
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("input-select-2"));
//    }

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
