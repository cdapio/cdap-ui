/*
 * Copyright 2012-2013 Continuuity,Inc. All Rights Reserved.
 */
package com.continuuity.metrics.query;

import com.continuuity.common.http.core.AbstractHttpHandler;
import com.continuuity.common.http.core.HttpResponder;
import com.continuuity.common.metrics.MetricsScope;
import com.continuuity.metrics.data.AggregatesScanResult;
import com.continuuity.metrics.data.AggregatesScanner;
import com.continuuity.metrics.data.AggregatesTable;
import com.continuuity.metrics.data.MetricsTableFactory;
import com.google.common.base.Joiner;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.inject.Inject;
import org.jboss.netty.handler.codec.http.HttpRequest;
import org.jboss.netty.handler.codec.http.HttpResponseStatus;
import org.jboss.netty.handler.codec.http.QueryStringDecoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import java.io.IOException;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Class for handling requests for aggregate application metrics of the
 * {@link com.continuuity.common.metrics.MetricsScope#USER} scope.
 */
@Path("/metrics")
public final class MetricsDiscoveryHandler extends AbstractHttpHandler {

  private static final Logger LOG = LoggerFactory.getLogger(MetricsDiscoveryHandler.class);

  private final AggregatesTable aggregatesTable;

  private enum PathProgramType {
    PROCEDURES("p"),
    MAPREDUCE("b"),
    FLOWS("f");
    String id;

    private PathProgramType(String id) {
      this.id = id;
    }

    private String getId() {
      return id;
    }
  }

  private enum ContextNodeType {
    APP("app"),
    FLOW("flow"),
    FLOWLET("flowlet"),
    PROCEDURE("procedure"),
    MAPREDUCE("mapreduce"),
    MAPREDUCE_TASK("mapreduceTask"),
    STREAM("stream"),
    DATASET("dataset"),
    ROOT("root");
    String name;

    private ContextNodeType(String name) {
      this.name = name;
    }

    private String getName() {
      return name;
    }
  }

  private enum ProgramType {
    P,
    B,
    F,
    STREAM,
    DATASET;
  }

  private enum MapReduceTask {
    M("mappers"),
    R("reducers");

    private final String name;

    private MapReduceTask(String name) {
      this.name = name;
    }

    private String getName() {
      return name;
    }
  }

  @Inject
  public MetricsDiscoveryHandler(final MetricsTableFactory metricsTableFactory) {
    this.aggregatesTable = metricsTableFactory.createAggregates(MetricsScope.USER.name());
  }

  @GET
  @Path("/available")
  public void handleAppMetricsRequest(HttpRequest request, HttpResponder responder) throws IOException {
    responder.sendJson(HttpResponseStatus.OK, getMetrics(request, null));
  }

  @GET
  @Path("/available/apps/{app-id}")
  public void handleAppMetricsRequest(HttpRequest request, HttpResponder responder,
                                      @PathParam("app-id") String appId) throws IOException {
    responder.sendJson(HttpResponseStatus.OK, getMetrics(request, appId));
  }

  @GET
  @Path("/available/apps/{app-id}/{program-type}")
  public void handleAppMetricsRequest(HttpRequest request, HttpResponder responder,
                                      @PathParam("app-id") String appId,
                                      @PathParam("program-type") String programType) throws IOException {
    String programTypeId = PathProgramType.valueOf(programType.toUpperCase()).getId();
    String context = Joiner.on(".").join(appId, programTypeId);
    responder.sendJson(HttpResponseStatus.OK, getMetrics(request, context));
  }

  @GET
  @Path("/available/apps/{app-id}/{program-type}/{program-id}")
  public void handleAppMetricsRequest(HttpRequest request, HttpResponder responder,
                                      @PathParam("app-id") String appId,
                                      @PathParam("program-type") String programType,
                                      @PathParam("program-id") String programId) throws IOException {
    String programTypeId = PathProgramType.valueOf(programType.toUpperCase()).getId();
    String context = Joiner.on(".").join(appId, programTypeId, programId);
    responder.sendJson(HttpResponseStatus.OK, getMetrics(request, context));
  }

  @GET
  @Path("/available/apps/{app-id}/{program-type}/{program-id}/{component-id}")
  public void handleAppMetricsRequest(HttpRequest request, HttpResponder responder,
                                      @PathParam("app-id") String appId,
                                      @PathParam("program-type") String programType,
                                      @PathParam("program-id") String programId,
                                      @PathParam("component-id") String componentId) throws IOException {
    String programTypeId = PathProgramType.valueOf(programType.toUpperCase()).getId();
    String context = Joiner.on(".").join(appId, programTypeId, programId, componentId);
    responder.sendJson(HttpResponseStatus.OK, getMetrics(request, context));
  }

  private JsonArray getMetrics(HttpRequest request, String contextPrefix) {
    Map<String, List<String>> queryParams = new QueryStringDecoder(request.getUri()).getParameters();
    List<String> prefixEntity = queryParams.get("prefixEntity");
    // shouldn't be in params more than once, but if it is, just take any one
    String metricPrefix = (prefixEntity == null) ? "" : prefixEntity.get(0);

    Map<String, ContextNode> metricContextsMap = Maps.newHashMap();
    AggregatesScanner scanner = this.aggregatesTable.scan(contextPrefix, metricPrefix);

    // scanning through all metric rows in the aggregates table
    // row has context plus metric info
    // each metric can show up in multiple contexts
    while (scanner.hasNext()) {
      AggregatesScanResult result = scanner.next();
      addContext(result.getContext(), result.getMetric(), metricContextsMap);
    }

    JsonArray output = new JsonArray();
    List<String> sortedMetrics = Lists.newArrayList(metricContextsMap.keySet());
    Collections.sort(sortedMetrics);
    for (String metric : sortedMetrics) {
      JsonObject metricNode = new JsonObject();
      metricNode.addProperty("metric", metric);
      ContextNode metricContexts = metricContextsMap.get(metric);
      // the root node has junk for its type and id, but has the list of contexts as its "children"
      JsonObject tmp = metricContexts.toJson();
      metricNode.add("contexts", tmp.getAsJsonArray("children"));
      output.add(metricNode);
    }

    return output;
  }

  private void addContext(String context, String metric, Map<String, ContextNode> metricContextsMap) {
    Iterator<String> contextParts = Splitter.on('.').split(context).iterator();
    if (!contextParts.hasNext()) {
      return;
    }
    String appId = contextParts.next();
    if (!contextParts.hasNext()) {
      return;
    }

    if (!metricContextsMap.containsKey(metric)) {
      metricContextsMap.put(metric, new ContextNode(ContextNodeType.ROOT, ""));
    }
    ContextNode metricContexts = metricContextsMap.get(metric);
    metricContexts = metricContexts.getOrAddChild(ContextNodeType.APP, appId);

    ProgramType type = ProgramType.valueOf(contextParts.next().toUpperCase());
    switch(type) {
      case F:
        metricContexts.deepAdd(contextParts, ContextNodeType.FLOW, ContextNodeType.FLOWLET);
        break;
      case P:
        metricContexts.deepAdd(contextParts, ContextNodeType.PROCEDURE);
        break;
      case B:
        if (contextParts.hasNext()) {
          metricContexts = metricContexts.getOrAddChild(ContextNodeType.MAPREDUCE, contextParts.next());
          if (contextParts.hasNext()) {
            String taskStr = MapReduceTask.valueOf(contextParts.next().toUpperCase()).getName();
            metricContexts.addChild(new ContextNode(ContextNodeType.MAPREDUCE_TASK, taskStr));
          }
        }
        break;
      // dataset and stream are special cases, currently the only "context" for them is "-.dataset" and "-.stream"
      case DATASET:
        metricContexts.addChild(new ContextNode(ContextNodeType.DATASET, ""));
        break;
      case STREAM:
        metricContexts.addChild(new ContextNode(ContextNodeType.STREAM, ""));
        break;
      default:
        break;
    }
  }

  private class ContextNode implements Comparable<ContextNode> {
    ContextNodeType type;
    String id;
    Map<String, ContextNode> children;

    public ContextNode(ContextNodeType type, String id) {
      this.type = type;
      this.id = id;
      this.children = Maps.newHashMap();
    }

    public ContextNode getOrAddChild(ContextNodeType type, String id) {
      String key = getChildKey(type, id);
      if (!children.containsKey(key)) {
        children.put(key, new ContextNode(type, id));
      }
      return children.get(key);
    }

    public void deepAdd(Iterator<String> ids, ContextNodeType... types) {
      ContextNode node = this;
      for (int i = 0; i < types.length; i++) {
        if (!ids.hasNext()) {
          break;
        }
        node = node.getOrAddChild(types[i], ids.next());
      }
    }

    public void addChild(ContextNode child) {
      children.put(getChildKey(child.getType(), child.getId()), child);
    }

    public ContextNodeType getType() {
      return type;
    }

    public String getId() {
      return id;
    }

    public String getKey() {
      return type.name() + ":" + id;
    }

    private String getChildKey(ContextNodeType type, String id) {
      return type.name() + ":" + id;
    }

    public JsonObject toJson() {
      JsonObject output = new JsonObject();
      output.addProperty("type", type.getName());
      output.addProperty("id", id);

      if (children.size() > 0) {
        // maybe make the sort optional based on query params
        List<ContextNode> childList = Lists.newArrayList(children.values());
        Collections.sort(childList);
        JsonArray childrenJson = new JsonArray();
        for (ContextNode child : childList) {
          childrenJson.add(child.toJson());
        }
        output.add("children", childrenJson);
      }
      return output;
    }

    public int compareTo(ContextNode other) {
      return getKey().compareTo(other.getKey());
    }
  }

}
