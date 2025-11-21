export interface RouteItem {
    label: string;
    path: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
    category?: string;
    fullMark?: number;
}

export interface LMomentPoint {
    x: number;
    y: number;
    label: string;
    type: 'model' | 'observation';
}

export interface F1ScoreData {
    returnPeriod: string;
    dry: number;
    wet: number;
}

export interface HeatmapRow {
    label: string;
    values: number[];
}

export enum DroughtSeverity {
    ExtremelyWet = ">= 2.00",
    SeverelyWet = "1.50 to 1.99",
    ModeratelyWet = "1.00 to 1.49",
    Normal = "-0.99 to 0.99",
    ModeratelyDry = "-1.49 to -1.00",
    SeverelyDry = "-1.99 to -1.49",
    ExtremelyDry = "<= -2.00"
}