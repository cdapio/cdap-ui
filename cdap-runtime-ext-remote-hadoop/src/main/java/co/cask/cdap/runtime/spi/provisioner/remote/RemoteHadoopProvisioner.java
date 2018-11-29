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
 *
 */

package co.cask.cdap.runtime.spi.provisioner.remote;

import co.cask.cdap.runtime.spi.provisioner.Capabilities;
import co.cask.cdap.runtime.spi.provisioner.Cluster;
import co.cask.cdap.runtime.spi.provisioner.ClusterStatus;
import co.cask.cdap.runtime.spi.provisioner.Node;
import co.cask.cdap.runtime.spi.provisioner.PollingStrategies;
import co.cask.cdap.runtime.spi.provisioner.PollingStrategy;
import co.cask.cdap.runtime.spi.provisioner.Provisioner;
import co.cask.cdap.runtime.spi.provisioner.ProvisionerContext;
import co.cask.cdap.runtime.spi.provisioner.ProvisionerSpecification;
import co.cask.cdap.runtime.spi.ssh.SSHSession;
import com.google.common.base.Throwables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.ConnectException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * A provisioner that does not create or tear down clusters, but just uses an existing cluster.
 */
public class RemoteHadoopProvisioner implements Provisioner {

  private static final Logger LOG = LoggerFactory.getLogger(RemoteHadoopProvisioner.class);
  private static final ProvisionerSpecification SPEC = new ProvisionerSpecification(
    "remote-hadoop", "Remote Hadoop Provisioner",
    "Runs programs on a pre-existing Hadoop cluster. The cluster must contain compatible software, must not use "
      + "Kerberos, and must be accessible via ssh and https (ports 22 and 443).");

  @Override
  public ProvisionerSpecification getSpec() {
    return SPEC;
  }

  @Override
  public void validateProperties(Map<String, String> properties) {
    RemoteHadoopConf.fromProperties(properties);
  }

  @Override
  public void initializeCluster(ProvisionerContext context, Cluster cluster) throws Exception {
    RemoteHadoopConf conf = RemoteHadoopConf.fromProperties(context.getProperties());
    String initializationAction = conf.getInitializationAction();
    if (initializationAction != null && !initializationAction.isEmpty()) {
      try (SSHSession session = createSSHSession(context, getMasterExternalIp(cluster))) {
        LOG.debug("Initializing action: {}", initializationAction);
        String output = session.executeAndWait(initializationAction);
        LOG.debug("Initialization action completed: {}", output);
      }
    }

  }

  private SSHSession createSSHSession(ProvisionerContext provisionerContext, String host) throws IOException {
    try {
      return provisionerContext.getSSHContext().createSSHSession(host);
    } catch (IOException ioe) {
      if (Throwables.getRootCause(ioe) instanceof ConnectException) {
        throw new IOException(String.format(
          "Failed to connect to host %s. Ensure that firewall rules exist that allow ssh " +
            "on port 22.", host),
          ioe);
      }
      throw ioe;
    }
  }

  private String getMasterExternalIp(Cluster cluster) {
    Node masterNode = cluster.getNodes().stream()
      .filter(node -> Node.Type.MASTER == node.getType())
      .findFirst().orElseThrow(() ->
        new IllegalArgumentException("Cluster has no node of master type: " + cluster));

    String ip = masterNode.getIpAddress();
    if (ip == null) {
      throw new IllegalArgumentException(String.format("External IP is not defined for node '%s' in cluster %s",
        masterNode.getId(), cluster));
    }
    return ip;
  }

  @Override
  public Cluster createCluster(ProvisionerContext context) {
    RemoteHadoopConf conf = RemoteHadoopConf.fromProperties(context.getProperties());
    context.getSSHContext().setSSHKeyPair(conf.getKeyPair());
    Collection<Node> nodes = Collections.singletonList(new Node(conf.getHost(), Node.Type.MASTER, conf.getHost(),
                                                                0, Collections.emptyMap()));
    return new Cluster(conf.getHost(), ClusterStatus.RUNNING, nodes, Collections.emptyMap());
  }

  @Override
  public ClusterStatus getClusterStatus(ProvisionerContext context, Cluster cluster) {
    ClusterStatus status = cluster.getStatus();
    return status == ClusterStatus.DELETING ? ClusterStatus.NOT_EXISTS : status;
  }

  @Override
  public Cluster getClusterDetail(ProvisionerContext context, Cluster cluster) {
    return new Cluster(cluster, getClusterStatus(context, cluster));
  }

  @Override
  public void deleteCluster(ProvisionerContext context, Cluster cluster) {
    // no-op
  }

  @Override
  public PollingStrategy getPollingStrategy(ProvisionerContext context, Cluster cluster) {
    // shouldn't matter, as we won't ever poll.
    return PollingStrategies.fixedInterval(0, TimeUnit.SECONDS);
  }

  @Override
  public Capabilities getCapabilities() {
    return new Capabilities(Collections.unmodifiableSet(new HashSet<>(Arrays.asList("fileSet", "externalDataset"))));
  }
}
