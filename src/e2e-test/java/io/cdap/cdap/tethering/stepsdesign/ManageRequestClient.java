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

import io.cdap.cdap.tethering.actions.TetheringActions;
import io.cdap.e2e.pages.actions.CdfSysAdminActions;
import io.cdap.e2e.utils.CdfHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.io.IOException;

/**
 * Tethering Registration related steps definitions
 */
public class ManageRequestClient implements CdfHelper {

  private static final int WAIT_TIME_MS = 1000;
  private static int initialPendingReqCount;
  private static int updatedPendingReqCount;
  private static int initialEstablishedConnCount;
  private static int updatedEstablishedConnCount;

  @When("Navigate to tethering page")
  public static void navigateToTetheringPage() throws InterruptedException {
    CdfSysAdminActions.clickSystemAdminMenu();
    TetheringActions.openTetheringPage();
    Thread.sleep(WAIT_TIME_MS);
  }

  @Then("Count number of pending requests on client")
  public static void countNumberOfPendingReqs() {
    initialPendingReqCount = TetheringActions.countNumberOfPendingReqs(true);
  }

  @Then("Click on the more menu of a pending request")
  public static void clickOnMoreMenuPendingReq() {
    TetheringActions.clickMoreMenuPendingReq();
  }

  @Then("Click on Delete option for pending request")
  public static void clickDeleteOptionPendingReq() {
    TetheringActions.clickOnDeleteOptionPendingReq();
  }

  @Then("Confirm the delete action")
  public static void confirmDeleteAction() {
    TetheringActions.clickOnConfirmDelete();
  }

  @Then("Verify the pending request has been deleted")
  public static void verifyDeletionOfPendingRequest() throws Exception {
    updatedPendingReqCount = TetheringActions.countNumberOfPendingReqs(true);
    if (updatedPendingReqCount != initialPendingReqCount - 1) {
      throw new Exception("failure in pending request deletion.");
    }
  }

  @Then("Count number of established connections on client")
  public static void countNumberOfEstablishedConns() {
    initialEstablishedConnCount = TetheringActions.countNumberOfEstablishedConns();
  }

  @Then("Click on the more menu of a established connection")
  public static void clickOnMoreMenuEstablishedConn() {
    TetheringActions.clickMoreMenuEstablishedConn();
  }

  @Then("Click on Delete option for established connection")
  public static void clickDeleteOptionEstablishedConn() {
    TetheringActions.clickOnDeleteOptionEstablishedConn();
  }

  @Then("Verify the established connection has been deleted on client")
  public static void verifyDeletionOfEstablishedConn() throws Exception {
    updatedEstablishedConnCount = TetheringActions.countNumberOfEstablishedConns();
    if (updatedEstablishedConnCount != initialEstablishedConnCount - 1) {
      throw new Exception("failure in pending request deletion.");
    }
  }
}


