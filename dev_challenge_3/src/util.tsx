class IDGenerator {
    private static nextID: number = 1;
  
    static generateID(): number {
        return this.nextID++;
    }
  }

export default IDGenerator;