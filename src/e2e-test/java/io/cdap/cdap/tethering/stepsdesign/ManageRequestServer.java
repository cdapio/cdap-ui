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

/**
 * Tethering Registration related steps definitions
 */
public class ManageRequestServer implements CdfHelper {

  private static final int WAIT_TIME_MS = 3000;
  private static int initialPendingReqCount;
  private static int updatedPendingReqCount;
  private static int initialEstablishedConnCount;
  private static int updatedEstablishedConnCount;

  @Then("Count number of pending requests on server")
  public static void countNumberOfPendingReqsServer() {
    initialPendingReqCount = TetheringActions.countNumberOfPendingReqs(false);
  }

  @Then("Count number of established connections on server")
  public static void countNumberOfEstablishedConnsServer() {
    initialEstablishedConnCount = TetheringActions.countNumberOfEstablishedConns();
  }

  @Then("Click on accept button")
  public static void clickAcceptButton() throws InterruptedException {
    TetheringActions.clickOnAcceptConnReq();
    Thread.sleep(WAIT_TIME_MS);
  }

  @Then("Click on reject button")
  public static void clickRejectButton() {
    TetheringActions.clickOnRejectConnReq();
  }

  @Then("Confirm the reject action")
  public static void confirmRejectAction() {
    TetheringActions.clickOnConfirmReject();
  }

  @Then("Verify the request has been accepted")
  public static void verifyAcceptanceOfConnRequest() throws Exception {
    updatedPendingReqCount = TetheringActions.countNumberOfPendingReqs(false);
    updatedEstablishedConnCount = TetheringActions.countNumberOfEstablishedConns();
    if (updatedPendingReqCount != initialPendingReqCount - 1 && updatedEstablishedConnCount != initialEstablishedConnCount + 1) {
      throw new Exception("failure in accepting connection request.");
    }
  }

  @Then("Verify the request has been rejected")
  public static void verifyRejectionOfConnRequest() throws Exception {
    updatedPendingReqCount = TetheringActions.countNumberOfPendingReqs(false);
    if (updatedPendingReqCount != initialPendingReqCount - 1) {
      throw new Exception("failure in connection request rejection.");
    }
  }

  @Then("Verify the established connection has been deleted on server")
  public static void verifyDeletionOfEstablishedConn() throws Exception {
    updatedEstablishedConnCount = TetheringActions.countNumberOfEstablishedConns();
    if (updatedEstablishedConnCount != initialEstablishedConnCount - 1) {
      throw new Exception("failure in pending request deletion.");
    }
  }
}


