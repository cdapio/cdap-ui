package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;

public class Snackbar {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
        System.out.println("Navigated to Home Page successfully");
    }
    @Then("Click on the data exploration card")
    public void clickOnTheDataExplorationCard(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-exploration-card-0"));
        System.out.println("Clicked on the Data Exploration Card");
    }
    @Then("Click on the Snackbar close icon")
    public void verifyTheSnackbarPopUpIsComingOrNot(){
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
        System.out.println("The Snackbar closed successfully");
    }
}
