/*
 * Copyright © 2019 Cask Data, Inc.
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

package co.cask.cdap.spi.data;

import co.cask.cdap.api.common.Bytes;
import co.cask.cdap.api.dataset.lib.CloseableIterator;
import co.cask.cdap.spi.data.table.StructuredTableId;
import co.cask.cdap.spi.data.table.StructuredTableSchema;
import co.cask.cdap.spi.data.table.StructuredTableSpecification;
import co.cask.cdap.spi.data.table.field.Field;
import co.cask.cdap.spi.data.table.field.FieldType;
import co.cask.cdap.spi.data.table.field.Fields;
import co.cask.cdap.spi.data.table.field.Range;
import co.cask.cdap.spi.data.transaction.TransactionRunner;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Iterables;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

/**
 * This is a test base for {@link StructuredTable}.
 * TODO: CDAP-14750 add more unit tests for the StructuredTable
 */
public abstract class StructuredTableTest {
  // TODO: test complex schema will all allowed data types
  protected static final StructuredTableSpecification SIMPLE_SPEC;

  private static final StructuredTableId SIMPLE_TABLE = new StructuredTableId("simpleTable");
  private static final String KEY = "key";
  private static final String KEY2 = "key2";
  private static final String STRING_COL = "col1";
  private static final String DOUBLE_COL = "col2";
  private static final String FLOAT_COL = "col3";
  private static final String BYTES_COL = "col4";
  private static final String LONG_COL = "col5";
  private static final String VAL = "val";
  private static final StructuredTableSchema SIMPLE_SCHEMA;

  static {
    try {
      SIMPLE_SPEC = new StructuredTableSpecification.Builder()
       .withId(SIMPLE_TABLE)
       .withFields(Fields.intType(KEY), Fields.stringType(STRING_COL), Fields.longType(KEY2),
                   Fields.doubleType(DOUBLE_COL), Fields.floatType(FLOAT_COL), Fields.bytesType(BYTES_COL),
                   Fields.longType(LONG_COL))
       .withPrimaryKeys(KEY, KEY2)
       .build();
      SIMPLE_SCHEMA = new StructuredTableSchema(SIMPLE_SPEC);
    } catch (InvalidFieldException e) {
      throw new RuntimeException(e);
    }
  }

  protected abstract StructuredTableAdmin getStructuredTableAdmin() throws Exception;
  protected abstract TransactionRunner getTransactionRunner() throws Exception;

  @Before
  public void init() throws Exception {
    getStructuredTableAdmin().create(SIMPLE_SPEC);
  }

  @After
  public void teardown() throws Exception {
    getStructuredTableAdmin().drop(SIMPLE_TABLE);
  }

  @Test
  public void testMultipleKeyScan() throws Exception {
    int max = 10;
    // Write rows and read them, the rows will have keys (0, 0L), (2, 2L), ..., (9, 9L)
    List<Collection<Field<?>>> expected = writeSimpleStructuredRows(max, "");
    List<Collection<Field<?>>> actual = readSimpleStructuredRows(max);
    Assert.assertEquals(expected, actual);

    // scan from (1, 8L) inclusive to (3, 3L) inclusive, should return (2, 2L) and (3, 3L)
    actual = scanSimpleStructuredRows(
      Range.create(ImmutableList.of(Fields.intField(KEY, 1),
                                    Fields.longField(KEY2, 8L)), Range.Bound.INCLUSIVE,
                   ImmutableList.of(Fields.intField(KEY, 3),
                                    Fields.longField(KEY2, 3L)), Range.Bound.INCLUSIVE), max);
    Assert.assertEquals(expected.subList(2, 4), actual);

    // scan from (1, 8L) inclusive to (3, 3L) exclusive, should only return (2, 2L)
    actual = scanSimpleStructuredRows(
      Range.create(ImmutableList.of(Fields.intField(KEY, 1),
                                    Fields.longField(KEY2, 8L)), Range.Bound.INCLUSIVE,
                   ImmutableList.of(Fields.intField(KEY, 3),
                                    Fields.longField(KEY2, 3L)), Range.Bound.EXCLUSIVE), max);
    Assert.assertEquals(expected.subList(2, 3), actual);
  }

  @Test
  public void testSimpleReadWriteDelete() throws Exception {
    int max = 10;

    // No rows to read before any write
    List<Collection<Field<?>>> actual = readSimpleStructuredRows(max);
    Assert.assertEquals(Collections.emptyList(), actual);

    // Write rows and read them
    List<Collection<Field<?>>> expected = writeSimpleStructuredRows(max, "");
    actual = readSimpleStructuredRows(max);
    Assert.assertEquals(expected, actual);

    // Delete all the rows and verify
    deleteSimpleStructuredRows(max);
    actual = readSimpleStructuredRows(max);
    Assert.assertEquals(Collections.emptyList(), actual);
  }

  @Test
  public void testSimpleScan() throws Exception {
    int max = 100;

    List<Collection<Field<?>>> expected = writeSimpleStructuredRows(max, "");

    List<Collection<Field<?>>> actual =
      scanSimpleStructuredRows(
        Range.create(Collections.singleton(Fields.intField(KEY, 5)), Range.Bound.INCLUSIVE,
                     Collections.singleton(Fields.intField(KEY, 15)), Range.Bound.EXCLUSIVE), max);
    Assert.assertEquals(expected.subList(5, 15), actual);

    actual =
      scanSimpleStructuredRows(
        Range.create(Collections.singleton(Fields.intField(KEY, 5)), Range.Bound.EXCLUSIVE,
                     Collections.singleton(Fields.intField(KEY, 15)), Range.Bound.INCLUSIVE), max);

    Assert.assertEquals(expected.subList(6, 16), actual);

    actual = scanSimpleStructuredRows(
      Range.singleton(Collections.singleton(Fields.intField(KEY, 46))), max);
    Assert.assertEquals(expected.subList(46, 47), actual);

    // TODO: test invalid range
    // TODO: test begin only range
    // TODO: test end only range
  }

  @Test
  public void testSimpleUpdate() throws Exception {
    int max = 10;
    // write to table and read
    List<Collection<Field<?>>> expected = writeSimpleStructuredRows(max, "");
    List<Collection<Field<?>>> actual = readSimpleStructuredRows(max);
    Assert.assertEquals(expected, actual);

    // update the same row keys with different value
    expected = writeSimpleStructuredRows(max, "newVal");
    actual = readSimpleStructuredRows(max);
    Assert.assertEquals(expected, actual);
  }

  @Test
  public void testCompareAndSwap() throws Exception {
    // Write a record
    int max = 1;
    List<Collection<Field<?>>> fields = writeSimpleStructuredRows(max, "");
    Assert.assertEquals(max, fields.size());

    Map<String, Field<?>> oldValues = new HashMap<>();
    for (Field<?> field : fields.get(0)) {
      oldValues.put(field.getName(), field);
    }
    oldValues.put(LONG_COL, Fields.longField(LONG_COL, null));

    Map<String, Field<?>> newValues = ImmutableMap.of(
      STRING_COL, Fields.stringField(STRING_COL, VAL + 100),
      DOUBLE_COL, Fields.doubleField(DOUBLE_COL, 100.0),
      FLOAT_COL, Fields.floatField(FLOAT_COL, 10.0f),
      BYTES_COL, Fields.bytesField(BYTES_COL, Bytes.toBytes("new-bytes")),
      LONG_COL, Fields.longField(LONG_COL, 500L)
    );

    // Compare and swap an existing row
    Collection<Field<?>> keys = Arrays.asList(oldValues.get(KEY), oldValues.get(KEY2));
    for (Map.Entry<String, Field<?>> newField : newValues.entrySet()) {
      getTransactionRunner().run(context -> {
        StructuredTable table = context.getTable(SIMPLE_TABLE);
        boolean result = table.compareAndSwap(keys, oldValues.get(newField.getKey()), newField.getValue());
        Assert.assertTrue(result);
      });
    }

    // Compare and swap of a wrong old value should return false
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      boolean result = table.compareAndSwap(keys, oldValues.get(STRING_COL), Fields.stringField(STRING_COL, "invalid"));
      Assert.assertFalse(result);
    });

    Collection<Field<?>> expected = ImmutableSet.copyOf(Iterables.concat(newValues.values(), keys));
    List<Collection<Field<?>>> actual = readSimpleStructuredRows(max, ImmutableList.of(LONG_COL));
    Assert.assertEquals(expected, ImmutableSet.copyOf(actual.get(0)));

    // Compare and swap on primary key should fail
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      try {
        table.compareAndSwap(keys, Fields.intField(KEY, 1), Fields.intField(KEY, 5));
        Assert.fail("Expected IllegalArgumentException since primary key column cannot be swapped");
      } catch (IllegalArgumentException e) {
        // Expected
      }
    });
  }

  @Test
  public void testCompareAndSwapNonExistent() throws Exception {
    // Compare and swap a non-existent row
    Collection<Field<?>> nonExistentKeys = Arrays.asList(Fields.intField(KEY, -100), Fields.longField(KEY2, -10L));

    // Verify row does not exist first
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      Optional<StructuredRow> row = table.read(nonExistentKeys);
      Assert.assertFalse(row.isPresent());
    });

    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      boolean result = table.compareAndSwap(nonExistentKeys,
                                            Fields.stringField(STRING_COL, "non-existent"),
                                            Fields.stringField(STRING_COL, "new-val"));
      Assert.assertFalse(result);
      result = table.compareAndSwap(nonExistentKeys,
                                    Fields.stringField(STRING_COL, null),
                                    Fields.stringField(STRING_COL, "new-val"));
      Assert.assertTrue(result);
    });

    // Read and verify
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      Optional<StructuredRow> row = table.read(nonExistentKeys);
      Assert.assertTrue(row.isPresent());
      Assert.assertEquals("new-val", row.get().getString(STRING_COL));
    });
  }

  @Test
  public void testIncrement() throws Exception {
    // Write a record
    Collection<Field<?>> keys = Arrays.asList(Fields.intField(KEY, 100), Fields.longField(KEY2, 200L));
    Field<?> longField = Fields.longField(LONG_COL, 100L);
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      Collection<Field<?>> fields = new ArrayList<>(keys);
      fields.add(longField);
      table.upsert(fields);
    });

    // Verify write
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      Optional<StructuredRow> rowOptional = table.read(keys);
      Assert.assertTrue(rowOptional.isPresent());
      Assert.assertEquals(longField.getValue(), rowOptional.get().getLong(LONG_COL));
    });

    // Increment
    long increment = 30;
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      table.increment(keys, longField.getName(), increment);
      try {
        table.increment(keys, FLOAT_COL, increment);
        Assert.fail("Expected IllegalArgumentException since only long columns can be incremented");
      } catch (IllegalArgumentException e) {
        // Expected, see the exception message above
      }
    });

    // Verify increment
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      Optional<StructuredRow> rowOptional = table.read(keys);
      Assert.assertTrue(rowOptional.isPresent());
      //noinspection ConstantConditions
      Assert.assertEquals(((Long) longField.getValue()) + increment, (long) rowOptional.get().getLong(LONG_COL));
    });

    // Increment on primary key should fail
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      try {
        table.increment(keys, KEY2, increment);
        Assert.fail("Expected IllegalArgumentException since primary key column cannot be incremented");
      } catch (IllegalArgumentException e) {
        // Expected
      }
    });
  }

  private List<Collection<Field<?>>> writeSimpleStructuredRows(int max, String suffix) throws Exception {
    List<Collection<Field<?>>> expected = new ArrayList<>(max);
    for (int i = 0; i < max; i++) {
      List<Field<?>> fields = Arrays.asList(Fields.intField(KEY, i),
                                            Fields.longField(KEY2, (long) i),
                                            Fields.stringField(STRING_COL, VAL + i + suffix),
                                            Fields.doubleField(DOUBLE_COL, (double) i),
                                            Fields.floatField(FLOAT_COL, (float) i),
                                            Fields.bytesField(BYTES_COL, Bytes.toBytes("bytes-" + i)));
      expected.add(fields);

      getTransactionRunner().run(context -> {
        StructuredTable table = context.getTable(SIMPLE_TABLE);
        table.upsert(fields);
      });
    }
    return expected;
  }

  private List<Collection<Field<?>>> readSimpleStructuredRows(int max) throws Exception {
    return readSimpleStructuredRows(max, ImmutableList.of());
  }

  private List<Collection<Field<?>>> readSimpleStructuredRows(int max, List<String> extraColumns) throws Exception {
    List<String> columns = new ArrayList<>(ImmutableList.of(STRING_COL, DOUBLE_COL, FLOAT_COL, BYTES_COL));
    columns.addAll(extraColumns);

    List<String> fields = new ArrayList<>(ImmutableSet.of(KEY, KEY2, STRING_COL, DOUBLE_COL, FLOAT_COL, BYTES_COL));
    fields.addAll(extraColumns);

    List<Collection<Field<?>>> actual = new ArrayList<>(max);
    for (int i = 0; i < max; i++) {
      Field<Integer> key = Fields.intField(KEY, i);
      Field<Long> key2 = Fields.longField(KEY2, (long) i);
      final AtomicReference<Optional<StructuredRow>> rowRef = new AtomicReference<>();

      getTransactionRunner().run(context -> {
        StructuredTable table = context.getTable(SIMPLE_TABLE);
        rowRef.set(table.read(ImmutableList.of(key, key2), columns));
      });

      Optional<StructuredRow> row = rowRef.get();
      row.ifPresent(
        structuredRow -> actual.add(
          convertRowToFields(structuredRow, fields)));
    }
    return actual;
  }

  private List<Field<?>> convertRowToFields(StructuredRow row, List<String> columns) {
    List<Field<?>> fields = new ArrayList<>();
    for (String name : columns) {
      FieldType.Type type = SIMPLE_SCHEMA.getType(name);
      if (type == null) {
        throw new InvalidFieldException(SIMPLE_TABLE, name);
      }
      switch (type) {
        case BYTES:
          fields.add(Fields.bytesField(name, row.getBytes(name)));
          break;
        case STRING:
          fields.add(Fields.stringField(name, row.getString(name)));
          break;
        case FLOAT:
          fields.add(Fields.floatField(name, row.getFloat(name)));
          break;
        case DOUBLE:
          fields.add(Fields.doubleField(name, row.getDouble(name)));
          break;
        case INTEGER:
          fields.add(Fields.intField(name, row.getInteger(name)));
          break;
        case LONG:
          fields.add(Fields.longField(name, row.getLong(name)));
          break;
      }
    }
    return fields;
  }

  private void deleteSimpleStructuredRows(int max) throws Exception {
    for (int i = 0; i < max; i++) {
      Field<Integer> key = Fields.intField(KEY, i);
      Field<Long> key2 = Fields.longField(KEY2, (long) i);

      getTransactionRunner().run(context -> {
        StructuredTable table = context.getTable(SIMPLE_TABLE);
        table.delete(ImmutableList.of(key, key2));
      });
    }
  }

  private List<Collection<Field<?>>> scanSimpleStructuredRows(Range range, int max) throws Exception {
    List<Collection<Field<?>>> actual = new ArrayList<>(max);
    getTransactionRunner().run(context -> {
      StructuredTable table = context.getTable(SIMPLE_TABLE);
      try (CloseableIterator<StructuredRow> iterator = table.scan(range, max)) {
        while (iterator.hasNext()) {
          StructuredRow row = iterator.next();
          actual.add(Arrays.asList(Fields.intField(KEY, row.getInteger(KEY)),
                                   Fields.longField(KEY2, row.getLong(KEY2)),
                                   Fields.stringField(STRING_COL, row.getString(STRING_COL)),
                                   Fields.doubleField(DOUBLE_COL, row.getDouble(DOUBLE_COL)),
                                   Fields.floatField(FLOAT_COL, row.getFloat(FLOAT_COL)),
                                   Fields.bytesField(BYTES_COL, row.getBytes(BYTES_COL))));
        }
      }
    });
    return actual;
  }
}
