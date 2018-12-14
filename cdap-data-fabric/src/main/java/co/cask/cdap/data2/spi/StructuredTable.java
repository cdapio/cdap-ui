/*
 * Copyright © 2018 Cask Data, Inc.
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

package co.cask.cdap.data2.spi;

import co.cask.cdap.api.dataset.lib.CloseableIterator;
import co.cask.cdap.data2.spi.table.field.Field;
import co.cask.cdap.data2.spi.table.field.Range;

import java.util.Collection;
import java.util.Optional;

/**
 * Abstraction for a table that contains rows and columns.
 * The schema of the table is fixed, and has to be specified in the
 * {@link co.cask.cdap.data2.spi.table.TableSpecification} during the table creation.
 */
public interface StructuredTable {
  /**
   * Write the collection of fields to the table.
   * The fields contain both the primary key and the rest of the columns to write.
   *
   * @param fields the fields to write
   */
  void write(Collection<Field<?>> fields);

  /**
   * Read a single row from the table.
   *
   * @param keys the primary key of the row to read
   * @param columns the columns to read if not all the columns are needed
   * @return the row addressed by the primary key
   */
  Optional<Row> read(Collection<Field<?>> keys, Collection<String> columns);

  /**
   * Read a set of rows from the table matching the key range.
   * The rows returned will be sorted on the primary key order.
   *
   * @param keyRange key range for the scan
   * @param limit maximum number of rows to return
   * @return a {@link CloseableIterator} of rows
   */
  CloseableIterator<Row> scan(Range keyRange, int limit);

  /**
   * Delete a single row from the table.
   *
   * @param keys the primary key of the row to delete
   */
  void delete(Collection<Field<?>> keys);
}
