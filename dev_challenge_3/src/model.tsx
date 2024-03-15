// This file contains the model for the application. It contains the ExecutionResult and Item classes.

class ExecutionResult {
    public executionresultid: int;
    public item: Item;
    public location: string;
    public correctness: boolean

    public constructor(executionresultid: int, item: Item, location: string, correctness: boolean){
        this.executionresultid = executionresultid;
        this.item = item;
        this.location = location;
        this.correctness = correctness;
}
}

class Item {
    public itemid: int;
    public name: string;
    public location: string;

    public constructor(itemid: int, name: string, location: string){
        this.itemid = itemid;
        this.name = name;
        this.location = location;
    }
}

export {ExecutionResult, Item}