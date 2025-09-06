export interface LeaderboardCalc {
  //* STEP 1 - count appearance & wins
  countAppearceAndMetric: () => void
  //* STEP 2 - calculate metricValue 
  calculateMetric: () => void
  //* STEP 3 - sort by metricValue
  sortByMetric: () => void
  formatMetricValue: () => string
  getMappedOutput: () => void
}

// export interface LeaderboardCalc2 {
//   // TODO: think of a more general structure
// }

