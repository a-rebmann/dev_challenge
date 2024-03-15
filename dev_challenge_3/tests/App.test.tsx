import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import App from '../src/App';
import IDGenerator from '../src/util';
import { runAllocation } from '../src/allocation';
import{updateLocationStatistics, updateItemStatistics} from '../src/statistics';
import { act } from 'react-dom/test-utils';
import { ExecutionResult, Item } from '../src/model';

describe('App', () => {
  it('should render without error', () => {
    render(<App />);
  })

  
  it('should not be possible to allocate without items per location', async () => {
    render(<App />);
    const buttonDisabled = screen.getByTestId('allocateButton');
    //There must be an even number of items for each location to allocate them randomly.
    expect(buttonDisabled).toBeDisabled();
  })

  it('should be possible to allocate when there is an even number of items but not otherwise', async () => {
    render(<App />);
    const kitchenItems: string[] = ['knife', 'fork'];
    const bathroomItems: string[] = ['toothbrush', 'toothpaste'];
    // set the state of the app to have 2 items in each location
    const kitchenInput = screen.getByTestId('kitchenInput');
    const bathroomInput = screen.getByTestId('bathroomInput');
    const kitchenButton = screen.getByTestId('kitchenAddButton');
    const bathroomButton = screen.getByTestId('bathroomAddButton');
    await act(async () => {
      fireEvent.change(kitchenInput, { target: { value: "" } });
      fireEvent.change(bathroomInput, { target: { value: "" } });
      fireEvent.click(kitchenButton);
      fireEvent.click(bathroomButton);

      fireEvent.change(kitchenInput, { target: { value: kitchenItems[0] } });
      fireEvent.change(kitchenInput, { target: { value: kitchenItems[1] } });
      fireEvent.change(bathroomInput, { target: { value: bathroomItems[0] } });
      fireEvent.change(bathroomInput, { target: { value: bathroomItems[1] } });
    })
    await waitFor(() => {
      // check that the button is enabled
      expect(screen.getByTestId('allocateButton')).toBeEnabled();
      // click the button
      fireEvent.click(screen.getByTestId('allocateButton'));
    })
  })


  it('should allocate items randomly so that half per category are correct and half are incorrect', async () => {
      const items: Item[] = [
        new Item(IDGenerator.generateID(),"knife", "kitchen"),
        new Item(IDGenerator.generateID(),"fork", "kitchen"),
        new Item(IDGenerator.generateID(),"spoon", "kitchen"),
        new Item(IDGenerator.generateID(),"plate", "kitchen"),
        new Item(IDGenerator.generateID(),"toothbrush", "bathroom"),
        new Item(IDGenerator.generateID(),"toothpaste", "bathroom"),
        new Item(IDGenerator.generateID(),"shampoo", "bathroom"),
        new Item(IDGenerator.generateID(),"soap", "bathroom")
      ];
      const result: ExecutionResult[] = runAllocation(items);
      expect(result.length).toBe(8);
      const kitchenItems = result.filter(res => res.location === "kitchen");
      const bathroomItems = result.filter(res => res.location === "bathroom");
      // half of the items should be correct and half should be incorrect
      expect(kitchenItems.filter(res => res.correctness).length).toBe(2);
      expect(kitchenItems.filter(res => !res.correctness).length).toBe(2);
      expect(bathroomItems.filter(res => res.correctness).length).toBe(2);
      expect(bathroomItems.filter(res => !res.correctness).length).toBe(2);
  })

  it('should correctly update the statistics when the button is clicked', async () => {
    const items: Item[] = [
      new Item(IDGenerator.generateID(),"knife", "kitchen"),
      new Item(IDGenerator.generateID(),"fork", "kitchen"),
      new Item(IDGenerator.generateID(),"shampoo", "bathroom"),
      new Item(IDGenerator.generateID(),"soap", "bathroom")
    ];
    const result: ExecutionResult[] = runAllocation(items);
    const itemStatisticsMap = new Map<Item, { correct: number, incorrect: number }>();
    itemStatisticsMap.set(items[0], { correct: 0, incorrect: 0 });
    itemStatisticsMap.set(items[1], { correct: 0, incorrect: 0 });
    itemStatisticsMap.set(items[2], { correct: 0, incorrect: 0 });
    itemStatisticsMap.set(items[3], { correct: 0, incorrect: 0 });

    const locationStatisticsMap = new Map<string, { correct: number, incorrect: number }>([
      ["kitchen", { correct: 0, incorrect: 0 }],
      ["bathroom", { correct: 0, incorrect: 0 }]
    ]);
    const udpatedItemStats = updateItemStatistics(result, itemStatisticsMap);
    const updatedLocationStats = updateLocationStatistics(result, locationStatisticsMap);

    expect(udpatedItemStats.get(items[0])!.correct + udpatedItemStats.get(items[1])!.correct).toBe(1);
    expect(udpatedItemStats.get(items[0])!.incorrect + udpatedItemStats.get(items[1])!.incorrect).toBe(1);
    expect(udpatedItemStats.get(items[2])!.correct + udpatedItemStats.get(items[3])!.correct).toBe(1);
    expect(udpatedItemStats.get(items[2])!.incorrect + udpatedItemStats.get(items[3])!.incorrect).toBe(1);
    expect(updatedLocationStats.get("kitchen")!.correct).toBe(1);
    expect(updatedLocationStats.get("kitchen")!.incorrect).toBe(1);
    expect(updatedLocationStats.get("bathroom")!.correct).toBe(1);
    expect(updatedLocationStats.get("bathroom")!.incorrect).toBe(1);

  }) 

});

