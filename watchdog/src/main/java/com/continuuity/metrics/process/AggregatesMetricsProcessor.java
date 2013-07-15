package com.continuuity.metrics.process;

import com.continuuity.api.data.OperationException;
import com.continuuity.metrics.data.AggregatesTable;
import com.continuuity.metrics.transport.MetricsRecord;
import com.google.common.base.Predicate;
import com.google.common.base.Predicates;
import com.google.common.collect.Iterators;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Iterator;

/**
 * A {@link MetricsProcessor} that writes metrics into aggregates table. It ignore write errors by simply
 * logging the error and proceed.
 */
public final class AggregatesMetricsProcessor implements MetricsProcessor {

  private static final Logger LOG = LoggerFactory.getLogger(AggregatesMetricsProcessor.class);

  private final Predicate<MetricsRecord> predicate;
  private final AggregatesTable aggregatesTable;

  /**
   * Creates a {@link AggregatesMetricsProcessor} that writes to the given aggregates table on every
   * {@link MetricsRecord} it sees.
   */
  public AggregatesMetricsProcessor(AggregatesTable aggregatesTable) {
    this(Predicates.<MetricsRecord>alwaysTrue(), aggregatesTable);
  }

  /**
   * Creates a {@link AggregatesMetricsProcessor} that writes {@link MetricsRecord} to the given
   * aggregates table only if the predicate is passed.
   */
  public AggregatesMetricsProcessor(Predicate<MetricsRecord> predicate, AggregatesTable aggregatesTable) {
    this.predicate = predicate;
    this.aggregatesTable = aggregatesTable;
  }

  @Override
  public void process(Iterator<MetricsRecord> records) {
    try {
      aggregatesTable.update(Iterators.filter(records, predicate));
    } catch (OperationException e) {
      LOG.error("Failed to write to time series table: {}", e.getMessage(), e);
    }
  }
}
