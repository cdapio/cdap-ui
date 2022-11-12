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

public class ImportSchema {
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
    @Then("Click on first tab of the second column")
public void clickOnFirstTabOfTheSecondColumn() {
    for(int i=0;i <10 ;i ++){
        if(Helper.isElementExists("connection-tabs-column-"+ i)){
            // iterates thru columns
            // for(int j=0;j<10;j++) {
            // iterates thru rows in specific column, i
            WebElement ele = Helper.locateElementByTestId("connectionstabs-eachtab-"+i+"-0");

            Actions action = new Actions(SeleniumDriver.getDriver());
            WaitHelper.waitForPageToLoad();
            action.moveToElement(ele).perform();

            if(Helper.isElementExists("connection-list-wrangle-link")){
                ElementHelper.clickOnElement(Helper.locateElementByTestId("connection-list-wrangle-link"));
                if (Helper.isElementExists("snackbar-success-icon")) {
                    WaitHelper.waitForPageToLoad();
                    ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-success-icon"));
                    System.out.println("inside snack bar success icon");
                }
                else {

//    public void clickOnFirstTabOfTheSecondColumn() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("dhanu-connection"));
//    }
//    @Then("Click on first tab of the third column")
//    public void clickOnFirstTabOfTheThirdColumn() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("users-connection"));
//    }
//    @Then("Click on first tab of the fourth column")
//    public void clickOnFirstTabOfTheFourthColumn() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("divami-connection"));
//    }
//    @Then("Click on first tab of the fifth column")
//    public void clickOnFirstTabOfTheFifthColumn() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("downloads-connection"));
//    }
    @Then("Hover&Click on the Wrangle button")
    public void hoverAndClickOnTheWranglerButton() {
        WaitHelper.waitForPageToLoad();
        WebElement ele = Helper.locateElementByTestId("designkt-block-mp4-connection");
        Actions action = new Actions(SeleniumDriver.getDriver());
        WaitHelper.waitForPageToLoad();
        action.moveToElement(ele).perform();
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connections-tab-ref-explore"));
    }
    @Then("Click on the Import Schema button & Upload file")
    public void clickOnTheImportSchemaButtonAndUploadFile() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
    }
    @Then("Click on the Apply button")
    public void clickOnTheApplyButton() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
    }
    @Then("Check if the Snackbar is displayed")
    public void checkIfTheSnackbarIsDisplayed() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
    }
    @Then("Verify if the toast message is displayed")
    public void verifyIfTheToastMessageIsDisplayed() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
    }
    @Then("Click on the Cross icon")
    public void clickOnTheCrossIcon() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
    }
    @Then("Verify if the User is on grid table page")
    public void verifyIfTheUserIsOnTheGridTablePage() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
    }
}
