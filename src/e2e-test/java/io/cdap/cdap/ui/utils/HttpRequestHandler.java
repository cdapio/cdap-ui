/*
 * Copyright © 2022 Cask Data, Inc.
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

package io.cdap.cdap.ui.utils;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.Multimap;
import io.cdap.cdap.common.http.DefaultHttpRequestConfig;
import io.cdap.common.ContentProvider;
import io.cdap.common.http.HttpMethod;
import io.cdap.common.http.HttpRequest;
import io.cdap.common.http.HttpRequests;
import io.cdap.common.http.HttpResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Map;
import javax.annotation.Nullable;

public class HttpRequestHandler {
  public static HttpResponse makeHttpRequest(HttpMethod method, String urlStr,
                                             @Nullable Map<String, String> headers,
                                             @Nullable String body,
                                             @Nullable Long bodyLength) throws IOException {
    ContentProvider<? extends InputStream> reqBody = body != null
      ? buildHttpReqBody(body)
      : null;
    Multimap<String, String> reqHeaders = headers != null
      ? castMapToMultiMap(headers)
      : null;
    HttpRequest request = new HttpRequest(method, new URL(urlStr), reqHeaders, reqBody, bodyLength);
    HttpResponse httpResponse = HttpRequests.execute(request, new DefaultHttpRequestConfig(false));

    return httpResponse;
  }

  private static ContentProvider buildHttpReqBody(String body) {
    return new ContentProvider<InputStream>() {
      @Override
      public InputStream getInput() {
        return new ByteArrayInputStream(body.getBytes());
      }
    };
  }

  private static Multimap<String, String> castMapToMultiMap(Map<String, String> header) {
    Multimap<String, String> reqHeaders = LinkedListMultimap.create();
    for (Map.Entry<String, String> entry : header.entrySet()) {
      reqHeaders.put(entry.getKey(), entry.getValue());
    }
    return reqHeaders;
  }
}
