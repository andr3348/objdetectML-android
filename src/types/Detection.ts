export type Detection = {
  label: string;
  confidence: number;
  // All values normalized 0-1, relative to frame dimensions
  yMin: number;
  xMin: number;
  yMax: number;
  xMax: number;
};
