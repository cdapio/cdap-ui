export interface IGridKPICellProps {
  metricData: {
    name: string;
    values: Array<{ label: string; count: number }>;
  };
}
