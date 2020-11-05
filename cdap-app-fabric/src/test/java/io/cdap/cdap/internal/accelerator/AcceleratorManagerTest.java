/*
 * Copyright © 2020 Cask Data, Inc.
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

package io.cdap.cdap.internal.accelerator;

import com.google.common.io.Files;
import io.cdap.cdap.AppWithWorkflow;
import io.cdap.cdap.WorkflowAppWithFork;
import io.cdap.cdap.api.annotation.Requirements;
import io.cdap.cdap.common.conf.CConfiguration;
import io.cdap.cdap.common.conf.Constants;
import io.cdap.cdap.common.id.Id;
import io.cdap.cdap.common.io.Locations;
import io.cdap.cdap.common.test.AppJarHelper;
import io.cdap.cdap.internal.AppFabricTestHelper;
import io.cdap.cdap.internal.app.services.ApplicationLifecycleService;
import io.cdap.cdap.internal.app.services.http.AppFabricTestBase;
import io.cdap.cdap.proto.ApplicationDetail;
import io.cdap.cdap.proto.id.ApplicationId;
import io.cdap.cdap.proto.id.NamespaceId;
import org.apache.twill.filesystem.Location;
import org.apache.twill.filesystem.LocationFactory;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.File;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class AcceleratorManagerTest extends AppFabricTestBase {

  public static final String TEST_VERSION = "1.0.0";
  private static ApplicationLifecycleService applicationLifecycleService;
  private static AcceleratorManager acceleratorManager;
  private static LocationFactory locationFactory;
  private static CConfiguration cConfiguration;


  @BeforeClass
  public static void setup() throws Exception {
    applicationLifecycleService = getInjector().getInstance(ApplicationLifecycleService.class);
    acceleratorManager = getInjector().getInstance(AcceleratorManager.class);
    locationFactory = getInjector().getInstance(LocationFactory.class);
    cConfiguration = getInjector().getInstance(CConfiguration.class);
  }

  @AfterClass
  public static void stop() {
    AppFabricTestHelper.shutdown();
  }

  @Test
  public void testGetAppsWithAccelerator() throws Exception {
    //Deploy application with accelerator
    Class<AppWithWorkflow> appWithWorkflowClass = AppWithWorkflow.class;
    Requirements declaredAnnotation = appWithWorkflowClass.getDeclaredAnnotation(Requirements.class);
    //verify this app has accelerators
    Assert.assertTrue(declaredAnnotation.accelerators().length > 0);
    String appNameWithAccelerator = appWithWorkflowClass.getSimpleName() + UUID.randomUUID();
    Id.Artifact artifactIdWithAccelerator = deployApp(appWithWorkflowClass, appNameWithAccelerator);

    //Deploy application without accelerator
    Class<WorkflowAppWithFork> appNoAcceleratorClass = WorkflowAppWithFork.class;
    Requirements declaredAnnotation1 = appNoAcceleratorClass.getDeclaredAnnotation(Requirements.class);
    //verify this app has no accelerators
    Assert.assertTrue(declaredAnnotation1 == null);
    String appNameWithoutAccelerator = appNoAcceleratorClass.getSimpleName() + UUID.randomUUID();
    deployApp(appNoAcceleratorClass, appNameWithoutAccelerator);

    //verify that list applications return the application tagged with accelerator only
    for (String accelerator : declaredAnnotation.accelerators()) {
      AcceleratorApplications appsForAccelerator = acceleratorManager
        .getAppsForAccelerator(NamespaceId.DEFAULT, accelerator, null, 0, 10);
      Set<ApplicationId> applicationIds = appsForAccelerator.getApplicationIds();
      List<ApplicationDetail> appsReturned = applicationLifecycleService.getAppDetails(applicationIds).values().stream()
        .collect(Collectors.toList());
      appsReturned.stream().
        forEach(
          applicationDetail -> Assert
            .assertEquals(appNameWithAccelerator, applicationDetail.getArtifact().getName()));
    }

    //delete the app and verify nothing is returned.
    applicationLifecycleService.removeApplication(NamespaceId.DEFAULT.app(appNameWithAccelerator));
    for (String accelerator : declaredAnnotation.accelerators()) {
      Set<ApplicationId> applicationIds = acceleratorManager
        .getAppsForAccelerator(NamespaceId.DEFAULT, accelerator, null, 0, 10).getApplicationIds();
      List<ApplicationDetail> appsReturned = applicationLifecycleService.getAppDetails(applicationIds).values().stream()
        .collect(Collectors.toList());
      Assert.assertTrue(appsReturned.isEmpty());
    }
    applicationLifecycleService.removeApplication(NamespaceId.DEFAULT.app(appNameWithoutAccelerator));
  }

  @Test
  public void testGetAppsForAcceleratorPagination() throws Exception {
    //Deploy two applications with accelerator
    Class<AppWithWorkflow> appWithWorkflowClass = AppWithWorkflow.class;
    Requirements declaredAnnotation = appWithWorkflowClass.getDeclaredAnnotation(Requirements.class);
    //verify this app has accelerators
    Assert.assertTrue(declaredAnnotation.accelerators().length > 0);
    String appNameWithAccelerator1 = appWithWorkflowClass.getSimpleName() + UUID.randomUUID();
    Id.Artifact artifactIdWithAccelerator1 = deployApp(appWithWorkflowClass, appNameWithAccelerator1);
    String appNameWithAccelerator2 = appWithWorkflowClass.getSimpleName() + UUID.randomUUID();
    Id.Artifact artifactIdWithAccelerator2 = deployApp(appWithWorkflowClass, appNameWithAccelerator2);

    //search with offset and limit
    String accelerator = declaredAnnotation.accelerators()[0];
    AcceleratorApplications appsForAccelerator = acceleratorManager
      .getAppsForAccelerator(NamespaceId.DEFAULT, accelerator, null, 0, 1);
    Assert.assertEquals(1, appsForAccelerator.getApplicationIds().size());
    //next search with pagination
    AcceleratorApplications appsForAcceleratorNext = acceleratorManager
      .getAppsForAccelerator(NamespaceId.DEFAULT, accelerator, appsForAccelerator.getCursor(), 1, 1);
    Assert.assertEquals(1, appsForAcceleratorNext.getApplicationIds().size());
    AcceleratorApplications appsForAcceleratorNext1 = acceleratorManager
      .getAppsForAccelerator(NamespaceId.DEFAULT, accelerator, appsForAccelerator.getCursor(), 2, 1);
    Assert.assertEquals(0, appsForAcceleratorNext1.getApplicationIds().size());
  }

  @Test
  public void testIsApplicationDisabled() throws Exception {
    //Deploy application with accelerator
    Class<AppWithWorkflow> appWithWorkflowClass = AppWithWorkflow.class;
    Requirements declaredAnnotation = appWithWorkflowClass.getDeclaredAnnotation(Requirements.class);
    //verify this app has accelerators
    Assert.assertTrue(declaredAnnotation.accelerators().length > 0);
    String appNameWithAccelerator = appWithWorkflowClass.getSimpleName() + UUID.randomUUID();
    Id.Artifact artifactIdWithAccelerator = deployApp(appWithWorkflowClass, appNameWithAccelerator);

    //Deploy application without accelerator
    Class<WorkflowAppWithFork> appNoAcceleratorClass = WorkflowAppWithFork.class;
    Requirements declaredAnnotation1 = appNoAcceleratorClass.getDeclaredAnnotation(Requirements.class);
    //verify this app has no accelerators
    Assert.assertTrue(declaredAnnotation1 == null);
    String appNameWithOutAccelerator = appWithWorkflowClass.getSimpleName() + UUID.randomUUID();
    deployApp(appNoAcceleratorClass, appNameWithOutAccelerator);

    boolean applicationDisabled = acceleratorManager
      .isApplicationDisabled(NamespaceId.DEFAULT.getNamespace(), appNameWithAccelerator);
    Assert.assertEquals(true, applicationDisabled);

    //set the accelerators for the application in the enabled list
    String[] accelerators = declaredAnnotation.accelerators();
    cConfiguration.set(Constants.AppFabric.ENABLED_ACCELERATORS_LIST, String.join(",", accelerators));

    applicationDisabled = acceleratorManager
      .isApplicationDisabled(NamespaceId.DEFAULT.getNamespace(), appNameWithAccelerator);
    Assert.assertEquals(false, applicationDisabled);

    //applications with no acclerators should not be disabled
    boolean applicationDisabled1 = acceleratorManager
      .isApplicationDisabled(NamespaceId.DEFAULT.getNamespace(), appNameWithOutAccelerator);
    Assert.assertEquals(false, applicationDisabled);

    applicationLifecycleService.removeApplication(NamespaceId.DEFAULT.app(appNameWithAccelerator));
    applicationLifecycleService.removeApplication(NamespaceId.DEFAULT.app(appNameWithOutAccelerator));
  }

  private Id.Artifact deployApp(Class applicationClass, String appName) throws Exception {
    Id.Artifact artifactId = Id.Artifact
      .from(Id.Namespace.DEFAULT, appName, TEST_VERSION);
    Location appJar = AppJarHelper.createDeploymentJar(locationFactory, applicationClass);
    File appJarFile = new File(tmpFolder.newFolder(),
                               String.format("%s-%s.jar", artifactId.getName(), artifactId.getVersion().getVersion()));
    Files.copy(Locations.newInputSupplier(appJar), appJarFile);
    appJar.delete();
    //deploy app
    applicationLifecycleService
      .deployAppAndArtifact(NamespaceId.DEFAULT, appName, artifactId, appJarFile, null,
                            null, programId -> {
        }, true);
    return artifactId;
  }
}
