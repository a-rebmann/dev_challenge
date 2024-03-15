import { ExecutionResult, Item } from "./model";
import IDGenerator from "./util";

  // Function to run the random allocation
  export function runAllocation(items: Item[]):  ExecutionResult[]{
    function shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    // Split the items into kitchen and bathroom items
    const onlyKitchenItems = items.filter(item => item.location === "kitchen");
    const onlyBathroomItems = items.filter(item => item.location === "bathroom");
    // Shuffle the items
    shuffleArray(onlyBathroomItems);
    shuffleArray(onlyKitchenItems);
    // Split the items into correct and incorrect items so that half of the items are correct and half are incorrect
    const correctBathroom = onlyBathroomItems.slice(0, Math.floor(onlyBathroomItems.length / 2));
    const incorrectBathroom = onlyBathroomItems.filter(item => !correctBathroom.includes(item));
    const correctKitchen = onlyKitchenItems.slice(0, Math.floor(onlyKitchenItems.length / 2));
    const incorrectKitchen = onlyKitchenItems.filter(item => !correctKitchen.includes(item));
    // Allocate the items
    let allocatedItems: ExecutionResult[] = correctBathroom.map(item => new ExecutionResult(IDGenerator.generateID(),item, "bathroom", true));
    allocatedItems = allocatedItems.concat(incorrectBathroom.map(item => new ExecutionResult(IDGenerator.generateID(), item, "kitchen", false)));
    allocatedItems = allocatedItems.concat(correctKitchen.map(item => new ExecutionResult(IDGenerator.generateID(), item, "kitchen", true)));
    allocatedItems = allocatedItems.concat(incorrectKitchen.map(item => new ExecutionResult(IDGenerator.generateID(), item, "bathroom", false)));
    shuffleArray(allocatedItems);
    return allocatedItems;
}
