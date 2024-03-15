import { useEffect, useState } from 'react';
import './App.css';
import {
  Button,
  Grid,
  AnalyticalTable,
  FlexBox,
  Title,
} from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/add.js";
import React from 'react';
import { ExecutionResult, Item } from './model';
import IDGenerator from './util';
import { ThemeProvider } from '@ui5/webcomponents-react';
import { runAllocation } from './allocation';
import { updateItemStatistics, updateLocationStatistics } from './statistics';


function App() {
  // State to keep track of the items
  const [items, setItems] = useState<Item[]>([]);
  // State to keep track of the button state
  const [buttonEnabled, setButtonEnabled] = useState(false);
  // State to keep track of the input value for kitchen items
  const [kitchenValue, setKitchenValue] = useState("");
  // State to keep track of the input value for bathroom items
  const [bathroomValue, setBathroomValue] = useState("");
  // State to keep track of the last allocation results
  const [lastAllocation, setLastAllocation] = useState<ExecutionResult[]>([]);
  // State to keep track of the statistics for each item
  const [itemStatisticsMap, setItemStatisticsMap] = useState<Map<Item, { correct: number, incorrect: number }>>(new Map());
  // State to keep track of the statistics for each location
  const [locationStatisticsMap, setLocationStatisticsMap] = useState<Map<string, { correct: number, incorrect: number }>>(
    new Map([
      ["kitchen", { correct: 0, incorrect: 0 }],
      ["bathroom", { correct: 0, incorrect: 0 }]
    ]
    )
  );

  // Effect to update the button if the items change. The button should be enabled if there are even number of items in each location. 
  // The button should be disabled if there are odd number of items in each location.
  useEffect(() => {
    const onlyKitchenItems = items.filter(item => item.location === "kitchen");
    const onlyBathroomItems = items.filter(item => item.location === "bathroom");
    if (onlyKitchenItems.length > 0 && onlyBathroomItems.length > 0 && 
      onlyKitchenItems.length % 2 === 0 && onlyBathroomItems.length % 2 === 0){
      setButtonEnabled(true)
    }else{
      setButtonEnabled(false)
    }
  }, [items]);


  // Function to be executed when the button is clicked. It runs the allocation and updates the statistics.
  const handleButtonClick = () => {
    const allocationList = runAllocation(items);
    setLastAllocation(allocationList);
    setItemStatisticsMap(updateItemStatistics(allocationList, itemStatisticsMap));
    setLocationStatisticsMap(updateLocationStatistics(allocationList, locationStatisticsMap));
  };

  // Function to add a kitchen item. It also updates the map with the statistics.
  const addKitchenItem = (str: string) => {
    if (str === ""){
      return;
    }
    const newItem = new Item(IDGenerator.generateID(), str, "kitchen")
    const updatedItemList = items.concat(newItem);
    setItems(updatedItemList);
    if(!itemStatisticsMap.has(newItem)){
      setItemStatisticsMap(itemStatisticsMap.set(newItem, {
        correct: 0,
        incorrect: 0
      }));
    }
    setKitchenValue("");
  }


  // Function to add a bathroom item
  const addBathroomItem = (str: string) => {
    if (str === ""){
      return;
    }
    const newItem = new Item(IDGenerator.generateID(), str, "bathroom")
    const updatedItemList = items.concat(newItem);
    setItems(updatedItemList);
    if(!itemStatisticsMap.has(newItem)){
      setItemStatisticsMap(itemStatisticsMap.set(newItem, {
        correct: 0,
        incorrect: 0
      }));
    }
    setBathroomValue("");
  }


  return (
    <ThemeProvider>
    <div className="App">
      <Grid>
        <React.Fragment key=".0">
        <div style={{ textAlign: 'left' }}
          data-layout-indent="XL1 L1 M1 S0"
          data-layout-span="XL11 L11 M11 S12"
          >
        <Title level="H2">
            Item Allocation
        </Title>
        </div>
          <div
          data-layout-indent="XL1 L1 M1 S0"
          data-layout-span="XL5 L5 M5 S12"
          >
            <AnalyticalTable
            columns={[
              {
                Header: 'Item ID',
                accessor: 'itemid'
              },
              {
                Header: 'Item Name',
                accessor: 'name'
              },
              {
                Header: 'Correct Location',
                accessor: 'location'
              },
              {
                Cell: (instance: { cell: any; row: any; webComponentsReactProperties: any; }) => {
                  const { row } = instance;
                  return (
                    <FlexBox>
                      <Button data-testid={row.original.itemname} icon="delete" onClick={() => {
                        const updatedItemList = items.filter((item) => item.itemid !== row.original.itemid);
                        setItems(updatedItemList);
                      }
                      }/>
                    </FlexBox>
                  );
                },
                Header: 'Actions',
                accessor: '.',
                disableFilters: true,
                disableGroupBy: true,
                disableResizing: true,
                disableSortBy: true,
                id: 'actions',
                width: 100
              }
            ]}
            data={items}
            filterable
            groupBy={[]}
            groupable
            header="Items"
            visibleRowCountMode="Fixed"
            visibleRows={5}
            rowHeight={44}
            selectionMode="SingleSelect"
            withRowHighlight
          />
          <div style={{ textAlign: 'left' }}>
          Add items:&nbsp; 
          <input className="custom-input"
              data-testid="kitchenInput"
              placeholder='Type to add kitchen item'
              onChange={(e) => {
                setKitchenValue(e.target.value);
                if(e.target.value.length - kitchenValue.length > 1){
                  addKitchenItem(e.target.value);
                }
              }
              }
              onKeyUp={(e) => {
                if(e.key === "Enter"){
                  addKitchenItem(kitchenValue);
                }
              }}
              style={{
                width: '180px'
              }}
              type="Text"
              value = {kitchenValue}
          />&nbsp;
          <Button
          data-testid="kitchenAddButton"
            design="Default"
            onClick={() => addKitchenItem(kitchenValue)}
          >
            +
          </Button>
          <span style={{marginRight: '20px'}}/> 
          <input className="custom-input"
              data-testid="bathroomInput"
              placeholder='Type to add bathroom item'
              onChange={(e) => {
               setBathroomValue(e.target.value);
                if(e.target.value.length - bathroomValue.length > 1){
                  addBathroomItem(e.target.value);
                }
              }
              }
              onKeyUp={(e) => {
                if(e.key === "Enter"){
                  addBathroomItem(bathroomValue);
                }
              }}
              style={{
                width: '200px'
              }}
              type="Text"
              value = {bathroomValue}
          />&nbsp;
          <Button
            data-testid="bathroomAddButton"
            design="Default"
            onClick={()=> addBathroomItem(bathroomValue)}
          >
            +
          </Button>
          <span style={{marginRight: '10px'}}/>
          <Button data-testid="allocateButton" disabled={!buttonEnabled} onClick={handleButtonClick} design={buttonEnabled? "Emphasized": "Negative"}>
                {buttonEnabled? "Allocate items randomly": "Number of items per location must be even."}
            </Button>
          </div>
          <div>
            
          </div>
          </div>
          <div
              data-layout-indent="XL1 L1 M1 S0"
              data-layout-span="XL5 L5 M5 S12"
          >
          <AnalyticalTable
            columns={[
              {
                Header: 'Item ID',
                accessor: 'item.itemid'
              },
              {
                Header: 'Item Name',
                accessor: 'item.name'
              },
              {
                Header: 'Allocated Location',
                accessor: 'location'
              },
              {
                Header: 'Correctness',
                accessor: 'correctness'
              }
            ]}
            data={lastAllocation}
            filterable
            groupBy={[]}
            groupable
            header="Allocation Result"
            visibleRowCountMode="Fixed"
            visibleRows={5}
            rowHeight={44}
            selectionMode="SingleSelect"
            withRowHighlight
          />
        </div>

        <div style={{ textAlign: 'left' , marginTop: '50px'}}
          data-layout-indent="XL1 L1 M1 S0"
          data-layout-span="XL11 L11 M11 S12"
          >
        <Title level="H2">
            Allocation Statistics
        </Title>
        </div>
          <div
              data-layout-indent="XL1 L1 M1 S0"
              data-layout-span="XL5 L5 M5 S12"
          >
            <AnalyticalTable
            columns={[
              {
                Header: 'Item ID',
                accessor: 'key.itemid'
              },{
                Header: 'Item Name',
                accessor: 'key.name'
              },
              {
                Header: 'Correct',
                accessor: 'value.correct'
              },
              {
                Header: 'Incorrect',
                accessor: 'value.incorrect'
              }
            ]}
            data={Array.from(itemStatisticsMap).map(([key, value]) => ({key: key, value: value}))}
            filterable
            groupBy={[]}
            groupable
            header="Item Statistics"
            visibleRowCountMode="Fixed"
            visibleRows={5}
            rowHeight={44}
            selectionMode="SingleSelect"
            withRowHighlight
          />
        </div>

        <div
              data-layout-indent="XL1 L1 M1 S0"
              data-layout-span="XL5 L5 M5 S12"
          >
          <AnalyticalTable
              columns={[
                {
                  Header: 'Location Name',
                  accessor: 'key'
                },
                {
                  Header: 'Correct',
                  accessor: 'value.correct'
                },
                {
                  Header: 'Incorrect',
                  accessor: 'value.incorrect'
                }
              ]}
              data={Array.from(locationStatisticsMap).map(([key, value]) => ({key: key, value: value}))}
              filterable
              groupBy={[]}
              groupable
              header="Location Statistics"  
              visibleRowCountMode="Fixed"
              visibleRows={2}
              rowHeight={44}
              selectionMode="SingleSelect"
              withRowHighlight
            />
          </div>
        </React.Fragment>
      </Grid>     
    </div>
    </ThemeProvider>
  );
}

export default App;
