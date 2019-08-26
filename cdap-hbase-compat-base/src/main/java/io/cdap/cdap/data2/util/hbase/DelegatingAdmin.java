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

package io.cdap.cdap.data2.util.hbase;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.ClusterStatus;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HRegionInfo;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.NamespaceDescriptor;
import org.apache.hadoop.hbase.ServerName;
import org.apache.hadoop.hbase.TableExistsException;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.TableNotFoundException;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.ipc.CoprocessorRpcChannel;
import org.apache.hadoop.hbase.protobuf.generated.AdminProtos;
import org.apache.hadoop.hbase.protobuf.generated.HBaseProtos;
import org.apache.hadoop.hbase.protobuf.generated.MasterProtos;
import org.apache.hadoop.hbase.regionserver.wal.FailedLogCloseException;
import org.apache.hadoop.hbase.snapshot.HBaseSnapshotException;
import org.apache.hadoop.hbase.snapshot.RestoreSnapshotException;
import org.apache.hadoop.hbase.snapshot.SnapshotCreationException;
import org.apache.hadoop.hbase.snapshot.UnknownSnapshotException;
import org.apache.hadoop.hbase.util.Pair;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 *
 */
public class DelegatingAdmin implements Admin {

  private final Admin delegate;

  public DelegatingAdmin(Admin delegate) {
    this.delegate = delegate;
  }

  public Admin getDelegate() {
    return delegate;
  }

  @Override
  public int getOperationTimeout() {
    return getDelegate().getOperationTimeout();
  }

  @Override
  public void abort(String why, Throwable e) {
    getDelegate().abort(why, e);
  }

  @Override
  public boolean isAborted() {
    return getDelegate().isAborted();
  }

  @Override
  public Connection getConnection() {
    return getDelegate().getConnection();
  }

  @Override
  public boolean tableExists(TableName tableName) throws IOException {
    return getDelegate().tableExists(tableName);
  }

  @Override
  public HTableDescriptor[] listTables() throws IOException {
    return getDelegate().listTables();
  }

  @Override
  public HTableDescriptor[] listTables(Pattern pattern) throws IOException {
    return getDelegate().listTables(pattern);
  }

  @Override
  public HTableDescriptor[] listTables(String regex) throws IOException {
    return getDelegate().listTables(regex);
  }

  @Override
  public HTableDescriptor[] listTables(Pattern pattern, boolean includeSysTables) throws IOException {
    return getDelegate().listTables(pattern, includeSysTables);
  }

  @Override
  public HTableDescriptor[] listTables(String regex, boolean includeSysTables) throws IOException {
    return getDelegate().listTables(regex, includeSysTables);
  }

  @Override
  public TableName[] listTableNames() throws IOException {
    return getDelegate().listTableNames();
  }

  @Override
  public TableName[] listTableNames(Pattern pattern) throws IOException {
    return getDelegate().listTableNames(pattern);
  }

  @Override
  public TableName[] listTableNames(String regex) throws IOException {
    return getDelegate().listTableNames(regex);
  }

  @Override
  public TableName[] listTableNames(Pattern pattern, boolean includeSysTables) throws IOException {
    return getDelegate().listTableNames(pattern, includeSysTables);
  }

  @Override
  public TableName[] listTableNames(String regex, boolean includeSysTables) throws IOException {
    return getDelegate().listTableNames(regex, includeSysTables);
  }

  @Override
  public HTableDescriptor getTableDescriptor(TableName tableName) throws TableNotFoundException, IOException {
    return getDelegate().getTableDescriptor(tableName);
  }

  @Override
  public void createTable(HTableDescriptor desc) throws IOException {
    getDelegate().createTable(desc);
  }

  @Override
  public void createTable(HTableDescriptor desc, byte[] startKey, byte[] endKey, int numRegions) throws IOException {
    getDelegate().createTable(desc, startKey, endKey, numRegions);
  }

  @Override
  public void createTable(HTableDescriptor desc, byte[][] splitKeys) throws IOException {
    getDelegate().createTable(desc, splitKeys);
  }

  @Override
  public void createTableAsync(HTableDescriptor desc, byte[][] splitKeys) throws IOException {
    getDelegate().createTableAsync(desc, splitKeys);
  }

  @Override
  public void deleteTable(TableName tableName) throws IOException {
    getDelegate().deleteTable(tableName);
  }

  @Override
  public HTableDescriptor[] deleteTables(String regex) throws IOException {
    return getDelegate().deleteTables(regex);
  }

  @Override
  public HTableDescriptor[] deleteTables(Pattern pattern) throws IOException {
    return getDelegate().deleteTables(pattern);
  }

  @Override
  public void truncateTable(TableName tableName, boolean preserveSplits) throws IOException {
    getDelegate().truncateTable(tableName, preserveSplits);
  }

  @Override
  public void enableTable(TableName tableName) throws IOException {
    getDelegate().enableTable(tableName);
  }

  @Override
  public void enableTableAsync(TableName tableName) throws IOException {
    getDelegate().enableTableAsync(tableName);
  }

  @Override
  public HTableDescriptor[] enableTables(String regex) throws IOException {
    return getDelegate().enableTables(regex);
  }

  @Override
  public HTableDescriptor[] enableTables(Pattern pattern) throws IOException {
    return getDelegate().enableTables(pattern);
  }

  @Override
  public void disableTableAsync(TableName tableName) throws IOException {
    getDelegate().disableTableAsync(tableName);
  }

  @Override
  public void disableTable(TableName tableName) throws IOException {
    getDelegate().disableTable(tableName);
  }

  @Override
  public HTableDescriptor[] disableTables(String regex) throws IOException {
    return getDelegate().disableTables(regex);
  }

  @Override
  public HTableDescriptor[] disableTables(Pattern pattern) throws IOException {
    return getDelegate().disableTables(pattern);
  }

  @Override
  public boolean isTableEnabled(TableName tableName) throws IOException {
    return getDelegate().isTableEnabled(tableName);
  }

  @Override
  public boolean isTableDisabled(TableName tableName) throws IOException {
    return getDelegate().isTableDisabled(tableName);
  }

  @Override
  public boolean isTableAvailable(TableName tableName) throws IOException {
    return getDelegate().isTableAvailable(tableName);
  }

  @Override
  public boolean isTableAvailable(TableName tableName, byte[][] splitKeys) throws IOException {
    return getDelegate().isTableAvailable(tableName, splitKeys);
  }

  @Override
  public Pair<Integer, Integer> getAlterStatus(TableName tableName) throws IOException {
    return getDelegate().getAlterStatus(tableName);
  }

  @Override
  public Pair<Integer, Integer> getAlterStatus(byte[] tableName) throws IOException {
    return getDelegate().getAlterStatus(tableName);
  }

  @Override
  public void addColumn(TableName tableName, HColumnDescriptor column) throws IOException {
    getDelegate().addColumn(tableName, column);
  }

  @Override
  public void deleteColumn(TableName tableName, byte[] columnName) throws IOException {
    getDelegate().deleteColumn(tableName, columnName);
  }

  @Override
  public void modifyColumn(TableName tableName, HColumnDescriptor descriptor) throws IOException {
    getDelegate().modifyColumn(tableName, descriptor);
  }

  @Override
  public void closeRegion(String regionname, String serverName) throws IOException {
    getDelegate().closeRegion(regionname, serverName);
  }

  @Override
  public void closeRegion(byte[] regionname, String serverName) throws IOException {
    getDelegate().closeRegion(regionname, serverName);
  }

  @Override
  public boolean closeRegionWithEncodedRegionName(String encodedRegionName, String serverName) throws IOException {
    return getDelegate().closeRegionWithEncodedRegionName(encodedRegionName, serverName);
  }

  @Override
  public void closeRegion(ServerName sn, HRegionInfo hri) throws IOException {
    getDelegate().closeRegion(sn, hri);
  }

  @Override
  public List<HRegionInfo> getOnlineRegions(ServerName sn) throws IOException {
    return getDelegate().getOnlineRegions(sn);
  }

  @Override
  public void flush(TableName tableName) throws IOException {
    getDelegate().flush(tableName);
  }

  @Override
  public void flushRegion(byte[] regionName) throws IOException {
    getDelegate().flushRegion(regionName);
  }

  @Override
  public void compact(TableName tableName) throws IOException {
    getDelegate().compact(tableName);
  }

  @Override
  public void compactRegion(byte[] regionName) throws IOException {
    getDelegate().compactRegion(regionName);
  }

  @Override
  public void compact(TableName tableName, byte[] columnFamily) throws IOException {
    getDelegate().compact(tableName, columnFamily);
  }

  @Override
  public void compactRegion(byte[] regionName, byte[] columnFamily) throws IOException {
    getDelegate().compactRegion(regionName, columnFamily);
  }

  @Override
  public void majorCompact(TableName tableName) throws IOException {
    getDelegate().majorCompact(tableName);
  }

  @Override
  public void majorCompactRegion(byte[] regionName) throws IOException {
    getDelegate().majorCompactRegion(regionName);
  }

  @Override
  public void majorCompact(TableName tableName, byte[] columnFamily) throws IOException {
    getDelegate().majorCompact(tableName, columnFamily);
  }

  @Override
  public void majorCompactRegion(byte[] regionName, byte[] columnFamily) throws IOException {
    getDelegate().majorCompactRegion(regionName, columnFamily);
  }

  @Override
  public void compactRegionServer(ServerName sn, boolean major) throws IOException, InterruptedException {
    getDelegate().compactRegionServer(sn, major);
  }

  @Override
  public void move(byte[] encodedRegionName, byte[] destServerName) throws IOException {
    getDelegate().move(encodedRegionName, destServerName);
  }

  @Override
  public void assign(byte[] regionName) throws IOException {
    getDelegate().assign(regionName);
  }

  @Override
  public void unassign(byte[] regionName, boolean force) throws IOException {
    getDelegate().unassign(regionName, force);
  }

  @Override
  public void offline(byte[] regionName) throws IOException {
    getDelegate().offline(regionName);
  }

  @Override
  public boolean setBalancerRunning(boolean on, boolean synchronous) throws IOException {
    return getDelegate().setBalancerRunning(on, synchronous);
  }

  @Override
  public boolean balancer() throws IOException {
    return getDelegate().balancer();
  }

  @Override
  public boolean enableCatalogJanitor(boolean enable) throws IOException {
    return getDelegate().enableCatalogJanitor(enable);
  }

  @Override
  public int runCatalogScan() throws IOException {
    return getDelegate().runCatalogScan();
  }

  @Override
  public boolean isCatalogJanitorEnabled() throws IOException {
    return getDelegate().isCatalogJanitorEnabled();
  }

  @Override
  public void mergeRegions(byte[] encodedNameOfRegionA,
                           byte[] encodedNameOfRegionB, boolean forcible) throws IOException {
    getDelegate().mergeRegions(encodedNameOfRegionA, encodedNameOfRegionB, forcible);
  }

  @Override
  public void split(TableName tableName) throws IOException {
    getDelegate().split(tableName);
  }

  @Override
  public void splitRegion(byte[] regionName) throws IOException {
    getDelegate().splitRegion(regionName);
  }

  @Override
  public void split(TableName tableName, byte[] splitPoint) throws IOException {
    getDelegate().split(tableName, splitPoint);
  }

  @Override
  public void splitRegion(byte[] regionName, byte[] splitPoint) throws IOException {
    getDelegate().splitRegion(regionName, splitPoint);
  }

  @Override
  public void modifyTable(TableName tableName, HTableDescriptor htd) throws IOException {
    getDelegate().modifyTable(tableName, htd);
  }

  @Override
  public void shutdown() throws IOException {
    getDelegate().shutdown();
  }

  @Override
  public void stopMaster() throws IOException {
    getDelegate().stopMaster();
  }

  @Override
  public void stopRegionServer(String hostnamePort) throws IOException {
    getDelegate().stopRegionServer(hostnamePort);
  }

  @Override
  public ClusterStatus getClusterStatus() throws IOException {
    return getDelegate().getClusterStatus();
  }

  @Override
  public Configuration getConfiguration() {
    return getDelegate().getConfiguration();
  }

  @Override
  public void createNamespace(NamespaceDescriptor descriptor) throws IOException {
    getDelegate().createNamespace(descriptor);
  }

  @Override
  public void modifyNamespace(NamespaceDescriptor descriptor) throws IOException {
    getDelegate().modifyNamespace(descriptor);
  }

  @Override
  public void deleteNamespace(String name) throws IOException {
    getDelegate().deleteNamespace(name);
  }

  @Override
  public NamespaceDescriptor getNamespaceDescriptor(String name) throws IOException {
    return getDelegate().getNamespaceDescriptor(name);
  }

  @Override
  public NamespaceDescriptor[] listNamespaceDescriptors() throws IOException {
    return getDelegate().listNamespaceDescriptors();
  }

  @Override
  public HTableDescriptor[] listTableDescriptorsByNamespace(String name) throws IOException {
    return getDelegate().listTableDescriptorsByNamespace(name);
  }

  @Override
  public TableName[] listTableNamesByNamespace(String name) throws IOException {
    return getDelegate().listTableNamesByNamespace(name);
  }

  @Override
  public List<HRegionInfo> getTableRegions(TableName tableName) throws IOException {
    return getDelegate().getTableRegions(tableName);
  }

  @Override
  public void close() throws IOException {
    getDelegate().close();
  }

  @Override
  public HTableDescriptor[] getTableDescriptorsByTableName(List<TableName> tableNames) throws IOException {
    return getDelegate().getTableDescriptorsByTableName(tableNames);
  }

  @Override
  public HTableDescriptor[] getTableDescriptors(List<String> names) throws IOException {
    return getDelegate().getTableDescriptors(names);
  }

  @Override
  public void rollWALWriter(ServerName serverName) throws IOException, FailedLogCloseException {
    getDelegate().rollWALWriter(serverName);
  }

  @Override
  public String[] getMasterCoprocessors() throws IOException {
    return getDelegate().getMasterCoprocessors();
  }

  @Override
  public AdminProtos.GetRegionInfoResponse.CompactionState getCompactionState(TableName tableName)
    throws IOException {
    return getDelegate().getCompactionState(tableName);
  }

  @Override
  public AdminProtos.GetRegionInfoResponse.CompactionState getCompactionStateForRegion(byte[] regionName)
    throws IOException {
    return getDelegate().getCompactionStateForRegion(regionName);
  }

  @Override
  public void snapshot(String snapshotName,
                       TableName tableName) throws IOException, SnapshotCreationException, IllegalArgumentException {
    getDelegate().snapshot(snapshotName, tableName);
  }

  @Override
  public void snapshot(byte[] snapshotName,
                       TableName tableName) throws IOException, SnapshotCreationException, IllegalArgumentException {
    getDelegate().snapshot(snapshotName, tableName);
  }

  @Override
  public void snapshot(String snapshotName, TableName tableName, HBaseProtos.SnapshotDescription.Type type)
    throws IOException, SnapshotCreationException, IllegalArgumentException {
    getDelegate().snapshot(snapshotName, tableName, type);
  }

  @Override
  public void snapshot(HBaseProtos.SnapshotDescription snapshot)
    throws IOException, SnapshotCreationException, IllegalArgumentException {
    getDelegate().snapshot(snapshot);
  }

  @Override
  public MasterProtos.SnapshotResponse takeSnapshotAsync(HBaseProtos.SnapshotDescription snapshot)
    throws IOException, SnapshotCreationException {
    return getDelegate().takeSnapshotAsync(snapshot);
  }

  @Override
  public boolean isSnapshotFinished(HBaseProtos.SnapshotDescription snapshot)
    throws IOException, HBaseSnapshotException, UnknownSnapshotException {
    return getDelegate().isSnapshotFinished(snapshot);
  }

  @Override
  public void restoreSnapshot(byte[] snapshotName) throws IOException, RestoreSnapshotException {
    getDelegate().restoreSnapshot(snapshotName);
  }

  @Override
  public void restoreSnapshot(String snapshotName) throws IOException, RestoreSnapshotException {
    getDelegate().restoreSnapshot(snapshotName);
  }

  @Override
  public void restoreSnapshot(byte[] snapshotName, boolean takeFailSafeSnapshot)
    throws IOException, RestoreSnapshotException {
    getDelegate().restoreSnapshot(snapshotName, takeFailSafeSnapshot);
  }

  @Override
  public void restoreSnapshot(String snapshotName, boolean takeFailSafeSnapshot)
    throws IOException, RestoreSnapshotException {
    getDelegate().restoreSnapshot(snapshotName, takeFailSafeSnapshot);
  }

  @Override
  public void cloneSnapshot(byte[] snapshotName, TableName tableName)
    throws IOException, TableExistsException, RestoreSnapshotException {
    getDelegate().cloneSnapshot(snapshotName, tableName);
  }

  @Override
  public void cloneSnapshot(String snapshotName, TableName tableName)
    throws IOException, TableExistsException, RestoreSnapshotException {
    getDelegate().cloneSnapshot(snapshotName, tableName);
  }

  @Override
  public void execProcedure(String signature, String instance, Map<String, String> props) throws IOException {
    getDelegate().execProcedure(signature, instance, props);
  }

  @Override
  public byte[] execProcedureWithRet(String signature, String instance, Map<String, String> props) throws IOException {
    return getDelegate().execProcedureWithRet(signature, instance, props);
  }

  @Override
  public boolean isProcedureFinished(String signature, String instance, Map<String, String> props) throws IOException {
    return getDelegate().isProcedureFinished(signature, instance, props);
  }

  @Override
  public List<HBaseProtos.SnapshotDescription> listSnapshots() throws IOException {
    return getDelegate().listSnapshots();
  }

  @Override
  public List<HBaseProtos.SnapshotDescription> listSnapshots(String regex) throws IOException {
    return getDelegate().listSnapshots(regex);
  }

  @Override
  public List<HBaseProtos.SnapshotDescription> listSnapshots(Pattern pattern) throws IOException {
    return getDelegate().listSnapshots(pattern);
  }

  @Override
  public void deleteSnapshot(byte[] snapshotName) throws IOException {
    getDelegate().deleteSnapshot(snapshotName);
  }

  @Override
  public void deleteSnapshot(String snapshotName) throws IOException {
    getDelegate().deleteSnapshot(snapshotName);
  }

  @Override
  public void deleteSnapshots(String regex) throws IOException {
    getDelegate().deleteSnapshots(regex);
  }

  @Override
  public void deleteSnapshots(Pattern pattern) throws IOException {
    getDelegate().deleteSnapshots(pattern);
  }

  @Override
  public CoprocessorRpcChannel coprocessorService() {
    return getDelegate().coprocessorService();
  }

  @Override
  public CoprocessorRpcChannel coprocessorService(ServerName sn) {
    return getDelegate().coprocessorService(sn);
  }

  @Override
  public void updateConfiguration(ServerName server) throws IOException {
    getDelegate().updateConfiguration(server);
  }

  @Override
  public void updateConfiguration() throws IOException {
    getDelegate().updateConfiguration();
  }

  @Override
  public int getMasterInfoPort() throws IOException {
    return getDelegate().getMasterInfoPort();
  }
}
