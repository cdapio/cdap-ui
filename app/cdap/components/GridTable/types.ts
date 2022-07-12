export interface IGridKPICellProps {
    metricData: {
        name: string;
        values: Array<{ label: string; count: number }>;
    };
}

export interface IGridHeaderCellProps {
    label: string;
    types: string[];
}

export interface IGridTextCellProps {
    cellValue: string;
}