/*
 * Copyright © 2014-2017 Cask Data, Inc.
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

package co.cask.cdap.internal.app.runtime.service.http;

import co.cask.cdap.api.Transactionals;
import co.cask.cdap.api.annotation.TransactionControl;
import co.cask.cdap.api.metrics.MetricsContext;
import co.cask.cdap.api.service.http.HttpContentConsumer;
import co.cask.cdap.api.service.http.HttpContentProducer;
import co.cask.cdap.api.service.http.HttpServiceContext;
import co.cask.cdap.api.service.http.HttpServiceHandler;
import co.cask.cdap.api.service.http.HttpServiceRequest;
import co.cask.cdap.common.conf.Constants;
import co.cask.cdap.common.lang.ClassLoaders;
import co.cask.cdap.common.lang.CombineClassLoader;
import co.cask.cdap.internal.app.runtime.AbstractContext;
import co.cask.cdap.internal.app.runtime.ThrowingRunnable;
import co.cask.http.BodyConsumer;
import co.cask.http.BodyProducer;
import co.cask.http.HandlerContext;
import co.cask.http.HttpHandler;
import co.cask.http.HttpResponder;
import com.google.common.base.Preconditions;
import io.netty.handler.codec.http.HttpRequest;
import org.apache.tephra.TransactionFailureException;
import org.apache.twill.common.Cancellable;

/**
 * An abstract base class for all {@link HttpHandler} generated through the {@link HttpHandlerGenerator}.
 *
 * @param <T> Type of the user {@link HttpServiceHandler}.
 */
public abstract class AbstractHttpHandlerDelegator<T extends HttpServiceHandler> implements HttpHandler {

  private final DelegatorContext<T> context;
  private MetricsContext metricsContext;

  protected AbstractHttpHandlerDelegator(DelegatorContext<T> context, MetricsContext metricsContext) {
    this.context = context;
    this.metricsContext = metricsContext;
  }

  @Override
  public void init(HandlerContext context) {
  }

  @Override
  public void destroy(HandlerContext context) {
  }

  /**
   * Executes a given {@link ThrowingRunnable} with or without a transaction.
   *
   * @param runnable the runnable to call
   * @param transactional decide whether transaction is needed or not
   * @throws Exception if there is exception, either caused by the runnable or by the transaction system.
   */
  protected final void execute(ThrowingRunnable runnable, boolean transactional) throws Exception {
    HttpServiceContext serviceContext = context.getServiceContext();
    if (transactional) {
      try {
        serviceContext.execute(context -> runnable.run());
      } catch (TransactionFailureException e) {
        throw Transactionals.propagate(e, Exception.class);
      }
      return;
    }

    // Non-tx execution
    if (serviceContext instanceof AbstractContext) {
      ((AbstractContext) serviceContext).executeChecked(runnable);
    } else {
      // This is for unit-tests
      ClassLoader oldCl = ClassLoaders.setContextClassLoader(
        new CombineClassLoader(null, getHandler().getClass().getClassLoader(), getClass().getClassLoader()));
      try {
        runnable.run();
      } finally {
        ClassLoaders.setContextClassLoader(oldCl);
      }
    }
  }

  /**
   * Returns the {@link HttpServiceHandler} associated with the current thread.
   * This method is called from handler class generated by {@link HttpHandlerGenerator}.
   */
  protected final T getHandler() {
    return context.getHandler();
  }

  /**
   * Returns a new instance of {@link HttpServiceRequest} that wraps around the given {@link HttpRequest} object.
   * This method is called from handler class generated by {@link HttpHandlerGenerator}.
   */
  @SuppressWarnings("unused")
  protected final HttpServiceRequest wrapRequest(HttpRequest request) {
    return new DefaultHttpServiceRequest(request);
  }

  /**
   * Returns a new instance of {@link DelayedHttpServiceResponder} that wraps around the given {@link HttpResponder}
   * object. This method is called from handler class generated by {@link HttpHandlerGenerator}.
   */
  @SuppressWarnings("unused")
  protected final DelayedHttpServiceResponder wrapResponder(HttpResponder responder,
                                                            TransactionControl defaultTxControl) {
    MetricsContext collector = this.metricsContext;
    HttpServiceContext serviceContext = context.getServiceContext();
    if (serviceContext.getSpecification() != null) {
      collector = metricsContext.childContext(Constants.Metrics.Tag.HANDLER,
                                              serviceContext.getSpecification().getName());
    }

    return new DelayedHttpServiceResponder(responder, new BodyProducerFactory() {
      @Override
      public BodyProducer create(HttpContentProducer contentProducer, HttpServiceContext serviceContext) {
        final ClassLoader programContextClassLoader = new CombineClassLoader(
          null, contentProducer.getClass().getClassLoader(), getClass().getClassLoader());

        // Capture the context since we need to keep it until the end of the content producing.
        // We don't need to worry about double capturing of the context when HttpContentConsumer is used.
        // This is because when HttpContentConsumer is used, the responder constructed here will get closed and this
        // BodyProducerFactory won't be used.
        return new BodyProducerAdapter(contentProducer, serviceContext, programContextClassLoader,
                                       context.capture(), defaultTxControl);
      }
    }, serviceContext, collector);
  }

  /**
   * Returns a new instance of {@link BodyConsumer} that wraps around the given {@link HttpContentConsumer}
   * and {@link DelayedHttpServiceResponder}.
   *
   * IMPORTANT: This method will also capture the context associated with the current thread, hence after
   * this method is called, no other methods on this class should be called from the current thread.
   *
   * This method is called from handler class generated by {@link HttpHandlerGenerator}.
   */
  @SuppressWarnings("unused")
  protected final BodyConsumer wrapContentConsumer(HttpContentConsumer consumer,
                                                   DelayedHttpServiceResponder responder,
                                                   TransactionControl defaultTxControl) {
    Preconditions.checkState(!responder.hasBufferedResponse(),
                             "HttpContentConsumer may not be used after a response has already been sent.");
    // Close the provided responder since a new one will be created for the BodyConsumerAdapter to use.
    responder.close();

    HttpServiceContext serviceContext = context.getServiceContext();
    Cancellable contextReleaser = context.capture();
    ClassLoader programContextClassLoader = new CombineClassLoader(null, consumer.getClass().getClassLoader(),
                                                                   getClass().getClassLoader());

    return new BodyConsumerAdapter(new DelayedHttpServiceResponder(responder, (contentProducer, txServiceContext) ->
      // Transfer the captured context from the content consumer to the content producer
      new BodyProducerAdapter(contentProducer, txServiceContext, programContextClassLoader,
                              contextReleaser, defaultTxControl)
    ), consumer, serviceContext, programContextClassLoader, contextReleaser, defaultTxControl);
  }
}
