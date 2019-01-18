/*
 * Copyright © 2016-2019 Cask Data, Inc.
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

package co.cask.cdap.etl.mock.action;

import co.cask.cdap.api.TxRunnable;
import co.cask.cdap.api.data.schema.Schema;
import co.cask.cdap.api.metadata.Metadata;
import co.cask.cdap.api.metadata.MetadataEntity;
import co.cask.cdap.api.metadata.MetadataScope;
import co.cask.cdap.api.plugin.PluginProperties;
import co.cask.cdap.api.security.store.SecureStoreData;
import co.cask.cdap.api.security.store.SecureStoreMetadata;
import co.cask.cdap.etl.api.StageMetrics;
import co.cask.cdap.etl.api.action.ActionContext;
import co.cask.cdap.etl.api.action.SettableArguments;
import co.cask.cdap.etl.api.lineage.field.FieldOperation;
import co.cask.cdap.etl.mock.common.MockArguments;
import co.cask.cdap.proto.id.NamespaceId;

import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;

/**
 * Mock ActionContext for CustomAction tests.
 */
public class MockActionContext implements ActionContext {

  private SettableArguments settableArguments;

  public MockActionContext() {
    this.settableArguments = new MockArguments();
  }

  @Override
  public long getLogicalStartTime() {
    return 0L;
  }

  @Override
  public SettableArguments getArguments() {
    return settableArguments;
  }

  @Override
  public String getStageName() {
    return null;
  }

  @Override
  public StageMetrics getMetrics() {
    return null;
  }

  @Override
  public PluginProperties getPluginProperties() {
    return null;
  }

  @Override
  public PluginProperties getPluginProperties(String pluginId) {
    return null;
  }

  @Override
  public <T> Class<T> loadPluginClass(String pluginId) {
    return null;
  }

  @Override
  public <T> T newPluginInstance(String pluginId) throws InstantiationException {
    return null;
  }

  @Nullable
  @Override
  public Schema getInputSchema() {
    return null;
  }

  @Override
  public Map<String, Schema> getInputSchemas() {
    return Collections.emptyMap();
  }

  @Nullable
  @Override
  public Schema getOutputSchema() {
    return null;
  }

  @Override
  public Map<String, Schema> getOutputPortSchemas() {
    return Collections.emptyMap();
  }

  @Nullable
  @Override
  public URL getServiceURL(String applicationId, String serviceId) {
    // no-op
    return null;
  }

  @Nullable
  @Override
  public URL getServiceURL(String serviceId) {
    //no-op
    return null;
  }

  @Override
  public String getNamespace() {
    return NamespaceId.DEFAULT.getNamespace();
  }

  @Override
  public String getPipelineName() {
    return null;
  }

  @Override
  public List<SecureStoreMetadata> list(String namespace) {
    return null;
  }

  @Override
  public SecureStoreData get(String namespace, String name) {
    return null;
  }

  @Override
  public void put(String namespace, String name, String data, @Nullable String description,
                  Map<String, String> properties) {
    // no-op; unused
  }

  @Override
  public void delete(String namespace, String name) {
    // no-op; unused
  }

  @Override
  public void execute(TxRunnable runnable) {
    // no-op; unused
  }

  @Override
  public void execute(int timeoutInSeconds, TxRunnable runnable) {
    // no-op; unused
  }

  @Override
  public Map<MetadataScope, Metadata> getMetadata(MetadataEntity metadataEntity) {
    return null;
  }

  @Override
  public Metadata getMetadata(MetadataScope scope, MetadataEntity metadataEntity) {
    return null;
  }

  @Override
  public void addProperties(MetadataEntity metadataEntity, Map<String, String> properties) {

  }

  @Override
  public void addTags(MetadataEntity metadataEntity, String... tags) {

  }

  @Override
  public void addTags(MetadataEntity metadataEntity, Iterable<String> tags) {

  }

  @Override
  public void removeMetadata(MetadataEntity metadataEntity) {

  }

  @Override
  public void removeProperties(MetadataEntity metadataEntity) {

  }

  @Override
  public void removeProperties(MetadataEntity metadataEntity, String... keys) {

  }

  @Override
  public void removeTags(MetadataEntity metadataEntity) {

  }

  @Override
  public void removeTags(MetadataEntity metadataEntity, String... tags) {

  }

  @Override
  public void record(List<FieldOperation> fieldOperations) {
    // no-op
  }
}

