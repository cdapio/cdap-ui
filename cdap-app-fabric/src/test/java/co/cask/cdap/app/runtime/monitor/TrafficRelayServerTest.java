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

package co.cask.cdap.app.runtime.monitor;

import co.cask.cdap.internal.app.runtime.monitor.TrafficRelayServer;
import co.cask.cdap.internal.app.runtime.monitor.proxy.TestHandler;
import co.cask.common.http.HttpRequest;
import co.cask.common.http.HttpRequests;
import co.cask.common.http.HttpResponse;
import io.cdap.http.NettyHttpService;
import org.junit.Assert;
import org.junit.Test;

import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URL;

/**
 * Unit test for {@link TrafficRelayServer}.
 */
public class TrafficRelayServerTest {

  @Test
  public void testRelay() throws Exception {
    NettyHttpService httpServer = NettyHttpService.builder("test")
      .setHttpHandlers(new TestHandler())
      .build();
    httpServer.start();

    try {
      TrafficRelayServer relayServer = new TrafficRelayServer(InetAddress.getLoopbackAddress(),
                                                              httpServer::getBindAddress);
      relayServer.startAndWait();
      try {
        InetSocketAddress relayAddr = relayServer.getBindAddress();

        // GET
        URL url = new URL(String.format("http://%s:%d/ping", relayAddr.getHostName(), relayAddr.getPort()));
        HttpResponse response = HttpRequests.execute(HttpRequest.get(url).build());
        Assert.assertEquals(HttpURLConnection.HTTP_OK, response.getResponseCode());

        // POST
        url = new URL(String.format("http://%s:%d/echo", relayAddr.getHostName(), relayAddr.getPort()));
        response = HttpRequests.execute(HttpRequest.post(url).withBody("Testing").build());
        Assert.assertEquals(HttpURLConnection.HTTP_OK, response.getResponseCode());
        Assert.assertEquals("Testing", response.getResponseBodyAsString());

      } finally {
        relayServer.stopAndWait();
      }
    } finally {
      httpServer.stop();
    }
  }
}
