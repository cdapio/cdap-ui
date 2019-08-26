/*
 * Copyright © 2015 Cask Data, Inc.
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

package io.cdap.cdap.data.hbase;

import com.google.common.base.Function;
import com.google.common.base.Throwables;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseTestingUtility;
import org.apache.hadoop.hbase.MiniHBaseCluster;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.regionserver.HRegion;
import org.apache.hadoop.hbase.regionserver.Region;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.hbase.util.JVMClusterUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * {@link HBaseTestBase} implementation supporting HBase 1.1.
 */
public class HBase11Test extends HBaseTestBase {
  private static final Logger LOG = LoggerFactory.getLogger(HBase11Test.class);

  protected HBaseTestingUtility testUtil = new HBaseTestingUtility();

  @Override
  public Configuration getConfiguration() {
    return testUtil.getConfiguration();
  }

  @Override
  public int getZKClientPort() {
    return testUtil.getZkCluster().getClientPort();
  }

  @Override
  public void doStartHBase() throws Exception {
    testUtil.startMiniCluster();
  }

  @Override
  public void stopHBase() throws Exception {
    testUtil.shutdownMiniCluster();
  }

  @Override
  public MiniHBaseCluster getHBaseCluster() {
    return testUtil.getHBaseCluster();
  }

  @Override
  public <T> Map<byte[], T> forEachRegion(byte[] tableName, Function<HRegion, T> function) {
    MiniHBaseCluster hbaseCluster = getHBaseCluster();
    Map<byte[], T> results = new TreeMap<>(Bytes.BYTES_COMPARATOR);
    // make sure consumer config cache is updated
    for (JVMClusterUtil.RegionServerThread t : hbaseCluster.getRegionServerThreads()) {
      List<Region> serverRegions = t.getRegionServer().getOnlineRegions(TableName.valueOf(tableName));
      for (Region region : serverRegions) {
        results.put(region.getRegionInfo().getRegionName(), function.apply((HRegion) region));
      }
    }
    return results;
  }

  @Override
  public void waitUntilTableAvailable(byte[] tableName, long timeoutInMillis)
      throws IOException, InterruptedException {
    testUtil.waitTableAvailable(tableName, timeoutInMillis);
    testUtil.waitUntilAllRegionsAssigned(TableName.valueOf(tableName), timeoutInMillis);
  }

  @Override
  public Runnable createFlushRegion(final HRegion region) {
    return new Runnable() {
      @Override
      public void run() {
        try {
          region.flushcache(true, false);
        } catch (IOException e) {
          throw Throwables.propagate(e);
        }
      }
    };
  }

  @Override
  public Runnable createCompactRegion(final HRegion region, final boolean majorCompact) {
    return new Runnable() {
      @Override
      public void run() {
        try {
          region.compact(majorCompact);
        } catch (IOException e) {
          throw Throwables.propagate(e);
        }
      }
    };
  }
}
