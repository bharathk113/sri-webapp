import { ChartDataPoint, LMomentPoint, DroughtSeverity, F1ScoreData, HeatmapRow } from './types';

export const PAPER_INFO = {
    title: "A grid-wise approach for accurate computation of Standardized Runoff Index (SRI)",
    authors: "Bharath Kumar Reddy Kadapala, M. Asha Farsana, C.H. Geetha Vimala, Saksham Joshi, K. Abdul Hakeem, P.V. Raju",
    journal: "Science of the Total Environment 946 (2024)",
    doi: "https://doi.org/10.1016/j.scitotenv.2024.174472"
};

export const GODAVARI_STATS = [
    { label: "Drainage Area", value: "312,812 km²" },
    { label: "Annual Rainfall", value: "850 - 1200 mm" },
    { label: "Monsoon Contribution", value: "80%" },
    { label: "Study Period", value: "1981 - 2019" }
];

// Data for the Difference Matrix Heatmap (Table 3 from PDF)
export const MATRIX_COLUMNS = [
    ">100 Dry", "100-50 Dry", "50-25 Dry", "25-10 Dry", 
    "Normal", 
    "25-10 Wet", "50-25 Wet", "100-50 Wet", ">100 Wet"
];

export const MATRIX_DATA: HeatmapRow[] = [
    { label: ">100 Dry", values: [44, 110, 87, 107, 0, 0, 0, 0, 0] },
    { label: "100-50 Dry", values: [79, 104, 267, 116, 0, 0, 0, 0, 0] },
    { label: "50-25 Dry", values: [48, 71, 717, 1010, 0, 0, 0, 0, 0] },
    { label: "25-10 Dry", values: [26, 6, 79, 6626, 1936, 0, 0, 0, 0] },
    // Omitted middle normal rows for clarity/space as per paper focus on extremes
    { label: "25-10 Wet", values: [0, 0, 0, 0, 2059, 13920, 14, 0, 0] },
    { label: "50-25 Wet", values: [0, 0, 0, 0, 0, 2759, 4272, 1, 0] },
    { label: "100-50 Wet", values: [0, 0, 0, 0, 0, 91, 3038, 883, 7] },
    { label: ">100 Wet", values: [0, 0, 0, 0, 0, 39, 219, 1251, 249] },
];

// Data extracted from Figure 10 (A, B, C) - F1 Scores
export const F1_LOW_RUNOFF: F1ScoreData[] = [
    { returnPeriod: '> 100', dry: 0.16, wet: 0.08 },
    { returnPeriod: '100-50', dry: 0.22, wet: 0.24 },
    { returnPeriod: '50-25', dry: 0.41, wet: 0.61 },
    { returnPeriod: '25-10', dry: 0.78, wet: 0.85 },
];

export const F1_MED_RUNOFF: F1ScoreData[] = [
    { returnPeriod: '> 100', dry: 0.14, wet: 0.26 },
    { returnPeriod: '100-50', dry: 0.29, wet: 0.28 },
    { returnPeriod: '50-25', dry: 0.50, wet: 0.56 },
    { returnPeriod: '25-10', dry: 0.81, wet: 0.83 },
];

export const F1_HIGH_RUNOFF: F1ScoreData[] = [
    { returnPeriod: '> 100', dry: 0.19, wet: 0.28 },
    { returnPeriod: '100-50', dry: 0.21, wet: 0.31 },
    { returnPeriod: '50-25', dry: 0.52, wet: 0.57 },
    { returnPeriod: '25-10', dry: 0.79, wet: 0.85 },
];

export const SEVERITY_TABLE = [
    { score: ">= 2.00", interpretation: "Extremely wet" },
    { score: "1.50 to 1.99", interpretation: "Severely wet" },
    { score: "1.00 to 1.49", interpretation: "Moderately wet" },
    { score: "-0.99 to 0.99", interpretation: "Normal" },
    { score: "-1.49 to -1.00", interpretation: "Moderately dry" },
    { score: "-1.99 to -1.49", interpretation: "Severely dry" },
    { score: "<= -2.00", interpretation: "Extremely dry" },
];