/*
 * Copyright © 2014-2016 Cask Data, Inc.
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

package co.cask.cdap.gateway.handlers;

import co.cask.cdap.api.ProgramSpecification;
import co.cask.cdap.api.app.ApplicationSpecification;
import co.cask.cdap.api.flow.FlowSpecification;
import co.cask.cdap.api.flow.FlowletDefinition;
import co.cask.cdap.api.metrics.MetricStore;
import co.cask.cdap.api.schedule.Trigger;
import co.cask.cdap.app.mapreduce.MRJobInfoFetcher;
import co.cask.cdap.app.runtime.ProgramController;
import co.cask.cdap.app.runtime.ProgramRuntimeService;
import co.cask.cdap.app.store.Store;
import co.cask.cdap.common.BadRequestException;
import co.cask.cdap.common.ConflictException;
import co.cask.cdap.common.MethodNotAllowedException;
import co.cask.cdap.common.NamespaceNotFoundException;
import co.cask.cdap.common.NotFoundException;
import co.cask.cdap.common.NotImplementedException;
import co.cask.cdap.common.ServiceUnavailableException;
import co.cask.cdap.common.conf.Constants;
import co.cask.cdap.common.discovery.EndpointStrategy;
import co.cask.cdap.common.discovery.RandomEndpointStrategy;
import co.cask.cdap.common.id.Id;
import co.cask.cdap.common.io.CaseInsensitiveEnumTypeAdapterFactory;
import co.cask.cdap.common.namespace.NamespaceQueryAdmin;
import co.cask.cdap.common.security.AuditDetail;
import co.cask.cdap.common.security.AuditPolicy;
import co.cask.cdap.common.service.ServiceDiscoverable;
import co.cask.cdap.data2.transaction.queue.QueueAdmin;
import co.cask.cdap.gateway.handlers.util.AbstractAppFabricHttpHandler;
import co.cask.cdap.internal.app.ApplicationSpecificationAdapter;
import co.cask.cdap.internal.app.runtime.flow.FlowUtils;
import co.cask.cdap.internal.app.runtime.schedule.ProgramSchedule;
import co.cask.cdap.internal.app.runtime.schedule.ProgramScheduleRecord;
import co.cask.cdap.internal.app.runtime.schedule.ProgramScheduleStatus;
import co.cask.cdap.internal.app.runtime.schedule.SchedulerException;
import co.cask.cdap.internal.app.runtime.schedule.constraint.ConstraintCodec;
import co.cask.cdap.internal.app.runtime.schedule.store.Schedulers;
import co.cask.cdap.internal.app.runtime.schedule.trigger.ProgramStatusTrigger;
import co.cask.cdap.internal.app.runtime.schedule.trigger.SatisfiableTrigger;
import co.cask.cdap.internal.app.runtime.schedule.trigger.TriggerCodec;
import co.cask.cdap.internal.app.services.ProgramLifecycleService;
import co.cask.cdap.internal.app.store.RunRecordMeta;
import co.cask.cdap.internal.schedule.constraint.Constraint;
import co.cask.cdap.proto.BatchProgram;
import co.cask.cdap.proto.BatchProgramResult;
import co.cask.cdap.proto.BatchProgramStart;
import co.cask.cdap.proto.BatchProgramStatus;
import co.cask.cdap.proto.BatchRunnable;
import co.cask.cdap.proto.BatchRunnableInstances;
import co.cask.cdap.proto.Containers;
import co.cask.cdap.proto.Instances;
import co.cask.cdap.proto.MRJobInfo;
import co.cask.cdap.proto.NotRunningProgramLiveInfo;
import co.cask.cdap.proto.ProgramLiveInfo;
import co.cask.cdap.proto.ProgramRecord;
import co.cask.cdap.proto.ProgramRunStatus;
import co.cask.cdap.proto.ProgramStatus;
import co.cask.cdap.proto.ProgramType;
import co.cask.cdap.proto.ProtoTrigger;
import co.cask.cdap.proto.RunRecord;
import co.cask.cdap.proto.ScheduleDetail;
import co.cask.cdap.proto.ServiceInstances;
import co.cask.cdap.proto.id.ApplicationId;
import co.cask.cdap.proto.id.FlowId;
import co.cask.cdap.proto.id.NamespaceId;
import co.cask.cdap.proto.id.ProgramId;
import co.cask.cdap.proto.id.ProgramRunId;
import co.cask.cdap.proto.id.ScheduleId;
import co.cask.cdap.proto.id.WorkflowId;
import co.cask.cdap.proto.security.Action;
import co.cask.cdap.scheduler.Scheduler;
import co.cask.cdap.security.spi.authentication.AuthenticationContext;
import co.cask.cdap.security.spi.authorization.AuthorizationEnforcer;
import co.cask.cdap.security.spi.authorization.UnauthorizedException;
import co.cask.http.HttpResponder;
import com.google.common.base.Charsets;
import com.google.common.base.Function;
import com.google.common.base.Objects;
import com.google.common.base.Predicate;
import com.google.common.base.Throwables;
import com.google.common.collect.Collections2;
import com.google.common.collect.ImmutableMap;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import io.netty.buffer.ByteBufInputStream;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpResponseStatus;
import org.apache.twill.discovery.DiscoveryServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

/**
 * {@link co.cask.http.HttpHandler} to manage program lifecycle for v3 REST APIs
 */
@Singleton
@Path(Constants.Gateway.API_VERSION_3 + "/namespaces/{namespace-id}")
public class ProgramLifecycleHttpHandler extends AbstractAppFabricHttpHandler {
  private static final Logger LOG = LoggerFactory.getLogger(ProgramLifecycleHttpHandler.class);
  private static final Type BATCH_PROGRAMS_TYPE = new TypeToken<List<BatchProgram>>() { }.getType();
  private static final Type BATCH_RUNNABLES_TYPE = new TypeToken<List<BatchRunnable>>() { }.getType();
  private static final Type BATCH_STARTS_TYPE = new TypeToken<List<BatchProgramStart>>() { }.getType();

  private static final List<Constraint> NO_CONSTRAINTS = Collections.emptyList();
  private static final Map<String, String> EMPTY_PROPERTIES = new HashMap<>();

  private static final String SCHEDULES = "schedules";

  /**
   * Json serializer/deserializer.
   */
  private static final Gson GSON = ApplicationSpecificationAdapter
    .addTypeAdapters(new GsonBuilder())
    .registerTypeAdapter(Trigger.class, new TriggerCodec())
    .registerTypeAdapter(SatisfiableTrigger.class, new TriggerCodec())
    .registerTypeAdapter(Constraint.class, new ConstraintCodec())
    .create();

  /**
   * Json serde for decoding request. It uses a case insensitive enum adapter.
   */
  private static final Gson DECODE_GSON = ApplicationSpecificationAdapter
    .addTypeAdapters(new GsonBuilder())
    .registerTypeAdapterFactory(new CaseInsensitiveEnumTypeAdapterFactory())
    .registerTypeAdapter(Trigger.class, new TriggerCodec())
    .registerTypeAdapter(SatisfiableTrigger.class, new TriggerCodec())
    .registerTypeAdapter(Constraint.class, new ConstraintCodec())
    .create();

  private final ProgramLifecycleService lifecycleService;
  private final DiscoveryServiceClient discoveryServiceClient;
  private final QueueAdmin queueAdmin;
  private final MetricStore metricStore;
  private final MRJobInfoFetcher mrJobInfoFetcher;
  private final NamespaceQueryAdmin namespaceQueryAdmin;
  private final Scheduler programScheduler;
  private final AuthenticationContext authenticationContext;
  private final AuthorizationEnforcer authorizationEnforcer;

  /**
   * Store manages non-runtime lifecycle.
   */
  protected final Store store;

  /**
   * Runtime program service for running and managing programs.
   */
  protected final ProgramRuntimeService runtimeService;

  @Inject
  ProgramLifecycleHttpHandler(Store store, ProgramRuntimeService runtimeService,
                              DiscoveryServiceClient discoveryServiceClient,
                              ProgramLifecycleService lifecycleService,
                              QueueAdmin queueAdmin,
                              MRJobInfoFetcher mrJobInfoFetcher,
                              MetricStore metricStore,
                              NamespaceQueryAdmin namespaceQueryAdmin, Scheduler programScheduler,
                              AuthenticationContext authenticationContext,
                              AuthorizationEnforcer authorizationEnforcer) {
    this.store = store;
    this.runtimeService = runtimeService;
    this.discoveryServiceClient = discoveryServiceClient;
    this.lifecycleService = lifecycleService;
    this.metricStore = metricStore;
    this.queueAdmin = queueAdmin;
    this.mrJobInfoFetcher = mrJobInfoFetcher;
    this.namespaceQueryAdmin = namespaceQueryAdmin;
    this.programScheduler = programScheduler;
    this.authenticationContext = authenticationContext;
    this.authorizationEnforcer = authorizationEnforcer;
  }

  /**
   * Relays job-level and task-level information about a particular MapReduce program run.
   */
  @GET
  @Path("/apps/{app-id}/mapreduce/{mapreduce-id}/runs/{run-id}/info")
  public void getMapReduceInfo(HttpRequest request, HttpResponder responder,
                               @PathParam("namespace-id") String namespaceId,
                               @PathParam("app-id") String appId,
                               @PathParam("mapreduce-id") String mapreduceId,
                               @PathParam("run-id") String runId) throws IOException, NotFoundException {
    ProgramId programId = new ProgramId(namespaceId, appId, ProgramType.MAPREDUCE, mapreduceId);
    ProgramRunId run = programId.run(runId);
    ApplicationSpecification appSpec = store.getApplication(programId.getParent());
    if (appSpec == null) {
      throw new NotFoundException(programId.getApplication());
    }
    if (!appSpec.getMapReduce().containsKey(mapreduceId)) {
      throw new NotFoundException(programId);
    }
    RunRecordMeta runRecordMeta = store.getRun(programId, runId);
    if (runRecordMeta == null) {
      throw new NotFoundException(run);
    }

    MRJobInfo mrJobInfo = mrJobInfoFetcher.getMRJobInfo(Id.Run.fromEntityId(run));

    mrJobInfo.setState(runRecordMeta.getStatus().name());
    // Multiple startTs / endTs by 1000, to be consistent with Task-level start/stop times returned by JobClient
    // in milliseconds. RunRecord returns seconds value.
    // The start time of the MRJob is when the run record has been marked as STARTED
    mrJobInfo.setStartTime(TimeUnit.SECONDS.toMillis(runRecordMeta.getStartTs()));
    Long stopTs = runRecordMeta.getStopTs();
    if (stopTs != null) {
      mrJobInfo.setStopTime(TimeUnit.SECONDS.toMillis(stopTs));
    }

    // JobClient (in DistributedMRJobInfoFetcher) can return NaN as some of the values, and GSON otherwise fails
    Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues().create();
    responder.sendJson(HttpResponseStatus.OK, gson.toJson(mrJobInfo, mrJobInfo.getClass()));
  }

  /**
   * Returns status of a type specified by the type{flows,workflows,mapreduce,spark,services,schedules}.
   */
  @GET
  @Path("/apps/{app-id}/{program-type}/{program-id}/status")
  public void getStatus(HttpRequest request, HttpResponder responder,
                        @PathParam("namespace-id") String namespaceId,
                        @PathParam("app-id") String appId,
                        @PathParam("program-type") String type,
                        @PathParam("program-id") String programId) throws Exception {
    getStatus(request, responder, namespaceId, appId, ApplicationId.DEFAULT_VERSION, type, programId);
  }

  /**
   * Returns status of a type specified by the type{flows,workflows,mapreduce,spark,services,schedules}.
   */
  @GET
  @Path("/apps/{app-id}/versions/{version-id}/{program-type}/{program-id}/status")
  public void getStatus(HttpRequest request, HttpResponder responder,
                               @PathParam("namespace-id") String namespaceId,
                               @PathParam("app-id") String appId,
                               @PathParam("version-id") String versionId,
                               @PathParam("program-type") String type,
                               @PathParam("program-id") String programId) throws Exception {
    ApplicationId applicationId = new ApplicationId(namespaceId, appId, versionId);
    if (SCHEDULES.equals(type)) {
      JsonObject json = new JsonObject();
      ScheduleId scheduleId = applicationId.schedule(programId);
      json.addProperty("status", lifecycleService.getScheduleStatus(scheduleId).toString());
      responder.sendJson(HttpResponseStatus.OK, json.toString());
      return;
    }

    ProgramType programType;
    try {
      programType = ProgramType.valueOfCategoryName(type);
    } catch (IllegalArgumentException e) {
      throw new BadRequestException(e);
    }
    ProgramId program = applicationId.program(programType, programId);
    ProgramStatus programStatus = lifecycleService.getProgramStatus(program);

    Map<String, String> status = ImmutableMap.of("status", programStatus.name());
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(status));
  }

  /**
   * Stops the particular run of the Workflow or MapReduce program.
   */
  @POST
  @Path("/apps/{app-id}/{program-type}/{program-id}/runs/{run-id}/stop")
  public void performRunLevelStop(HttpRequest request, HttpResponder responder,
                                  @PathParam("namespace-id") String namespaceId,
                                  @PathParam("app-id") String appId,
                                  @PathParam("program-type") String type,
                                  @PathParam("program-id") String programId,
                                  @PathParam("run-id") String runId) throws Exception {
    ProgramType programType;
    try {
      programType = ProgramType.valueOfCategoryName(type);
     } catch (IllegalArgumentException e) {
      throw new BadRequestException(e);
    }
    ProgramId program = new ProgramId(namespaceId, appId, programType, programId);
    lifecycleService.stop(program, runId);
    responder.sendStatus(HttpResponseStatus.OK);
  }

  @POST
  @Path("/apps/{app-id}/{program-type}/{program-id}/{action}")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void performAction(FullHttpRequest request, HttpResponder responder,
                            @PathParam("namespace-id") String namespaceId,
                            @PathParam("app-id") String appId,
                            @PathParam("program-type") String type,
                            @PathParam("program-id") String programId,
                            @PathParam("action") String action) throws Exception {
    doPerformAction(request, responder, namespaceId, appId, ApplicationId.DEFAULT_VERSION, type, programId, action);
  }

  @POST
  @Path("/apps/{app-id}/versions/{app-version}/{program-type}/{program-id}/{action}")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void performAction(FullHttpRequest request, HttpResponder responder,
                            @PathParam("namespace-id") String namespaceId,
                            @PathParam("app-id") String appId,
                            @PathParam("app-version") String appVersion,
                            @PathParam("program-type") String type,
                            @PathParam("program-id") String programId,
                            @PathParam("action") String action) throws Exception {
    doPerformAction(request, responder, namespaceId, appId, appVersion, type, programId, action);
  }

  private void doPerformAction(FullHttpRequest request, HttpResponder responder, String namespaceId, String appId,
                               String appVersion, String type, String programId, String action) throws Exception {
    ApplicationId applicationId = new ApplicationId(namespaceId, appId, appVersion);
    if (SCHEDULES.equals(type)) {
      ScheduleId scheduleId = applicationId.schedule(programId);
      lifecycleService.suspendResumeSchedule(scheduleId, action);
      responder.sendJson(HttpResponseStatus.OK, "OK");
      return;
    }

    ProgramType programType;
    try {
      programType = ProgramType.valueOfCategoryName(type);
    } catch (IllegalArgumentException e) {
      throw new BadRequestException(String.format("Unknown program type '%s'", type), e);
    }

    ProgramId program = applicationId.program(programType, programId);
    Map<String, String> args = decodeArguments(request);
    // we have already validated that the action is valid
    switch (action.toLowerCase()) {
      case "start":
        lifecycleService.start(program, args, false);
        break;
      case "debug":
        if (!isDebugAllowed(programType)) {
          throw new NotImplementedException(String.format("debug action is not implemented for program type %s",
                                                          programType));
        }
        lifecycleService.start(program, args, true);
        break;
      case "stop":
        lifecycleService.stop(program);
        break;
      default:
        throw new NotFoundException(String.format("%s action was not found", action));
    }
    responder.sendStatus(HttpResponseStatus.OK);
  }

  /**
   * Returns program runs based on options it returns either currently running or completed or failed.
   * Default it returns all.
   */
  @GET
  @Path("/apps/{app-name}/{program-type}/{program-name}/runs")
  public void programHistory(HttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("program-type") String type,
                             @PathParam("program-name") String programName,
                             @QueryParam("status") String status,
                             @QueryParam("start") String startTs,
                             @QueryParam("end") String endTs,
                             @QueryParam("limit") @DefaultValue("100") final int resultLimit)
    throws Exception {
    programHistory(request, responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, type,
                   programName, status, startTs, endTs, resultLimit);
  }

  /**
   * Returns program runs of an app version based on options it returns either currently running or completed or failed.
   * Default it returns all.
   */
  @GET
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}/runs")
  public void programHistory(HttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("app-version") String appVersion,
                             @PathParam("program-type") String type,
                             @PathParam("program-name") String programName,
                             @QueryParam("status") String status,
                             @QueryParam("start") String startTs,
                             @QueryParam("end") String endTs,
                             @QueryParam("limit") @DefaultValue("100") final int resultLimit)
    throws Exception {
    ProgramType programType = getProgramType(type);
    if (programType == null || programType == ProgramType.WEBAPP) {
      throw new NotFoundException(String.format("Program history is not supported for program type '%s'.",
                                                type));
    }
    long start = (startTs == null || startTs.isEmpty()) ? 0 : Long.parseLong(startTs);
    long end = (endTs == null || endTs.isEmpty()) ? Long.MAX_VALUE : Long.parseLong(endTs);

    ProgramId program = new ApplicationId(namespaceId, appName, appVersion).program(programType, programName);
    if (!lifecycleService.programExists(program)) {
      throw new NotFoundException(program);
    }
    getRuns(responder, program, status, start, end, resultLimit);
  }

  /**
   * Returns run record for a particular run of a program.
   */
  @GET
  @Path("/apps/{app-name}/{program-type}/{program-name}/runs/{run-id}")
  public void programRunRecord(HttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("program-type") String type,
                             @PathParam("program-name") String programName,
                             @PathParam("run-id") String runid) throws NotFoundException {
    programRunRecord(request, responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, type, programName, runid);
  }

  /**
   * Returns run record for a particular run of a program of an app version.
   */
  @GET
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}/runs/{run-id}")
  public void programRunRecord(HttpRequest request, HttpResponder responder,
                               @PathParam("namespace-id") String namespaceId,
                               @PathParam("app-name") String appName,
                               @PathParam("app-version") String appVersion,
                               @PathParam("program-type") String type,
                               @PathParam("program-name") String programName,
                               @PathParam("run-id") String runid) throws NotFoundException {
    ProgramType programType = getProgramType(type);
    if (programType == null || programType == ProgramType.WEBAPP) {
      throw new NotFoundException(String.format("Program run record is not supported for program type '%s'.",
                                                programType));
    }
    ProgramId progId = new ApplicationId(namespaceId, appName, appVersion).program(programType, programName);
    RunRecordMeta runRecordMeta = store.getRun(progId, runid);
    if (runRecordMeta != null) {
      RunRecord runRecord = new RunRecord(runRecordMeta);
      responder.sendJson(HttpResponseStatus.OK, GSON.toJson(runRecord));
      return;
    }
    throw new NotFoundException(progId.run(runid));
  }

  /**
   * Get program runtime args.
   */
  @GET
  @Path("/apps/{app-name}/{program-type}/{program-name}/runtimeargs")
  public void getProgramRuntimeArgs(HttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespaceId,
                                    @PathParam("app-name") String appName,
                                    @PathParam("program-type") String type,
                                    @PathParam("program-name") String programName) throws Exception {
    ProgramType programType = getProgramType(type);
    ProgramId programId = new ProgramId(namespaceId, appName, programType, programName);
    getProgramIdRuntimeArgs(programId, responder);
  }

  /**
   * Save program runtime args.
   */
  @PUT
  @Path("/apps/{app-name}/{program-type}/{program-name}/runtimeargs")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void saveProgramRuntimeArgs(FullHttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespaceId,
                                    @PathParam("app-name") String appName,
                                    @PathParam("program-type") String type,
                                    @PathParam("program-name") String programName) throws Exception {
    ProgramType programType = getProgramType(type);
    ProgramId programId = new ProgramId(namespaceId, appName, programType, programName);
    saveProgramIdRuntimeArgs(programId, request, responder);
  }

  /**
   * Get runtime args of a program with app version.
   */
  @GET
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}/runtimeargs")
  public void getProgramRuntimeArgs(HttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespaceId,
                                    @PathParam("app-name") String appName,
                                    @PathParam("app-version") String appVersion,
                                    @PathParam("program-type") String type,
                                    @PathParam("program-name") String programName) throws Exception {
    ProgramType programType = getProgramType(type);
    ProgramId programId = new ApplicationId(namespaceId, appName, appVersion).program(programType, programName);
    getProgramIdRuntimeArgs(programId, responder);
  }

  /**
   * Save runtime args of program with app version.
   */
  @PUT
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}/runtimeargs")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void saveProgramRuntimeArgs(FullHttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespaceId,
                                     @PathParam("app-name") String appName,
                                     @PathParam("app-version") String appVersion,
                                     @PathParam("program-type") String type,
                                     @PathParam("program-name") String programName) throws Exception {
    ProgramType programType = getProgramType(type);
    ProgramId programId = new ApplicationId(namespaceId, appName, appVersion).program(programType, programName);
    saveProgramIdRuntimeArgs(programId, request, responder);
  }

  private void getProgramIdRuntimeArgs(ProgramId programId, HttpResponder responder) throws Exception {
    ProgramType programType = programId.getType();
    if (programType == null || programType == ProgramType.WEBAPP) {
      throw new NotFoundException(String.format("Getting program runtime arguments is not supported for program " +
                                                  "type '%s'.", programType));
    }
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(lifecycleService.getRuntimeArgs(programId)));
  }

  private void saveProgramIdRuntimeArgs(ProgramId programId, FullHttpRequest request,
                                        HttpResponder responder) throws Exception {
    ProgramType programType = programId.getType();
    if (programType == null || programType == ProgramType.WEBAPP) {
      throw new NotFoundException(String.format("Saving program runtime arguments is not supported for program " +
                                                  "type '%s'.", programType));
    }
    lifecycleService.saveRuntimeArgs(programId, decodeArguments(request));
    responder.sendStatus(HttpResponseStatus.OK);
  }

  @GET
  @Path("/apps/{app-name}/{program-type}/{program-name}")
  public void programSpecification(HttpRequest request, HttpResponder responder,
                                   @PathParam("namespace-id") String namespaceId, @PathParam("app-name") String appName,
                                   @PathParam("program-type") String type,
                                   @PathParam("program-name") String programName) throws Exception {
    programSpecification(request, responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, type, programName);
  }


  @GET
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}")
  public void programSpecification(HttpRequest request, HttpResponder responder,
                                   @PathParam("namespace-id") String namespaceId, @PathParam("app-name") String appName,
                                   @PathParam("app-version") String appVersion,
                                   @PathParam("program-type") String type,
                                   @PathParam("program-name") String programName) throws Exception {
    ProgramType programType = getProgramType(type);
    if (programType == null) {
      throw new MethodNotAllowedException(request.method(), request.uri());
    }

    ApplicationId application = new ApplicationId(namespaceId, appName, appVersion);
    ProgramId programId = application.program(programType, programName);
    ProgramSpecification specification = lifecycleService.getProgramSpecification(programId);
    if (specification == null) {
      throw new NotFoundException(programId);
    }
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(specification));
  }

  /**
   * Get schedules containing {@link ProgramStatusTrigger} filtered by triggering program, and optionally by
   * triggering program statuses or schedule status
   *  @param triggerNamespaceId namespace of the triggering program in {@link ProgramStatusTrigger}
   * @param triggerAppName application name of the triggering program in {@link ProgramStatusTrigger}
   * @param triggerAppVersion application version of the triggering program in {@link ProgramStatusTrigger}
   * @param triggerProgramType program type of the triggering program in {@link ProgramStatusTrigger}
   * @param triggerProgramName program name of the triggering program in {@link ProgramStatusTrigger}
   * @param triggerProgramStatuses comma separated {@link ProgramStatus} in {@link ProgramStatusTrigger}.
*                               Schedules with {@link ProgramStatusTrigger} triggered by none of the
*                               {@link ProgramStatus} in triggerProgramStatuses will be filtered out.
*                               If not specified, schedules will be returned regardless of triggering program status.
   * @param scheduleStatus status of the schedule. Can only be one of "SCHEDULED" or "SUSPENDED".
*                       If specified, only schedules with matching status will be returned.
   */
  @GET
  @Path("schedules/trigger-type/program-status")
  public void getProgramStatusSchedules(HttpRequest request, HttpResponder responder,
                                        @QueryParam("trigger-namespace-id") String triggerNamespaceId,
                                        @QueryParam("trigger-app-name") String triggerAppName,
                                        @QueryParam("trigger-app-version") String triggerAppVersion,
                                        @QueryParam("trigger-program-type") String triggerProgramType,
                                        @QueryParam("trigger-program-name") String triggerProgramName,
                                        @QueryParam("trigger-program-statuses") String triggerProgramStatuses,
                                        @QueryParam("schedule-status") String scheduleStatus)
    throws BadRequestException {
    if (triggerNamespaceId == null && triggerAppName == null && triggerAppVersion == null
      && triggerProgramType == null && triggerProgramName == null) {
      throw new BadRequestException("Must specify the triggering program to find schedules " +
                                      "triggered by program statuses");
    }
    // Filter by triggering programId and in program status trigger
    ApplicationId appId = triggerAppVersion == null ? new ApplicationId(triggerNamespaceId, triggerAppName)
      : new ApplicationId(triggerNamespaceId, triggerAppName, triggerAppVersion);
    final ProgramId triggerProgramId = appId.program(ProgramType.valueOfCategoryName(triggerProgramType),
                                                     triggerProgramName);
    programScheduler.findSchedules(triggerProgramId.toString());
    Set<ProgramScheduleRecord> schedules = new HashSet<>();
    final Set<co.cask.cdap.api.ProgramStatus> queryProgramStatuses = new HashSet<>();
    if (triggerProgramStatuses != null) {
      try {
        for (String status : triggerProgramStatuses.split(",")) {
          queryProgramStatuses.add(co.cask.cdap.api.ProgramStatus.valueOf(status));
        }
      } catch (Exception e) {
        throw new BadRequestException(String.format("Unable to parse program statuses '%s'. Must be comma separated " +
                                                      "valid ProgramStatus names such as COMPLETED, FAILED, KILLED.",
                                                    triggerProgramStatuses), e);
      }
    } else {
      // Query for schedules with all the statuses if no query status is specified
      for (co.cask.cdap.api.ProgramStatus status: co.cask.cdap.api.ProgramStatus.values()) {
        queryProgramStatuses.add(status);
      }
    }
    for (String triggerKey : Schedulers.triggerKeysForProgramStatuses(triggerProgramId, queryProgramStatuses)) {
      schedules.addAll(programScheduler.findSchedules(triggerKey));
    }
    List<ScheduleDetail> details = Schedulers.toScheduleDetails(filterSchedulesByStatus(schedules, scheduleStatus));
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(details, Schedulers.SCHEDULE_DETAILS_TYPE));
  }

  @GET
  @Path("apps/{app-name}/schedules/{schedule-name}")
  public void getSchedule(HttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId,
                          @PathParam("app-name") String appName,
                          @PathParam("schedule-name") String scheduleName)
    throws NotFoundException, SchedulerException, BadRequestException {
    doGetSchedule(responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, scheduleName);
  }

  @GET
  @Path("apps/{app-name}/versions/{app-version}/schedules/{schedule-name}")
  public void getSchedule(HttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId,
                          @PathParam("app-name") String appName,
                          @PathParam("app-version") String appVersion,
                          @PathParam("schedule-name") String scheduleName)
    throws NotFoundException, SchedulerException, BadRequestException {
    doGetSchedule(responder, namespaceId, appName, appVersion, scheduleName);
  }

  private void doGetSchedule(HttpResponder responder, String namespace,
                             String app, String version, String scheduleName)
    throws NotFoundException, BadRequestException {

    ScheduleId scheduleId = new ApplicationId(namespace, app, version).schedule(scheduleName);
    ProgramSchedule schedule = programScheduler.getSchedule(scheduleId);
    ScheduleDetail detail = schedule.toScheduleDetail();
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(detail, ScheduleDetail.class));
  }

  /**
   * See {@link #getAllSchedules(HttpRequest, HttpResponder, String, String, String, String)}
   */
  @GET
  @Path("apps/{app-name}/schedules")
  public void getAllSchedules(HttpRequest request, HttpResponder responder,
                              @PathParam("namespace-id") String namespaceId,
                              @PathParam("app-name") String appName,
                              @QueryParam("trigger-type") String triggerType,
                              @QueryParam("schedule-status") String scheduleStatus)
    throws NotFoundException, BadRequestException {
    doGetSchedules(responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, null, triggerType,
                   scheduleStatus);
  }

  /**
   * Get schedules in a given application, optionally filtered by the given
   * {@link co.cask.cdap.proto.ProtoTrigger.Type}.
   * @param namespaceId namespace of the application to get schedules from
   * @param appName name of the application to get schedules from
   * @param appVersion version of the application to get schedules from
   * @param triggerType trigger type of returned schedules. If not specified, all schedules
*                    are returned regardless of trigger type
   * @param scheduleStatus the status of the schedule, must be values in {@link ProgramScheduleStatus}.
   */
  @GET
  @Path("apps/{app-name}/versions/{app-version}/schedules")
  public void getAllSchedules(HttpRequest request, HttpResponder responder,
                              @PathParam("namespace-id") String namespaceId,
                              @PathParam("app-name") String appName,
                              @PathParam("app-version") String appVersion,
                              @QueryParam("trigger-type") String triggerType,
                              @QueryParam("schedule-status") String scheduleStatus)
    throws NotFoundException, BadRequestException {
    doGetSchedules(responder, namespaceId, appName, appVersion, null, triggerType, scheduleStatus);
  }

  protected void doGetSchedules(HttpResponder responder, String namespace, String app, String version,
                                @Nullable String workflow, @Nullable String triggerType,
                                String scheduleStatus)
    throws NotFoundException, BadRequestException {
    ApplicationId applicationId = new ApplicationId(namespace, app, version);
    ApplicationSpecification appSpec = store.getApplication(applicationId);
    if (appSpec == null) {
      throw new NotFoundException(applicationId);
    }
    Collection<ProgramScheduleRecord> schedules;
    if (workflow != null) {
      WorkflowId workflowId = applicationId.workflow(workflow);
      if (appSpec.getWorkflows().get(workflow) == null) {
        throw new NotFoundException(workflowId);
      }
      schedules = programScheduler.listScheduleRecords(workflowId);
    } else {
      schedules = programScheduler.listScheduleRecords(applicationId);
    }

    if (triggerType != null) {
      final ProtoTrigger.Type type = ProtoTrigger.Type.valueOfCategoryName(triggerType);
      // Filter schedules by trigger type
      Iterator<ProgramScheduleRecord> iterator = schedules.iterator();
      while (iterator.hasNext()) {
        // Remove the schedule if its trigger type does not match the given type
        if (!iterator.next().getSchedule().getTrigger().getType().equals(type)) {
          iterator.remove();
        }
      }
    }
    schedules = filterSchedulesByStatus(schedules, scheduleStatus);
    List<ScheduleDetail> details = Schedulers.toScheduleDetails(schedules);
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(details, Schedulers.SCHEDULE_DETAILS_TYPE));
  }

  private Collection<ProgramScheduleRecord> filterSchedulesByStatus(Collection<ProgramScheduleRecord> scheduleRecords,
                                                                    @Nullable String scheduleStatus) {
    // No need to filter by status if scheduleStatus is null, directly return the original records
    if (scheduleStatus == null) {
      return scheduleRecords;
    }
    final ProgramScheduleStatus status = ProgramScheduleStatus.valueOf(scheduleStatus);
    return Collections2.filter(scheduleRecords, new Predicate<ProgramScheduleRecord>() {
      @Override
      public boolean apply(ProgramScheduleRecord record) {
        return record.getMeta().getStatus().equals(status);
      }
    });
  }

  @PUT
  @Path("apps/{app-name}/schedules/{schedule-name}")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void addSchedule(FullHttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId,
                          @PathParam("app-name") String appName,
                          @PathParam("schedule-name") String scheduleName)
    throws Exception {
    doAddSchedule(request, responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, scheduleName);
  }

  @PUT
  @Path("apps/{app-name}/versions/{app-version}/schedules/{schedule-name}")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void addSchedule(FullHttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId,
                          @PathParam("app-name") String appName,
                          @PathParam("app-version") String appVersion,
                          @PathParam("schedule-name") String scheduleName)
    throws Exception {
    doAddSchedule(request, responder, namespaceId, appName, appVersion, scheduleName);
  }

  private void doAddSchedule(FullHttpRequest request, HttpResponder responder, String namespace, String appName,
                             String appVersion, String scheduleName) throws Exception {

    final ApplicationId applicationId = new ApplicationId(namespace, appName, appVersion);
    authorizationEnforcer.enforce(applicationId, authenticationContext.getPrincipal(), Action.ADMIN);
    ScheduleDetail scheduleFromRequest = readScheduleDetailBody(request, scheduleName);

    if (scheduleFromRequest.getProgram() == null) {
      throw new BadRequestException("No program was specified for the schedule");
    }
    if (scheduleFromRequest.getProgram().getProgramType() == null) {
      throw new BadRequestException("No program type was specified for the schedule");
    }
    if (scheduleFromRequest.getProgram().getProgramName() == null) {
      throw new BadRequestException("No program name was specified for the schedule");
    }
    if (scheduleFromRequest.getTrigger() == null) {
      throw new BadRequestException("No trigger was specified for the schedule");
    }
    ProgramType programType = ProgramType.valueOfSchedulableType(scheduleFromRequest.getProgram().getProgramType());
    String programName = scheduleFromRequest.getProgram().getProgramName();
    ProgramId programId = applicationId.program(programType, programName);

    if (!lifecycleService.programExists(programId)) {
      throw new NotFoundException(programId);
    }

    String description = Objects.firstNonNull(scheduleFromRequest.getDescription(), "");
    Map<String, String> properties = Objects.firstNonNull(scheduleFromRequest.getProperties(), EMPTY_PROPERTIES);
    List<? extends Constraint> constraints = Objects.firstNonNull(scheduleFromRequest.getConstraints(), NO_CONSTRAINTS);
    long timeoutMillis =
      Objects.firstNonNull(scheduleFromRequest.getTimeoutMillis(), Schedulers.JOB_QUEUE_TIMEOUT_MILLIS);
    ProgramSchedule schedule = new ProgramSchedule(scheduleName, description, programId, properties,
                                                   scheduleFromRequest.getTrigger(), constraints, timeoutMillis);
    programScheduler.addSchedule(schedule);
    responder.sendStatus(HttpResponseStatus.OK);
  }

  @POST
  @Path("apps/{app-name}/schedules/{schedule-name}/update")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void updateSchedule(FullHttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("schedule-name") String scheduleName) throws Exception {
    doUpdateSchedule(request, responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, scheduleName);
  }

  @POST
  @Path("apps/{app-name}/versions/{app-version}/schedules/{schedule-name}/update")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void updateSchedule(FullHttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("app-version") String appVersion,
                             @PathParam("schedule-name") String scheduleName) throws Exception {
    doUpdateSchedule(request, responder, namespaceId, appName, appVersion, scheduleName);
  }

  private void doUpdateSchedule(FullHttpRequest request, HttpResponder responder, String namespaceId, String appId,
                                String appVersion, String scheduleName) throws Exception {

    ScheduleId scheduleId = new ApplicationId(namespaceId, appId, appVersion).schedule(scheduleName);
    authorizationEnforcer.enforce(scheduleId.getParent(), authenticationContext.getPrincipal(), Action.ADMIN);
    final ProgramSchedule existingSchedule = programScheduler.getSchedule(scheduleId);
    ScheduleDetail scheduleDetail = readScheduleDetailBody(request, scheduleName);
    ProgramSchedule updatedSchedule = combineForUpdate(scheduleDetail, existingSchedule);
    programScheduler.updateSchedule(updatedSchedule);
    responder.sendStatus(HttpResponseStatus.OK);
  }

  private ScheduleDetail readScheduleDetailBody(FullHttpRequest request, String scheduleName)
    throws BadRequestException, IOException {

    JsonElement json;
    try (Reader reader = new InputStreamReader(new ByteBufInputStream(request.content()), Charsets.UTF_8)) {
      // The schedule spec in the request body does not contain the program information
      json = DECODE_GSON.fromJson(reader, JsonElement.class);
    } catch (IOException e) {
      throw new IOException("Error reading request body", e);
    } catch (JsonSyntaxException e) {
      throw new BadRequestException("Request body is invalid json: " + e.getMessage());
    }
    if (!json.isJsonObject()) {
      throw new BadRequestException("Expected a json object in the request body but received " + GSON.toJson(json));
    }
    ScheduleDetail scheduleDetail;
    try {
      scheduleDetail = DECODE_GSON.fromJson(json, ScheduleDetail.class);
    } catch (JsonSyntaxException e) {
      throw new BadRequestException("Error parsing request body as a schedule specification: " + e.getMessage());
    }

    // If the schedule name is present in the request body, it should match the name in path params
    if (scheduleDetail.getName() != null && !scheduleName.equals(scheduleDetail.getName())) {
      throw new BadRequestException(String.format(
        "Schedule name in the body of the request (%s) does not match the schedule name in the path parameter (%s)",
        scheduleDetail.getName(), scheduleName));
    }
    return scheduleDetail;
  }

  private ProgramSchedule combineForUpdate(ScheduleDetail scheduleDetail, ProgramSchedule existing)
    throws BadRequestException {
    String description = Objects.firstNonNull(scheduleDetail.getDescription(), existing.getDescription());
    ProgramId programId = scheduleDetail.getProgram() == null ? existing.getProgramId()
      : existing.getProgramId().getParent().program(
        scheduleDetail.getProgram().getProgramType() == null ? existing.getProgramId().getType()
        : ProgramType.valueOfSchedulableType(scheduleDetail.getProgram().getProgramType()),
      Objects.firstNonNull(scheduleDetail.getProgram().getProgramName(), existing.getProgramId().getProgram()));
    if (!programId.equals(existing.getProgramId())) {
      throw new BadRequestException(
        String.format("Must update the schedule '%s' with the same program as '%s'. "
                        + "To change the program in a schedule, please delete the schedule and create a new one.",
                      existing.getName(), existing.getProgramId().toString()));
    }
    Map<String, String> properties = Objects.firstNonNull(scheduleDetail.getProperties(), existing.getProperties());
    Trigger trigger = Objects.firstNonNull(scheduleDetail.getTrigger(), existing.getTrigger());
    List<? extends Constraint> constraints =
      Objects.firstNonNull(scheduleDetail.getConstraints(), existing.getConstraints());
    Long timeoutMillis = Objects.firstNonNull(scheduleDetail.getTimeoutMillis(), existing.getTimeoutMillis());
    return new ProgramSchedule(existing.getName(), description, programId, properties, trigger, constraints,
                               timeoutMillis);
  }

  @DELETE
  @Path("apps/{app-name}/schedules/{schedule-name}")
  public void deleteSchedule(HttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("schedule-name") String scheduleName) throws Exception {
    doDeleteSchedule(responder, namespaceId, appName, ApplicationId.DEFAULT_VERSION, scheduleName);
  }

  @DELETE
  @Path("apps/{app-name}/versions/{app-version}/schedules/{schedule-name}")
  public void deleteSchedule(HttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId,
                             @PathParam("app-name") String appName,
                             @PathParam("app-version") String appVersion,
                             @PathParam("schedule-name") String scheduleName) throws Exception {
    doDeleteSchedule(responder, namespaceId, appName, appVersion, scheduleName);
  }

  private void doDeleteSchedule(HttpResponder responder, String namespaceId, String appName,
                                String appVersion, String scheduleName) throws Exception {
    ScheduleId scheduleId = new ApplicationId(namespaceId, appName, appVersion).schedule(scheduleName);
    authorizationEnforcer.enforce(scheduleId.getParent(), authenticationContext.getPrincipal(), Action.ADMIN);
    programScheduler.deleteSchedule(scheduleId);
    responder.sendStatus(HttpResponseStatus.OK);
  }

  /**
   * Update the log level for a running program according to the request body. Currently supported program types are
   * {@link ProgramType#FLOW}, {@link ProgramType#SERVICE} and {@link ProgramType#WORKER}.
   * The request body is expected to contain a map of log levels, where key is loggername, value is one of the
   * valid {@link org.apache.twill.api.logging.LogEntry.Level} or null.
   */
  @PUT
  @Path("/apps/{app-name}/{program-type}/{program-name}/runs/{run-id}/loglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void updateProgramLogLevels(FullHttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespace,
                                     @PathParam("app-name") String appName,
                                     @PathParam("program-type") String type,
                                     @PathParam("program-name") String programName,
                                     @PathParam("run-id") String runId) throws Exception {
    updateLogLevels(request, responder, namespace, appName, ApplicationId.DEFAULT_VERSION, type, programName, null,
                    runId);
  }

  /**
   * Update the log level for a running program according to the request body.
   */
  @PUT
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}/runs/{run-id}/loglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void updateProgramLogLevels(FullHttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespace,
                                     @PathParam("app-name") String appName,
                                     @PathParam("app-version") String appVersion,
                                     @PathParam("program-type") String type,
                                     @PathParam("program-name") String programName,
                                     @PathParam("run-id") String runId) throws Exception {
    updateLogLevels(request, responder, namespace, appName, appVersion, type, programName, null, runId);
  }

  /**
   * Reset the log level for a running program back to where it starts. Currently supported program types are
   * {@link ProgramType#FLOW}, {@link ProgramType#SERVICE} and {@link ProgramType#WORKER}.
   * The request body can either be empty, which will reset all loggers for the program, or contain a list of
   * logger names, which will reset for these particular logger names for the program.
   */
  @POST
  @Path("/apps/{app-name}/{program-type}/{program-name}/runs/{run-id}/resetloglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void resetProgramLogLevels(FullHttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespace,
                                    @PathParam("app-name") String appName,
                                    @PathParam("program-type") String type,
                                    @PathParam("program-name") String programName,
                                    @PathParam("run-id") String runId) throws Exception {
    resetLogLevels(request, responder, namespace, appName, ApplicationId.DEFAULT_VERSION, type, programName, null,
                   runId);
  }

  /**
   * Reset the log level for a running program back to where it starts.
   */
  @POST
  @Path("/apps/{app-name}/versions/{app-version}/{program-type}/{program-name}/runs/{run-id}/resetloglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void resetProgramLogLevels(FullHttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespace,
                                    @PathParam("app-name") String appName,
                                    @PathParam("app-version") String appVersion,
                                    @PathParam("program-type") String type,
                                    @PathParam("program-name") String programName,
                                    @PathParam("run-id") String runId) throws Exception {
    resetLogLevels(request, responder, namespace, appName, appVersion, type, programName, null, runId);
  }

  /**
   * Returns the status for all programs that are passed into the data. The data is an array of JSON objects
   * where each object must contain the following three elements: appId, programType, and programId
   * (flow name, service name, etc.).
   * <p>
   * Example input:
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1"},
   * {"appId": "App1", "programType": "Mapreduce", "programId": "MapReduce2"},
   * {"appId": "App2", "programType": "Flow", "programId": "Flow1"}]
   * </code></pre>
   * </p><p>
   * The response will be an array of JsonObjects each of which will contain the three input parameters
   * as well as 2 fields, "status" which maps to the status of the program and "statusCode" which maps to the
   * status code for the data in that JsonObjects.
   * </p><p>
   * If an error occurs in the input (for the example above, App2 does not exist), then all JsonObjects for which the
   * parameters have a valid status will have the status field but all JsonObjects for which the parameters do not have
   * a valid status will have an error message and statusCode.
   * </p><p>
   * For example, if there is no App2 in the data above, then the response would be 200 OK with following possible data:
   * </p>
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1", "statusCode": 200, "status": "RUNNING"},
   * {"appId": "App1", "programType": "Mapreduce", "programId": "Mapreduce2", "statusCode": 200, "status": "STOPPED"},
   * {"appId":"App2", "programType":"Flow", "programId":"Flow1", "statusCode":404, "error": "App: App2 not found"}]
   * </code></pre>
   */
  @POST
  @Path("/status")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void getStatuses(FullHttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId) throws Exception {

    List<BatchProgram> programs = validateAndGetBatchInput(request, BATCH_PROGRAMS_TYPE);

    List<BatchProgramStatus> statuses = new ArrayList<>(programs.size());
    for (BatchProgram program : programs) {
      ProgramId programId = new ProgramId(namespaceId, program.getAppId(), program.getProgramType(),
                                          program.getProgramId());
      try {
        ProgramStatus programStatus = lifecycleService.getProgramStatus(programId);
        statuses.add(new BatchProgramStatus(
          program, HttpResponseStatus.OK.code(), null, programStatus.name()));
      } catch (NotFoundException e) {
        statuses.add(new BatchProgramStatus(
          program, HttpResponseStatus.NOT_FOUND.code(), e.getMessage(), null));
      }
    }
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(statuses));
  }

  /**
   * Stops all programs that are passed into the data. The data is an array of JSON objects
   * where each object must contain the following three elements: appId, programType, and programId
   * (flow name, service name, etc.).
   * <p>
   * Example input:
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1"},
   * {"appId": "App1", "programType": "Mapreduce", "programId": "MapReduce2"},
   * {"appId": "App2", "programType": "Flow", "programId": "Flow1"}]
   * </code></pre>
   * </p><p>
   * The response will be an array of JsonObjects each of which will contain the three input parameters
   * as well as a "statusCode" field which maps to the status code for the data in that JsonObjects.
   * </p><p>
   * If an error occurs in the input (for the example above, App2 does not exist), then all JsonObjects for which the
   * parameters have a valid status will have the status field but all JsonObjects for which the parameters do not have
   * a valid status will have an error message and statusCode.
   * </p><p>
   * For example, if there is no App2 in the data above, then the response would be 200 OK with following possible data:
   * </p>
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1", "statusCode": 200},
   * {"appId": "App1", "programType": "Mapreduce", "programId": "Mapreduce2", "statusCode": 200},
   * {"appId":"App2", "programType":"Flow", "programId":"Flow1", "statusCode":404, "error": "App: App2 not found"}]
   * </code></pre>
   */
  @POST
  @Path("/stop")
  @AuditPolicy({AuditDetail.REQUEST_BODY, AuditDetail.RESPONSE_BODY})
  public void stopPrograms(FullHttpRequest request, HttpResponder responder,
                           @PathParam("namespace-id") String namespaceId) throws Exception {

    List<BatchProgram> programs = validateAndGetBatchInput(request, BATCH_PROGRAMS_TYPE);

    List<ListenableFuture<BatchProgramResult>> issuedStops = new ArrayList<>(programs.size());
    for (final BatchProgram program : programs) {
      ProgramId programId = new ProgramId(namespaceId, program.getAppId(), program.getProgramType(),
                                         program.getProgramId());
      try {
        List<ListenableFuture<ProgramController>> stops = lifecycleService.issueStop(programId, null);
        for (ListenableFuture<ProgramController> stop : stops) {
          ListenableFuture<BatchProgramResult> issuedStop = Futures.transform(stop,
            new Function<ProgramController, BatchProgramResult>() {
              @Override
              public BatchProgramResult apply(ProgramController input) {
                return new BatchProgramResult(program, HttpResponseStatus.OK.code(), null, input.getRunId().getId());
              }
            });
          issuedStops.add(issuedStop);
        }
      } catch (NotFoundException e) {
        issuedStops.add(Futures.immediateFuture(
          new BatchProgramResult(program, HttpResponseStatus.NOT_FOUND.code(), e.getMessage())));
      } catch (BadRequestException e) {
        issuedStops.add(Futures.immediateFuture(
          new BatchProgramResult(program, HttpResponseStatus.BAD_REQUEST.code(), e.getMessage())));
      }
    }

    List<BatchProgramResult> output = new ArrayList<>(programs.size());
    // need to keep this index in case there is an exception getting the future, since we won't have the program
    // information in that scenario
    int i = 0;
    for (ListenableFuture<BatchProgramResult> issuedStop : issuedStops) {
      try {
        output.add(issuedStop.get());
      } catch (Throwable t) {
        LOG.warn(t.getMessage(), t);
        output.add(new BatchProgramResult(programs.get(i), HttpResponseStatus.INTERNAL_SERVER_ERROR.code(),
                                          t.getMessage()));
      }
      i++;
    }
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(output));
  }

  /**
   * Starts all programs that are passed into the data. The data is an array of JSON objects
   * where each object must contain the following three elements: appId, programType, and programId
   * (flow name, service name, etc.). In additional, each object can contain an optional runtimeargs element,
   * which is a map of arguments to start the program with.
   * <p>
   * Example input:
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1"},
   * {"appId": "App1", "programType": "Mapreduce", "programId": "MapReduce2", "runtimeargs":{"arg1":"val1"}},
   * {"appId": "App2", "programType": "Flow", "programId": "Flow1"}]
   * </code></pre>
   * </p><p>
   * The response will be an array of JsonObjects each of which will contain the three input parameters
   * as well as a "statusCode" field which maps to the status code for the data in that JsonObjects.
   * </p><p>
   * If an error occurs in the input (for the example above, App2 does not exist), then all JsonObjects for which the
   * parameters have a valid status will have the status field but all JsonObjects for which the parameters do not have
   * a valid status will have an error message and statusCode.
   * </p><p>
   * For example, if there is no App2 in the data above, then the response would be 200 OK with following possible data:
   * </p>
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1", "statusCode": 200},
   * {"appId": "App1", "programType": "Mapreduce", "programId": "Mapreduce2", "statusCode": 200},
   * {"appId":"App2", "programType":"Flow", "programId":"Flow1", "statusCode":404, "error": "App: App2 not found"}]
   * </code></pre>
   */
  @POST
  @Path("/start")
  @AuditPolicy({AuditDetail.REQUEST_BODY, AuditDetail.RESPONSE_BODY})
  public void startPrograms(FullHttpRequest request, HttpResponder responder,
                            @PathParam("namespace-id") String namespaceId) throws Exception {

    List<BatchProgramStart> programs = validateAndGetBatchInput(request, BATCH_STARTS_TYPE);

    List<BatchProgramResult> output = new ArrayList<>(programs.size());
    for (BatchProgramStart program : programs) {
      ProgramId programId = new ProgramId(namespaceId, program.getAppId(), program.getProgramType(),
                                          program.getProgramId());
      try {
        ProgramController programController = lifecycleService.start(programId, program.getRuntimeargs(), false);
        output.add(new BatchProgramResult(program, HttpResponseStatus.OK.code(), null,
                                          programController.getRunId().getId()));
      } catch (NotFoundException e) {
        output.add(new BatchProgramResult(program, HttpResponseStatus.NOT_FOUND.code(), e.getMessage()));
      } catch (BadRequestException e) {
        output.add(new BatchProgramResult(program, HttpResponseStatus.BAD_REQUEST.code(), e.getMessage()));
      } catch (ConflictException e) {
        output.add(new BatchProgramResult(program, HttpResponseStatus.CONFLICT.code(), e.getMessage()));
      }
    }
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(output));
  }

  /**
   * Returns the number of instances for all program runnables that are passed into the data. The data is an array of
   * Json objects where each object must contain the following three elements: appId, programType, and programId
   * (flow name, service name). Retrieving instances only applies to flows, and user
   * services. For flows, another parameter, "runnableId", must be provided. This corresponds to the
   * flowlet/runnable for which to retrieve the instances.
   * <p>
   * Example input:
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1", "runnableId": "Runnable1"},
   *  {"appId": "App1", "programType": "Mapreduce", "programId": "Mapreduce2"},
   *  {"appId": "App2", "programType": "Flow", "programId": "Flow1", "runnableId": "Flowlet1"}]
   * </code></pre>
   * </p><p>
   * The response will be an array of JsonObjects each of which will contain the three input parameters
   * as well as 3 fields:
   * <ul>
   * <li>"provisioned" which maps to the number of instances actually provided for the input runnable;</li>
   * <li>"requested" which maps to the number of instances the user has requested for the input runnable; and</li>
   * <li>"statusCode" which maps to the http status code for the data in that JsonObjects (200, 400, 404).</li>
   * </ul>
   * </p><p>
   * If an error occurs in the input (for the example above, Flowlet1 does not exist), then all JsonObjects for
   * which the parameters have a valid instances will have the provisioned and requested fields status code fields
   * but all JsonObjects for which the parameters are not valid will have an error message and statusCode.
   * </p><p>
   * For example, if there is no Flowlet1 in the above data, then the response could be 200 OK with the following data:
   * </p>
   * <pre><code>
   * [{"appId": "App1", "programType": "Service", "programId": "Service1", "runnableId": "Runnable1",
   *   "statusCode": 200, "provisioned": 2, "requested": 2},
   *  {"appId": "App1", "programType": "Mapreduce", "programId": "Mapreduce2", "statusCode": 400,
   *   "error": "Program type 'Mapreduce' is not a valid program type to get instances"},
   *  {"appId": "App2", "programType": "Flow", "programId": "Flow1", "runnableId": "Flowlet1", "statusCode": 404,
   *   "error": "Program": Flowlet1 not found"}]
   * </code></pre>
   */
  @POST
  @Path("/instances")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void getInstances(FullHttpRequest request, HttpResponder responder,
                           @PathParam("namespace-id") String namespaceId) throws IOException, BadRequestException {

    List<BatchRunnable> runnables = validateAndGetBatchInput(request, BATCH_RUNNABLES_TYPE);

    // cache app specs to perform fewer store lookups
    Map<ApplicationId, ApplicationSpecification> appSpecs = new HashMap<>();

    List<BatchRunnableInstances> output = new ArrayList<>(runnables.size());
    for (BatchRunnable runnable : runnables) {
      // cant get instances for things that are not flows, services, or workers
      if (!canHaveInstances(runnable.getProgramType())) {
        output.add(new BatchRunnableInstances(runnable, HttpResponseStatus.BAD_REQUEST.code(),
                   String.format("Program type '%s' is not a valid program type to get instances",
                     runnable.getProgramType().getPrettyName())));
        continue;
      }

      ApplicationId appId = new ApplicationId(namespaceId, runnable.getAppId());

      // populate spec cache if this is the first time we've seen the appid.
      if (!appSpecs.containsKey(appId)) {
        appSpecs.put(appId, store.getApplication(appId));
      }

      ApplicationSpecification spec = appSpecs.get(appId);
      if (spec == null) {
        output.add(new BatchRunnableInstances(runnable, HttpResponseStatus.NOT_FOUND.code(),
          String.format("App: %s not found", appId)));
        continue;
      }

      ProgramId programId = appId.program(runnable.getProgramType(), runnable.getProgramId());
      output.add(getProgramInstances(runnable, spec, programId));
    }
    responder.sendJson(HttpResponseStatus.OK, GSON.toJson(output));
  }

  /*
  Note: Cannot combine the following get all programs methods into one because then API path will clash with /apps path
   */

  /**
   * Returns a list of flows associated with a namespace.
   */
  @GET
  @Path("/flows")
  public void getAllFlows(HttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId) throws Exception {
    responder.sendJson(HttpResponseStatus.OK,
                       GSON.toJson(lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.FLOW)));
  }

  /**
   * Returns a list of map/reduces associated with a namespace.
   */
  @GET
  @Path("/mapreduce")
  public void getAllMapReduce(HttpRequest request, HttpResponder responder,
                              @PathParam("namespace-id") String namespaceId) throws Exception {
    responder.sendJson(HttpResponseStatus.OK,
                       GSON.toJson(lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.MAPREDUCE)));
  }

  /**
   * Returns a list of spark jobs associated with a namespace.
   */
  @GET
  @Path("/spark")
  public void getAllSpark(HttpRequest request, HttpResponder responder,
                          @PathParam("namespace-id") String namespaceId) throws Exception {
    responder.sendJson(HttpResponseStatus.OK,
                       GSON.toJson(lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.SPARK)));
  }

  /**
   * Returns a list of workflows associated with a namespace.
   */
  @GET
  @Path("/workflows")
  public void getAllWorkflows(HttpRequest request, HttpResponder responder,
                              @PathParam("namespace-id") String namespaceId) throws Exception {
    responder.sendJson(HttpResponseStatus.OK,
                       GSON.toJson(lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.WORKFLOW)));
  }

  /**
   * Returns a list of services associated with a namespace.
   */
  @GET
  @Path("/services")
  public void getAllServices(HttpRequest request, HttpResponder responder,
                             @PathParam("namespace-id") String namespaceId) throws Exception {
    responder.sendJson(HttpResponseStatus.OK,
                       GSON.toJson(lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.SERVICE)));
  }

  @GET
  @Path("/workers")
  public void getAllWorkers(HttpRequest request, HttpResponder responder,
                            @PathParam("namespace-id") String namespaceId) throws Exception {
    responder.sendJson(HttpResponseStatus.OK,
                       GSON.toJson(lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.WORKER)));
  }

  /**
   * Returns number of instances of a worker.
   */
  @GET
  @Path("/apps/{app-id}/workers/{worker-id}/instances")
  public void getWorkerInstances(HttpRequest request, HttpResponder responder,
                                 @PathParam("namespace-id") String namespaceId,
                                 @PathParam("app-id") String appId,
                                 @PathParam("worker-id") String workerId) throws Exception {
    try {
      ProgramId workderId = validateAndGetNamespace(namespaceId).app(appId).worker(workerId);
      if (!lifecycleService.programExists(workderId)) {
        throw new NotFoundException(workderId);
      }
      int count = store.getWorkerInstances(workderId);
      responder.sendJson(HttpResponseStatus.OK, GSON.toJson(new Instances(count)));
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    } catch (Throwable e) {
      if (respondIfElementNotFound(e, responder)) {
        return;
      }
      throw e;
    }
  }

  /**
   * Sets the number of instances of a worker.
   */
  @PUT
  @Path("/apps/{app-id}/workers/{worker-id}/instances")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void setWorkerInstances(FullHttpRequest request, HttpResponder responder,
                                 @PathParam("namespace-id") String namespaceId,
                                 @PathParam("app-id") String appId,
                                 @PathParam("worker-id") String workerId) throws Exception {
    int instances = getInstances(request);
    try {
      lifecycleService.setInstances(new ProgramId(namespaceId, appId, ProgramType.WORKER, workerId), instances);
      responder.sendStatus(HttpResponseStatus.OK);
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    } catch (Throwable e) {
      if (respondIfElementNotFound(e, responder)) {
        return;
      }
      throw e;
    }
  }

  /* ********************* Flow/Flowlet APIs ***********************************************************/
  /**
   * Returns number of instances for a flowlet within a flow.
   */
  @GET
  @Path("/apps/{app-id}/flows/{flow-id}/flowlets/{flowlet-id}/instances")
  public void getFlowletInstances(HttpRequest request, HttpResponder responder,
                                  @PathParam("namespace-id") String namespaceId,
                                  @PathParam("app-id") String appId, @PathParam("flow-id") String flowId,
                                  @PathParam("flowlet-id") String flowletId) throws Exception {
    try {
      ProgramId flow = validateAndGetNamespace(namespaceId).app(appId).flow(flowId);
      if (!lifecycleService.programExists(flow)) {
       throw new NotFoundException(flow);
      }
      int count = store.getFlowletInstances(flow, flowletId);
      responder.sendJson(HttpResponseStatus.OK, GSON.toJson(new Instances(count)));
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    } catch (Throwable e) {
      if (respondIfElementNotFound(e, responder)) {
        return;
      }
      throw e;
    }
  }

  /**
   * Increases number of instance for a flowlet within a flow.
   */
  @PUT
  @Path("/apps/{app-id}/flows/{flow-id}/flowlets/{flowlet-id}/instances")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public synchronized void setFlowletInstances(FullHttpRequest request, HttpResponder responder,
                                               @PathParam("namespace-id") String namespaceId,
                                               @PathParam("app-id") String appId, @PathParam("flow-id") String flowId,
                                               @PathParam("flowlet-id") String flowletId) throws Exception {
    int instances = getInstances(request);
    try {
      lifecycleService.setInstances(new ProgramId(namespaceId, appId, ProgramType.FLOW, flowId), instances, flowletId);
      responder.sendStatus(HttpResponseStatus.OK);
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    } catch (Throwable e) {
      if (respondIfElementNotFound(e, responder)) {
        return;
      }
      throw e;
    }
  }

  /**
   * Update the log level for a flowlet according to the request body. The request body is expected to contain a map
   * of log levels, where key is loggername, value is one of the valid
   * {@link org.apache.twill.api.logging.LogEntry.Level} or null.
   */
  @PUT
  @Path("/apps/{app-id}/flows/{flow-id}/flowlets/{flowlet-id}/runs/{run-id}/loglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void updateFlowletLogLevels(FullHttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespaceId,
                                     @PathParam("app-id") String appId,
                                     @PathParam("flow-id") String flowId,
                                     @PathParam("flowlet-id") String flowletId,
                                     @PathParam("run-id") String runId) throws Exception {
      updateLogLevels(request, responder, namespaceId, appId, ApplicationId.DEFAULT_VERSION,
                      ProgramType.FLOW.getCategoryName(), flowId, flowletId, runId);
  }

  /**
   * Update log level for a flowlet belongs to a specific app version.
   */
  @PUT
  @Path("/apps/{app-id}/versions/{app-version}/flows/{flow-id}/flowlets/{flowlet-id}/runs/{run-id}/loglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void updateFlowletLogLevels(FullHttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespaceId,
                                     @PathParam("app-id") String appId,
                                     @PathParam("app-version") String appVersion,
                                     @PathParam("flow-id") String flowId,
                                     @PathParam("flowlet-id") String flowletId,
                                     @PathParam("run-id") String runId) throws Exception {
    updateLogLevels(request, responder, namespaceId, appId, appVersion,
                    ProgramType.FLOW.getCategoryName(), flowId, flowletId, runId);
  }

  /**
   * Reset the log levels for a flowlet back to where it starts. The request body is expected to contain a list of
   * logger names, or null if reset for all loggers.
   */
  @POST
  @Path("/apps/{app-id}/flows/{flow-id}/flowlets/{flowlet-id}/runs/{run-id}/resetloglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void resetFlowletLogLevels(FullHttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespaceId,
                                    @PathParam("app-id") String appId,
                                    @PathParam("flow-id") String flowId,
                                    @PathParam("flowlet-id") String flowletId,
                                    @PathParam("run-id") String runId) throws Exception {
    resetLogLevels(request, responder, namespaceId, appId, ApplicationId.DEFAULT_VERSION,
                   ProgramType.FLOW.getCategoryName(), flowId, flowletId, runId);
  }

  /**
   * Reset log level for a flowlet belongs to a specific app version.
   */
  @POST
  @Path("/apps/{app-id}/versions/{app-version}/flows/{flow-id}/flowlets/{flowlet-id}/runs/{run-id}/resetloglevels")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void resetFlowletLogLevels(FullHttpRequest request, HttpResponder responder,
                                    @PathParam("namespace-id") String namespaceId,
                                    @PathParam("app-id") String appId,
                                    @PathParam("app-version") String appVersion,
                                    @PathParam("flow-id") String flowId,
                                    @PathParam("flowlet-id") String flowletId,
                                    @PathParam("run-id") String runId) throws Exception {
    resetLogLevels(request, responder, namespaceId, appId, appVersion,
                   ProgramType.FLOW.getCategoryName(), flowId, flowletId, runId);
  }

  @GET
  @Path("/apps/{app-id}/{program-category}/{program-id}/live-info")
  @SuppressWarnings("unused")
  public void liveInfo(HttpRequest request, HttpResponder responder, @PathParam("namespace-id") String namespaceId,
                       @PathParam("app-id") String appId, @PathParam("program-category") String programCategory,
                       @PathParam("program-id") String programId) {
    ProgramType type = getProgramType(programCategory);
    if (type == null) {
      responder.sendString(HttpResponseStatus.METHOD_NOT_ALLOWED,
                           String.format("Live-info not supported for program type '%s'", programCategory));
      return;
    }
    ProgramId program =
      new ProgramId(namespaceId, appId, ProgramType.valueOfCategoryName(programCategory), programId);
    getLiveInfo(responder, program, runtimeService);
  }


  private void getLiveInfo(HttpResponder responder, ProgramId programId,
                             ProgramRuntimeService runtimeService) {
    try {
      responder.sendJson(HttpResponseStatus.OK, GSON.toJson(runtimeService.getLiveInfo(programId)));
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    }
  }

  /**
   * Deletes queues.
   */
  @DELETE
  @Path("/apps/{app-id}/flows/{flow-id}/queues")
  public void deleteFlowQueues(HttpRequest request, HttpResponder responder,
                               @PathParam("namespace-id") String namespaceId,
                               @PathParam("app-id") String appId,
                               @PathParam("flow-id") String flowId) throws Exception {
    FlowId flow = new FlowId(namespaceId, appId, flowId);
    try {
      ProgramStatus status = lifecycleService.getProgramStatus(flow);
      if (ProgramStatus.RUNNING == status) {
        responder.sendString(HttpResponseStatus.FORBIDDEN, "Flow is running, please stop it first.");
      } else {
        queueAdmin.dropAllForFlow(flow);
        FlowUtils.deleteFlowPendingMetrics(metricStore, namespaceId, appId, flowId);
        responder.sendStatus(HttpResponseStatus.OK);
      }
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    }
  }

  /**
   * Return the number of instances of a service.
   */
  @GET
  @Path("/apps/{app-id}/services/{service-id}/instances")
  public void getServiceInstances(HttpRequest request, HttpResponder responder,
                                  @PathParam("namespace-id") String namespaceId,
                                  @PathParam("app-id") String appId,
                                  @PathParam("service-id") String serviceId) throws Exception {
    try {
      ProgramId programId = validateAndGetNamespace(namespaceId).app(appId).service(serviceId);
      if (!lifecycleService.programExists(programId)) {
        throw new NotFoundException(programId);
      }

      int instances = store.getServiceInstances(programId);
      responder.sendJson(HttpResponseStatus.OK,
                         GSON.toJson(new ServiceInstances(instances, getInstanceCount(programId, serviceId))));
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    }
  }

  /**
   * Return the availability (i.e. discoverable registration) status of a service.
   */
  @GET
  @Path("/apps/{app-name}/{service-type}/{program-name}/available")
  public void getServiceAvailability(HttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespaceId,
                                     @PathParam("app-name") String appName,
                                     @PathParam("service-type") String serviceType,
                                     @PathParam("program-name") String programName) throws Exception {
    getServiceAvailability(request, responder, namespaceId, appName,
                           ApplicationId.DEFAULT_VERSION, serviceType, programName);
  }

  /**
   * Return the availability (i.e. discoverable registration) status of a service.
   */
  @GET
  @Path("/apps/{app-name}/versions/{app-version}/{service-type}/{program-name}/available")
  public void getServiceAvailability(HttpRequest request, HttpResponder responder,
                                     @PathParam("namespace-id") String namespaceId,
                                     @PathParam("app-name") String appName,
                                     @PathParam("app-version") String appVersion,
                                     @PathParam("service-type") String serviceType,
                                     @PathParam("program-name") String programName) throws Exception {
    // Currently we only support services and sparks as the service-type
    ProgramType programType = ProgramType.valueOfCategoryName(serviceType);
    if (!ServiceDiscoverable.getUserServiceTypes().contains(programType)) {
      throw new BadRequestException("Only service or spark is support for service availability check");
    }

    ProgramId programId = new ProgramId(new ApplicationId(namespaceId, appName, appVersion), programType, programName);
    ProgramStatus status = lifecycleService.getProgramStatus(programId);
    if (status == ProgramStatus.STOPPED) {
      throw new ServiceUnavailableException(programId.toString(), "Service is stopped. Please start it.");
    }

    // Construct discoverable name and return 200 OK if discoverable is present. If not return 503.
    String discoverableName = ServiceDiscoverable.getName(programId);

    // TODO: CDAP-12959 - Should use the UserServiceEndpointStrategy and discover based on the version
    // and have appVersion nullable for the non versioned endpoint
    EndpointStrategy endpointStrategy = new RandomEndpointStrategy(discoveryServiceClient.discover(discoverableName));
    if (endpointStrategy.pick(300L, TimeUnit.MILLISECONDS) == null) {
      LOG.trace("Discoverable endpoint {} not found", discoverableName);
      throw new ServiceUnavailableException(programId.toString(),
                                            "Service is running but not accepting requests at this time.");
    }

    responder.sendString(HttpResponseStatus.OK, "Service is available to accept requests.");
  }

  /**
   * Set instances of a service.
   */
  @PUT
  @Path("/apps/{app-id}/services/{service-id}/instances")
  @AuditPolicy(AuditDetail.REQUEST_BODY)
  public void setServiceInstances(FullHttpRequest request, HttpResponder responder,
                                  @PathParam("namespace-id") String namespaceId,
                                  @PathParam("app-id") String appId,
                                  @PathParam("service-id") String serviceId)
    throws Exception {
    try {
      ProgramId programId = new ProgramId(namespaceId, appId, ProgramType.SERVICE, serviceId);
      if (!store.programExists(programId)) {
        responder.sendString(HttpResponseStatus.NOT_FOUND, "Service not found");
        return;
      }

      int instances = getInstances(request);
      lifecycleService.setInstances(programId, instances);
      responder.sendStatus(HttpResponseStatus.OK);
    } catch (SecurityException e) {
      responder.sendStatus(HttpResponseStatus.UNAUTHORIZED);
    } catch (Throwable throwable) {
      if (respondIfElementNotFound(throwable, responder)) {
        return;
      }
      throw throwable;
    }
  }

  @DELETE
  @Path("/queues")
  public synchronized void deleteQueues(HttpRequest request, HttpResponder responder,
                                        @PathParam("namespace-id") String namespaceId)
    throws NamespaceNotFoundException {
    // synchronized to avoid a potential race condition here:
    // 1. the check for state returns that all flows are STOPPED
    // 2. The API deletes queues because
    // Between 1. and 2., a flow is started using the /namespaces/{namespace-id}/apps/{app-id}/flows/{flow-id}/start API
    // Averting this race condition by synchronizing this method. The resource that needs to be locked here is
    // runtimeService. This should work because the method that is used to start a flow - startStopProgram - is also
    // synchronized on this.
    // This synchronization works in HA mode because even in HA mode there is only one leader at a time.
    NamespaceId namespace = validateAndGetNamespace(namespaceId);
    try {
      List<ProgramRecord> flows = lifecycleService.list(validateAndGetNamespace(namespaceId), ProgramType.FLOW);
      for (ProgramRecord flow : flows) {
        String appId = flow.getApp();
        String flowId = flow.getName();
        ProgramId programId = new ProgramId(namespaceId, appId, ProgramType.FLOW, flowId);
        ProgramStatus status = lifecycleService.getProgramStatus(programId);
        if (ProgramStatus.STOPPED != status) {
          responder.sendString(HttpResponseStatus.FORBIDDEN,
                               String.format("Flow '%s' from application '%s' in namespace '%s' is running, " +
                                               "please stop it first.", flowId, appId, namespaceId));
          return;
        }
      }
      queueAdmin.dropAllInNamespace(namespace);
      // delete process metrics that are used to calculate the queue size (system.queue.pending metric)
      FlowUtils.deleteFlowPendingMetrics(metricStore, namespaceId, null, null);
      responder.sendStatus(HttpResponseStatus.OK);
    } catch (Exception e) {
      LOG.error("Error while deleting queues in namespace " + namespace, e);
      responder.sendString(HttpResponseStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
  }

  /**
   * Get requested and provisioned instances for a program type.
   * The program type passed here should be one that can have instances (flows, services, ...)
   * Requires caller to do this validation.
   */
  private BatchRunnableInstances getProgramInstances(BatchRunnable runnable, ApplicationSpecification spec,
                                                     ProgramId programId) {
    int requested;
    String programName = programId.getProgram();
    String runnableId = programName;
    ProgramType programType = programId.getType();
    if (programType == ProgramType.WORKER) {
      if (!spec.getWorkers().containsKey(programName)) {
        return new BatchRunnableInstances(runnable, HttpResponseStatus.NOT_FOUND.code(),
                                          "Worker: " + programName + " not found");
      }
      requested = spec.getWorkers().get(programName).getInstances();

    } else if (programType == ProgramType.SERVICE) {
      if (!spec.getServices().containsKey(programName)) {
        return new BatchRunnableInstances(runnable, HttpResponseStatus.NOT_FOUND.code(),
                                          "Service: " + programName + " not found");
      }
      requested = spec.getServices().get(programName).getInstances();

    } else if (programType == ProgramType.FLOW) {
      // flows must have runnable id
      runnableId = runnable.getRunnableId();
      if (runnableId == null) {
        return new BatchRunnableInstances(runnable, HttpResponseStatus.BAD_REQUEST.code(),
                                          "Must provide the flowlet id as the runnableId for flows");
      }
      FlowSpecification flowSpec = spec.getFlows().get(programName);
      if (flowSpec == null) {
        return new BatchRunnableInstances(runnable, HttpResponseStatus.NOT_FOUND.code(),
                                          "Flow: " + programName + " not found");
      }
      FlowletDefinition flowletDefinition = flowSpec.getFlowlets().get(runnableId);
      if (flowletDefinition == null) {
        return new BatchRunnableInstances(runnable, HttpResponseStatus.NOT_FOUND.code(),
                                          "Flowlet: " + runnableId + " not found");
      }
      requested = flowletDefinition.getInstances();

    } else {
      return new BatchRunnableInstances(runnable, HttpResponseStatus.BAD_REQUEST.code(),
                                        "Instances not supported for program type + " + programType);
    }
    int provisioned = getInstanceCount(programId, runnableId);
    // use the pretty name of program types to be consistent
    return new BatchRunnableInstances(runnable, HttpResponseStatus.OK.code(), provisioned, requested);
  }

  private void getRuns(HttpResponder responder, ProgramId programId, String status,
                       long start, long end, int limit) throws BadRequestException {
    try {
      ProgramRunStatus runStatus = (status == null) ? ProgramRunStatus.ALL :
        ProgramRunStatus.valueOf(status.toUpperCase());

      List<RunRecord> records = store.getRuns(programId, runStatus, start, end, limit).values().stream()
        .map(RunRecord::new).collect(Collectors.toList());

      responder.sendJson(HttpResponseStatus.OK, GSON.toJson(records));
    } catch (IllegalArgumentException e) {
      throw new BadRequestException(String.format("Invalid status %s. Supported options for status of runs are " +
                                                    "running/completed/failed", status));
    }
  }

  /**
   * Returns the number of instances currently running for different runnables for different programs
   */
  private int getInstanceCount(ProgramId programId, String runnableId) {
    ProgramLiveInfo info = runtimeService.getLiveInfo(programId);
    int count = 0;
    if (info instanceof NotRunningProgramLiveInfo) {
      return count;
    }
    if (info instanceof Containers) {
      Containers containers = (Containers) info;
      for (Containers.ContainerInfo container : containers.getContainers()) {
        if (container.getName().equals(runnableId)) {
          count++;
        }
      }
      return count;
    }
    // TODO: CDAP-1091: For standalone mode, returning the requested instances instead of provisioned only for services.
    // Doing this only for services to keep it consistent with the existing contract for flowlets right now.
    // The get instances contract for both flowlets and services should be re-thought and fixed as part of CDAP-1091
    if (programId.getType() == ProgramType.SERVICE) {
      return getRequestedServiceInstances(programId);
    }

    // Not running on YARN default 1
    return 1;
  }

  private int getRequestedServiceInstances(ProgramId serviceId) {
    // Not running on YARN, get it from store
    return store.getServiceInstances(serviceId);
  }

  private boolean isDebugAllowed(ProgramType programType) {
    return EnumSet.of(ProgramType.FLOW, ProgramType.SERVICE, ProgramType.WORKER).contains(programType);
  }

  private boolean canHaveInstances(ProgramType programType) {
    return EnumSet.of(ProgramType.FLOW, ProgramType.SERVICE, ProgramType.WORKER).contains(programType);
  }

  private <T extends BatchProgram> List<T> validateAndGetBatchInput(FullHttpRequest request, Type type)
    throws BadRequestException, IOException {

    List<T> programs;
    try (Reader reader = new InputStreamReader(new ByteBufInputStream(request.content()), StandardCharsets.UTF_8)) {
      try {
        programs = DECODE_GSON.fromJson(reader, type);
        if (programs == null) {
          throw new BadRequestException("Request body is invalid json, please check that it is a json array.");
        }
      } catch (JsonSyntaxException e) {
        throw new BadRequestException("Request body is invalid json: " + e.getMessage());
      }
    }

    // validate input
    for (BatchProgram program : programs) {
      try {
        program.validate();
      } catch (IllegalArgumentException e) {
        throw new BadRequestException(
          "Must provide valid appId, programType, and programId for each object: " + e.getMessage());
      }
    }
    return programs;
  }

  private void updateLogLevels(FullHttpRequest request, HttpResponder responder, String namespace, String appName,
                               String appVersion, String type, String programName,
                               @Nullable String component, String runId) throws Exception {
    ProgramType programType = getProgramType(type);
    if (programType == null) {
      throw new BadRequestException("Invalid program type provided");
    }
    try {
      // we are decoding the body to Map<String, String> instead of Map<String, LogEntry.Level> here since Gson will
      // serialize invalid enum values to null, which is allowed for log level, instead of throw an Exception.
      lifecycleService.updateProgramLogLevels(
        new ApplicationId(namespace, appName, appVersion).program(programType, programName),
        transformLogLevelsMap(decodeArguments(request)), component, runId);
      responder.sendStatus(HttpResponseStatus.OK);
    } catch (JsonSyntaxException e) {
      throw new BadRequestException("Invalid JSON in body");
    } catch (IllegalArgumentException e) {
      throw new BadRequestException(e.getMessage());
    } catch (SecurityException e) {
      throw new UnauthorizedException("Unauthorized to update the log levels");
    }
  }

  private void resetLogLevels(FullHttpRequest request, HttpResponder responder, String namespace, String appName,
                              String appVersion, String type, String programName,
                              @Nullable String component, String runId) throws Exception {
    ProgramType programType = getProgramType(type);
    if (programType == null) {
      throw new BadRequestException("Invalid program type provided");
    }
    try {
      Set<String> loggerNames = parseBody(request, SET_STRING_TYPE);
      lifecycleService.resetProgramLogLevels(
        new ApplicationId(namespace, appName, appVersion).program(programType, programName),
        loggerNames == null ? Collections.<String>emptySet() : loggerNames, component, runId);
      responder.sendStatus(HttpResponseStatus.OK);
    } catch (JsonSyntaxException e) {
      throw new BadRequestException("Invalid JSON in body");
    } catch (SecurityException e) {
      throw new UnauthorizedException("Unauthorized to reset the log levels");
    }
  }

  private NamespaceId validateAndGetNamespace(String namespace) throws NamespaceNotFoundException {
    NamespaceId namespaceId = new NamespaceId(namespace);
    try {
      namespaceQueryAdmin.get(namespaceId);
    } catch (NamespaceNotFoundException e) {
      throw e;
    } catch (Exception e) {
      // This can only happen when NamespaceAdmin uses HTTP to interact with namespaces.
      // Within AppFabric, NamespaceAdmin is bound to DefaultNamespaceAdmin which directly interacts with MDS.
      // Hence, this should never happen.
      throw Throwables.propagate(e);
    }
    return namespaceId;
  }
}
