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

package io.cdap.cdap.tethering.stepsdesign;

import io.cdap.cdap.tethering.actions.TetheringRegistrationActions;
import io.cdap.cdap.tethering.actions.TetheringActions;
import io.cdap.e2e.pages.actions.CdfSysAdminActions;
import io.cdap.e2e.utils.CdfHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

/**
 * Tethering Registration related steps definitions
 */
public class TetheringRegistration implements CdfHelper {

  @Then("Open create new request page")
  public static void clickCreateReqButton() {
    TetheringRegistrationActions.openTetheringRegistrationPage();
  }

  @Then("Click to select the default namespace")
  public static void selectDefaultNamespace() {
    TetheringRegistrationActions.clickNamespaceCheckbox();
  }

  @Then("Enter project name {string}")
  public static void enterProjectName(String projName) {
    TetheringRegistrationActions.enterProjectName(projName);
  }

  @Then("Enter region {string}")
  public static void enterRegion(String region) {
    TetheringRegistrationActions.enterRegion(region);
  }

  @Then("Enter instance name {string}")
  public static void enterInstanceName(String instanceName) {
    TetheringRegistrationActions.enterInstanceName(instanceName);
  }

  @Then("Enter instance url {string}")
  public static void enterInstanceUrl(String instanceUrl) {
    TetheringRegistrationActions.enterInstanceUrl(instanceUrl);
  }

  @Then("Enter description {string}")
  public static void enterDescription(String description) {
    TetheringRegistrationActions.enterDescription(description);
  }

  @Then("Finish creating new tethering request")
  public static void finishCreatingNewRequest() {
    TetheringRegistrationActions.clickSendReqButton();
  }

  @Then("Verify the request was created successfully")
  public static void verifyRequestCreatedSuccessfully() {
    TetheringRegistrationActions.isReqCreationSucceeded();
  }

  @Then("Verify the request failed to be created")
  public static void verifyRequestCreationFailure() {
    TetheringRegistrationActions.isReqCreationFailed();
  }

  @Then("Verify the request failed to be created with no selected namespaces")
  public static void verifyRequestCreationFailureWithNoNamespaces() {
    TetheringRegistrationActions.isReqCreationFailedWithNoNs();
  }

  @Then("Verify the request failed to be created with a missing required field")
  public static void verifyRequestCreationFailureWithMissingRequiredField() {
    TetheringRegistrationActions.isReqCreationFailedWithMissingRequiredField();
  }
}
