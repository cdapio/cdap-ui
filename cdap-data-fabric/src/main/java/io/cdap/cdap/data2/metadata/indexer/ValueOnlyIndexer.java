/*
 * Copyright © 2016 Cask Data, Inc.
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

package io.cdap.cdap.data2.metadata.indexer;

import io.cdap.cdap.data2.metadata.dataset.MetadataEntry;
import io.cdap.cdap.data2.metadata.dataset.SortInfo;

import java.util.Collections;
import java.util.Set;

/**
 * {@link Indexer} that returns the {@link MetadataEntry} value as the only index.
 */
public class ValueOnlyIndexer implements Indexer {
  @Override
  public Set<String> getIndexes(MetadataEntry entry) {
    return Collections.singleton(entry.getValue());
  }

  @Override
  public SortInfo.SortOrder getSortOrder() {
    return SortInfo.SortOrder.ASC;
  }
}
