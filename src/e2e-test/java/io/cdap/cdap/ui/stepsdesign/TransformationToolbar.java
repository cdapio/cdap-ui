/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class TransformationToolbar {
    @Given("Navigate to Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Data Explorations card")
    public void clickOnTheDataExplorationCard() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card"));
        String url=SeleniumDriver.getDriver().getCurrentUrl();
        Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        System.out.println("Clicked on the data explorations card");
    }
    @Then("Verify if the Transformation Toolbar is displayed on the Grid Page")
    public void verifyIfTheTransformationToolbarIsDisplayedOnTheGridPage() {
        WaitHelper.waitForPageToLoad();
        boolean flag = true;
        while(flag == true) {
            if(Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                flag = true;
            } else {
                flag=false;
            }
        }
        boolean toolbar = Helper.isElementExists(Helper.getCssSelectorByDataTestId("transformations-toolbar-container"));
        if (toolbar==true) {
            System.out.println("Toolbar panel is displayed");
        } else {
            System.out.println("Toolbar panel is not displayed");
        }
    }
    @Then("Verify if all icons are displayed on Toolbar")
    public void verifyAllTheIconsAreDisplayedOnToolbar(){
        WaitHelper.waitForPageToLoad();
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-undo")));
        System.out.println("Undo icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-redo")));
        System.out.println("Redo icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-null")));
        System.out.println("Null icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-invalid")));
        System.out.println("Invalid con is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-column")));
        System.out.println("Column icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-structure")));
        System.out.println("Structure icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-fragment")));
        System.out.println("Fragment icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-math")));
        System.out.println("Math icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-security")));
        System.out.println("Security icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-other")));
        System.out.println("Other icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-grid")));
        System.out.println("Grid icon is displayed");
    }
    @Then("Click on the function names toggle")
    public void clickOnTheSliderButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("transformations-toolbar-icons-function-name-toggler"));
            System.out.println("The toggle bar is clicked");
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
    @Then("Verify if the label name is displayed for appropriate icon")
    public void verifyLabelName() {
        WaitHelper.waitForPageToLoad();
        boolean flag = true;
        while(flag == true) {
            if(Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                flag = true;
            } else {
                flag=false;
            }
        }
        try {
            WaitHelper.waitForPageToLoad();
            WebElement undo = Helper.locateElementByTestId("toolbar-icon-title-undo");
            String text = undo.getText();
            Assert.assertEquals(text, "Undo");
            System.out.println("The Undo label is displayed correctly for undo icon");
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
        WaitHelper.waitForPageToLoad();
        WebElement redo = Helper.locateElementByTestId("toolbar-icon-title-redo");
        String redoText = redo.getText();
        Assert.assertEquals(redoText,"Redo");
        System.out.println("The Redo label is displayed correctly for redo icon");
        WebElement nullElement = Helper.locateElementByTestId("toolbar-icon-title-null");
        String nullText= nullElement.getText();
        Assert.assertEquals(nullText,"Null");
        System.out.println("The Null label is displayed correctly for null icon");
        WebElement invalidElement = Helper.locateElementByTestId("toolbar-icon-title-invalid");
        String invalidText = invalidElement.getText();
        Assert.assertEquals(invalidText,"Invalid");
        System.out.println("The Invalid label is displayed correctly for invalid icon");
        WebElement column = Helper.locateElementByTestId("toolbar-icon-title-column");
        String columnText = column.getText();
        Assert.assertEquals(columnText,"Column");
        System.out.println("The Column label is displayed correctly for column icon");
        WebElement structure = Helper.locateElementByTestId("toolbar-icon-title-structure");
        String structureText = structure.getText();
        Assert.assertEquals(structureText,"Structure");
        System.out.println("The Structure label is displayed correctly for structure icon");
        WebElement math = Helper.locateElementByTestId("toolbar-icon-math");
        String mathText = math.getText();
        Assert.assertEquals(mathText,"Math");
        System.out.println("The Structure label is displayed correctly for structure icon");
        WebElement fragment = Helper.locateElementByTestId("toolbar-icon-title-fragment");
        String fragmentText = fragment.getText();
        Assert.assertEquals(fragmentText,"Fragment");
        System.out.println("The Fragment label is displayed correctly for fragment icon");
        WebElement security = Helper.locateElementByTestId("toolbar-icon-title-security");
        String securityText = security.getText();
        Assert.assertEquals(securityText,"Security");
        System.out.println("The Security label is displayed correctly for security icon");
        WebElement other = Helper.locateElementByTestId("toolbar-icon-title-other");
        String otherText = other.getText();
        Assert.assertEquals(otherText,"Other");
        System.out.println("The More label is displayed correctly for more icon");
        try {
            WaitHelper.waitForPageToLoad();
            WebElement grid = Helper.locateElementByTestId("toolbar-icon-title-grid");
            String gridText = grid.getText();
            Assert.assertEquals(gridText, "Grid");
            System.out.println("The Grid label is displayed correctly for grid icon");
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
    @Then("Hover on the Icons and verify if the tool tip is displayed")
    public void verifyForTooltip() {
        try {
            WebElement ele = Helper.locateElementByTestId("toolbar-icon-structure");
            Actions action = new Actions(SeleniumDriver.getDriver());
            WaitHelper.waitForPageToLoad();
            action.moveToElement(ele).perform();
            WebElement toolTip = Helper.locateElementByTestId("toolbar-icon-tooltip-structure");
            Assert.assertTrue(ElementHelper.isElementDisplayed(toolTip));
            System.out.println("the Tooltip is displayed  when mouse is hovered on the icon");
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Verify by Clicking on the Up and Down arrow icon")
    public void clickOnTheUpAndDownArrowButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("toggle-toolbar-header"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
//    @Then("Click on the Structure")
//    public void clickOnTheStructure() {
//        WaitHelper.waitForPageToLoad();
//        ElementHelper.clickOnElement(Helper.locateElementByTestId("id"));
//        WaitHelper.waitForPageToLoad();
//        Helper.locateElementByTestId("id");
//    }
}
