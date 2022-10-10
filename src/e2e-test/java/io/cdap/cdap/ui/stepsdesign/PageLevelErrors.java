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
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.WebElement;

public class PageLevelErrors {
  private final String fakeNamespace = "/fakeNamespace";
  private final String pageNotFound = "page-404-error-msg";
  private final String pageNotFoundDefaultMessage = "page-404-default-msg";

  @When("Open fake namespace home page")
  public void openFakeNamespaceHomePage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace);
    WaitHelper.waitForPageToLoad();
  }

  @Then("Verify Page NotFound Error Message")
  public void verifyPageNotFoundErrorMessage() {
    WebElement notFoundSelector = Helper.locateElementByTestId(pageNotFound);

    Assert.assertTrue(notFoundSelector.isEnabled());
  }

  @When("Open fake namespace studio home page")
  public void openFakeNamespaceStudioHomePage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/studio");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open fake namespace pipeline list page")
  public void openFakeNamespacePipelineListPage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/pipelines");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open fake namespace pipeline detail page")
  public void openFakeNamespacePipelineDetailPage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/view/pipelineName");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open fake namespace pipeline drafts page")
  public void openFakeNamespacePipelineDraftsPage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/pipelines/drafts");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open fake namespace Wrangler page")
  public void openFakeNamespaceWranglerPage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/wrangler");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open invalid Wrangler workspace page")
  public void openInvalidWranglerWorkspacePage() {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "wrangler/invalid-workspace-id");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open fake namespace metadata page")
  public void openFakeNamespaceMetadataPage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/metadata");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open fake namespace search results page")
  public void openFakeNamespaceSearchResultsPage() {
    SeleniumDriver.openPage(Constants.NAMESPACE_URL + fakeNamespace + "/metadata/search/search_term/result");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open invalid path studio page")
  public void openInvalidPathStudioPage() {
    SeleniumDriver.openPage(Constants.BASE_PIPELINES_URL + "/studioInvalidPath");
    WaitHelper.waitForPageToLoad();
  }

  @Then("Verify Page NotFound Default Error Message")
  public void verifyPageNotFoundDefaultErrorMessage() {
    WebElement notFoundSelector = Helper.locateElementByTestId(pageNotFoundDefaultMessage);

    Assert.assertTrue(notFoundSelector.isEnabled());
  }

  @When("Open invalid path details page")
  public void openInvalidPathDetailsPage() {
    SeleniumDriver.openPage(Constants.BASE_PIPELINES_URL + "/viewInvalidPipelineDetails/pipelineName");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open invalid pipeline path details page")
  public void openInvalidPipelinePathDetailsPage() {
    SeleniumDriver.openPage(Constants.BASE_PIPELINES_URL + "/view/invalidPipelineName");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open invalid path wrangler page")
  public void openInvalidPathWranglerPage() {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "wranglerInvalidPath/invalid-workspace-id");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open invalid random path page")
  public void openInvalidRandomPathPage() {
    SeleniumDriver.openPage(Constants.BASE_URL + "/randomInvalidPath");
    WaitHelper.waitForPageToLoad();
  }
}
