import {Item, ExecutionResult} from "./model";  
  
// function to update the statistics of the items
export function updateItemStatistics(allocationList: ExecutionResult[], statisticsMap: Map<Item, { correct: number, incorrect: number }>){
    let updatedStatistics = new Map(statisticsMap);
    //let updatedLocationStatistics = new Map(locationStatisticsMap);
    allocationList.forEach((res) => {
      const correctness = res.correctness;
      const itemStatistics = statisticsMap.get(res.item);
      if (itemStatistics) {
        if (correctness) {
          updatedStatistics.set(res.item, {
            correct: itemStatistics.correct + 1,
            incorrect: itemStatistics.incorrect
          });
        } else {
          updatedStatistics.set(res.item, {
            correct: itemStatistics.correct,
            incorrect: itemStatistics.incorrect + 1
          });
          
        }
      }
    });
    return updatedStatistics;
}

// function to update the statistics of the locations
export function updateLocationStatistics(allocationList: ExecutionResult[], statisticsMap: Map<string, { correct: number, incorrect: number }>){
  let updatedStatistics = new Map(statisticsMap);
    allocationList.forEach((item) => {
      const location = item.location;
      const correctness = item.correctness;
      if (correctness) {
        updatedStatistics.set(location, {
          correct: updatedStatistics.get(location)!.correct + 1,
          incorrect: updatedStatistics.get(location)!.incorrect
        });
      }else{
        updatedStatistics.set(location, {
          correct: updatedStatistics.get(location)!.correct,
          incorrect: updatedStatistics.get(location)!.incorrect + 1
        });
      }
    });
    return updatedStatistics;
}
