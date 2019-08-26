/*
 * Copyright © 2017 Cask Data, Inc.
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

package io.cdap.cdap.data2.replication;

import io.cdap.cdap.replication.ReplicationConstants;
import io.cdap.cdap.replication.TableUpdater;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.CoprocessorEnvironment;
import org.apache.hadoop.hbase.coprocessor.WALCoprocessor;
import org.apache.hadoop.hbase.coprocessor.WALObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

/**
 * HBase coprocessor that tracks WAL writes for all tables to track replication status.
 * For each region the writeTime of the last WAL entry is written to the REPLICATION_STATE table.
 */
public class LastWriteTimeObserver implements WALObserver, WALCoprocessor {
  private TableUpdater hBase20TableUpdater = null;
  private static final Logger LOG = LoggerFactory.getLogger(LastWriteTimeObserver.class);

  @Override
  public Optional<WALObserver> getWALObserver() {
    return Optional.of(this);
  }

  @Override
  public void start(CoprocessorEnvironment env) {
    LOG.info("LastWriteTimeObserver Start received.");
    hBase20TableUpdater = new TableUpdater(ReplicationConstants.ReplicationStatusTool.WRITE_TIME_ROW_TYPE,
                                           env.getConfiguration()) {

      @Override
      protected void writeState(Map<String, Long> cachedUpdates) {
        // no-op
      }

      @Override
      protected void createTableIfNotExists(Configuration conf) {
        // no-op
      }
    };
  }

  @Override
  public void stop(CoprocessorEnvironment e) throws IOException {
    LOG.info("LastWriteTimeObserver Stop received.");
    hBase20TableUpdater.cancelTimer();
  }

  // TODO (CDAP-15791): The postWALWrite is no longer supported the operations needed by table updater
  // Need to rework on replication state in HBase 2.0.
}
