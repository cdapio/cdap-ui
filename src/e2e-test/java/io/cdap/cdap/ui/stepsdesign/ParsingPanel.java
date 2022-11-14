package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
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
        ElementHelper.clickOnElement(Helper.locateElementByTestId("file-connector-type"));
    }

    @Then("Click on the wrangle button")
    public void clickOnFirstTabOfTheSecondColumn() {
        try {
            for (int i = 1; i<=10; i++) {
                WebElement ele = Helper.locateElementByTestId("connection-tab-" + i + "0");
                if (ElementHelper.isElementDisplayed(ele)) {
                    System.out.println("element found at index = " + i);
                    WebElement button = Helper.locateElementByTestId("connection-tab-label-" + i + "0");
                    Actions action = new Actions(SeleniumDriver.getDriver());
                    action.moveToElement(button).build().perform();
                    if (Helper.isElementExists("connections-tab-explore",button)) {
                        ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-text"));
                        System.out.println("wrangle clicked");
                        if (Helper.isElementExists("snackbar-alert")) {
                            ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
                            break;
                        }
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
}
