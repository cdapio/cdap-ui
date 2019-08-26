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
import io.cdap.cdap.replication.StatusUtils;
import org.apache.hadoop.hbase.CoprocessorEnvironment;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.coprocessor.RegionServerCoprocessor;
import org.apache.hadoop.hbase.coprocessor.RegionServerCoprocessorEnvironment;
import org.apache.hadoop.hbase.coprocessor.RegionServerObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Optional;

/**
 * HBase Coprocessor that tracks write time of the WAL entries successfully replicated to a Slave Cluster.
 * For each region the writeTime from the last WAL Entry replicated is updated to the REPLICATION_STATE table.
 */
public class LastReplicateTimeObserver implements RegionServerObserver, RegionServerCoprocessor {
  private HBase20TableUpdater hBase20TableUpdater = null;
  private static final Logger LOG = LoggerFactory.getLogger(LastReplicateTimeObserver.class);

  @Override
  public Optional<RegionServerObserver> getRegionServerObserver() {
    return Optional.of(this);
  }

  @Override
  public void start(CoprocessorEnvironment env) throws IOException {
    if (env instanceof RegionServerCoprocessorEnvironment) {
      RegionServerCoprocessorEnvironment observerEnv = (RegionServerCoprocessorEnvironment) env;
      LOG.info("LastReplicateTimeObserver Start received.");
      String tableName = StatusUtils.getReplicationStateTableName(env.getConfiguration());
      Table table = observerEnv.getConnection().getTable(TableName.valueOf(tableName));
      hBase20TableUpdater =
        new HBase20TableUpdater(ReplicationConstants.ReplicationStatusTool.REPLICATE_TIME_ROW_TYPE,
                                env.getConfiguration(), table);
    }
  }

  @Override
  public void stop(CoprocessorEnvironment env) throws IOException {
    LOG.info("LastReplicateTimeObserver Stop received.");
    hBase20TableUpdater.cancelTimer();
  }

  // TODO (CDAP-15791): The postReplicateLogEntries is no longer supported.
  // Need to rework on replication state in HBase 2.0.
}

