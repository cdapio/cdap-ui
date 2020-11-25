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

package io.cdap.cdap.internal.capability;

import com.google.inject.Inject;
import io.cdap.cdap.spi.data.StructuredRow;
import io.cdap.cdap.spi.data.StructuredTable;
import io.cdap.cdap.spi.data.StructuredTableContext;
import io.cdap.cdap.spi.data.table.field.Field;
import io.cdap.cdap.spi.data.table.field.Fields;
import io.cdap.cdap.spi.data.transaction.TransactionRunner;
import io.cdap.cdap.spi.data.transaction.TransactionRunners;
import io.cdap.cdap.store.StoreDefinition;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import javax.annotation.Nullable;

/**
 * Store for capabilities. Mainly responsible for reading and updating capabilities in the storage
 */
public class CapabilityStore {

  private final TransactionRunner transactionRunner;

  @Inject
  public CapabilityStore(TransactionRunner transactionRunner) {
    this.transactionRunner = transactionRunner;
  }

  public void upsertCapabilityStatus(String capability, CapabilityStatus status) throws IOException {
    TransactionRunners.run(transactionRunner, context -> {
      upsertCapabilityStatus(capability, status, context);
    }, IOException.class);
  }

  private void upsertCapabilityStatus(String capability, CapabilityStatus status,
                                      StructuredTableContext context) throws IOException {
    StructuredTable capabilityTable = context.getTable(StoreDefinition.CapabilitiesStore.CAPABILITES);
    Collection<Field<?>> fields = new ArrayList<>();
    fields.add(Fields.stringField(StoreDefinition.CapabilitiesStore.NAME_FIELD, capability));
    fields.add(Fields.stringField(StoreDefinition.CapabilitiesStore.STATUS_FIELD, status.name().toLowerCase()));
    fields.add(Fields.longField(StoreDefinition.CapabilitiesStore.UPDATED_TIME_FIELD, System.currentTimeMillis()));
    capabilityTable.upsert(fields);
  }

  @Nullable
  public String readCapabilityStatus(String capability) throws IOException {
    return TransactionRunners.run(transactionRunner, context -> {
      return readCapabilityStatus(capability, context);
    }, IOException.class);
  }

  private String readCapabilityStatus(String capability, StructuredTableContext context) throws IOException {
    StructuredTable capabilityTable = context.getTable(StoreDefinition.CapabilitiesStore.CAPABILITES);
    Collection<Field<?>> keyField = Collections
      .singleton(Fields.stringField(StoreDefinition.CapabilitiesStore.NAME_FIELD, capability));
    Collection<String> returnField = Collections.singleton(StoreDefinition.CapabilitiesStore.STATUS_FIELD);
    Optional<StructuredRow> result = capabilityTable.read(keyField, returnField);
    return result.isPresent() ? result.get().getString(StoreDefinition.CapabilitiesStore.STATUS_FIELD) : null;
  }
}
