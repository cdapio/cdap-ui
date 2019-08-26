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

package io.cdap.cdap.data2.transaction.messaging.coprocessor.hbase12cdh570;

import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.filter.Filter;
import org.apache.hadoop.hbase.regionserver.InternalScanner;
import org.apache.hadoop.hbase.regionserver.ScannerContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of {@link InternalScanner} that filter out {@link Cell} based on a given {@link Filter}.
 */
public class FilterInternalScanner implements InternalScanner {

  private final InternalScanner delegate;
  private final Filter filter;

  public FilterInternalScanner(InternalScanner delegate, Filter filter) {
    this.delegate = delegate;
    this.filter = filter;
  }

  @Override
  public boolean next(List<Cell> result, ScannerContext scannerContext) throws IOException {
    if (filter.filterAllRemaining()) {
      return false;
    }
    while (true) {
      List<Cell> outResult = new ArrayList<>();
      boolean next = delegate.next(outResult, scannerContext);
      for (Cell cell : outResult) {
        Filter.ReturnCode code = filter.filterCell(cell);
        switch (code) {
          // included, so we are done
          case INCLUDE:
          case INCLUDE_AND_NEXT_COL:
            result.add(cell);
            break;
          case SKIP:
          case NEXT_COL:
          case NEXT_ROW:
          default:
            break;
        }
      }
      if (!next) {
        return false;
      }
      if (!result.isEmpty()) {
        return true;
      }
    }
  }

  @Override
  public void close() throws IOException {
    delegate.close();
  }
}
