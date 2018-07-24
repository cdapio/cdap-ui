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

import co.cask.cdap.runtime.spi.ssh.SSHKeyPair;
import co.cask.cdap.runtime.spi.ssh.SSHPublicKey;

import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Configuration for the Remote Hadoop provisioner.
 */
public class RemoteHadoopConf {
  private final SSHKeyPair sshKeyPair;
  private final String host;

  private RemoteHadoopConf(SSHKeyPair sshKeyPair, String host) {
    this.sshKeyPair = sshKeyPair;
    this.host = host;
  }

  public SSHKeyPair getKeyPair() {
    return sshKeyPair;
  }

  public String getHost() {
    return host;
  }

  /**
   * Create the conf from a property map while also performing validation.
   */
  public static RemoteHadoopConf fromProperties(Map<String, String> properties) {
    String host = getString(properties, "host");
    String user = getString(properties, "user");
    String privateKey = getString(properties, "sshKey");

    SSHKeyPair keyPair = new SSHKeyPair(new SSHPublicKey(user, ""),
                                        () -> privateKey.getBytes(StandardCharsets.UTF_8));
    return new RemoteHadoopConf(keyPair, host);
  }

  private static String getString(Map<String, String> properties, String key) {
    String val = properties.get(key);
    if (val == null) {
      throw new IllegalArgumentException(String.format("Invalid config. '%s' must be specified.", key));
    }
    return val;
  }
}
