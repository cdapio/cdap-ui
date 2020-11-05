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

import com.google.inject.Inject;
import io.cdap.cdap.api.metadata.MetadataEntity;
import io.cdap.cdap.api.metadata.MetadataScope;
import io.cdap.cdap.common.conf.CConfiguration;
import io.cdap.cdap.common.conf.Constants;
import io.cdap.cdap.proto.id.ApplicationId;
import io.cdap.cdap.proto.id.NamespaceId;
import io.cdap.cdap.proto.metadata.MetadataSearchResponse;
import io.cdap.cdap.proto.metadata.MetadataSearchResultRecord;
import io.cdap.cdap.spi.metadata.SearchRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Nullable;

/**
 * Class with helpful methods for dynamic accelerator framework
 */
public class AcceleratorManager {

  private static final Logger LOG = LoggerFactory.getLogger(AcceleratorManager.class);
  private static final String ACCELERATOR_TAG = "accelerator:%s";
  private static final String APPLICATION_TAG = "application:%s";
  private static final String ACCELERATOR_KEY = "accelerator";
  private static final String APPLICATION = "application";
  private final MetadataSearchClient metadataClient;
  private final CConfiguration cConf;

  @Inject
  AcceleratorManager(MetadataSearchClient metadataClient, CConfiguration cConf) {
    this.metadataClient = metadataClient;
    this.cConf = cConf;
  }

  /**
   * Returns the list of applications that are having metadata tagged with the accelerator
   *
   * @param namespace   Namespace for which applications should be listed
   * @param accelerator Accelerator by which to filter
   * @param cursor      Optional cursor from a previous response
   * @param offset      Offset from where to start
   * @param limit       Limit of records to fetch
   * @return
   * @throws Exception - Exception from meta data search if any
   */
  public AcceleratorApplications getAppsForAccelerator(NamespaceId namespace, String accelerator,
                                                       @Nullable String cursor, int offset,
                                                       int limit) throws Exception {
    String acceleratorTag = String.format(ACCELERATOR_TAG, accelerator);
    SearchRequest searchRequest = SearchRequest.of(acceleratorTag)
      .addNamespace(namespace.getNamespace())
      .addType(APPLICATION)
      .setScope(MetadataScope.SYSTEM)
      .setCursor(cursor)
      .setOffset(offset)
      .setLimit(limit)
      .build();
    MetadataSearchResponse searchResponse = metadataClient.search(searchRequest);
    Set<ApplicationId> applicationIds = searchResponse.getResults().stream()
      .map(MetadataSearchResultRecord::getMetadataEntity)
      .map(this::getApplicationId)
      .collect(Collectors.toSet());
    return new AcceleratorApplications(applicationIds, getCursorResponse(searchResponse), searchResponse.getOffset(),
                                       searchResponse.getLimit(), searchResponse.getTotal());
  }

  @Nullable
  private String getCursorResponse(MetadataSearchResponse searchResponse) {
    List<String> cursors = searchResponse.getCursors();
    if (cursors == null || cursors.isEmpty()) {
      return null;
    }
    return cursors.get(0);
  }

  /**
   * Returns boolean indicating whether application is disabled due to a disabled accelerator
   *
   * @param namespace
   * @param applicationName
   * @return
   * @throws Exception
   */
  public boolean isApplicationDisabled(String namespace, String applicationName) throws Exception {
    String applicationQuery = String.format(APPLICATION_TAG, applicationName);
    SearchRequest searchRequest = SearchRequest.of(applicationQuery)
      .addNamespace(namespace)
      .addType(APPLICATION)
      .setScope(MetadataScope.SYSTEM)
      .build();
    return metadataClient.search(searchRequest)
      .getResults().stream()
      .filter(this::hasAcceleratorTagValue)
      .map(this::getAcceleratorTagValue)
      .anyMatch(this::isAcceleratorDisabled);
  }

  @Nullable
  private String getAcceleratorTagValue(MetadataSearchResultRecord metadataRecord) {
    return metadataRecord.getMetadata().get(MetadataScope.SYSTEM).getProperties()
      .get(ACCELERATOR_KEY);
  }

  private boolean hasAcceleratorTagValue(MetadataSearchResultRecord metadataRecord) {
    return getAcceleratorTagValue(metadataRecord) != null;
  }

  private boolean isApplicationType(MetadataEntity metadataEntity) {
    return MetadataEntity.APPLICATION.equals(metadataEntity.getType());
  }

  private ApplicationId getApplicationId(MetadataEntity metadataEntity) {
    return new ApplicationId(metadataEntity.getValue(MetadataEntity.NAMESPACE),
                             metadataEntity.getValue(MetadataEntity.APPLICATION),
                             metadataEntity.getValue(MetadataEntity.VERSION));
  }

  private boolean isAcceleratorDisabled(@Nullable String accelerator) {
    if (accelerator == null || accelerator.isEmpty()) {
      return false;
    }
    Collection<String> enabledAcceleratorCollection = cConf
      .getTrimmedStringCollection(Constants.AppFabric.ENABLED_ACCELERATORS_LIST);
    if (enabledAcceleratorCollection.isEmpty()) {
      return true;
    }
    return enabledAcceleratorCollection.stream()
      .noneMatch(enabledAccelerator -> enabledAccelerator.equalsIgnoreCase(accelerator));
  }
}
