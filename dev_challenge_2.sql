-- Create the database:
CREATE DATABASE ItemAllocation;

-- Table for original items
CREATE TABLE Items (
    ItemID INT PRIMARY KEY,
    ItemName VARCHAR(50),
    ItemLocation VARCHAR(20) -- Kitchen or Bathroom
);

-- Table for execution runs
CREATE TABLE ExecutionRuns (
    RunID INT PRIMARY KEY,
    RunDate DATETIME
);

-- Table for execution results
CREATE TABLE ExecutionResults (
    ResultID INT PRIMARY KEY,
    ItemID INT,
    RunID INT,
    CorrectlyAllocated BOOLEAN,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
    FOREIGN KEY (RunID) REFERENCES ExecutionRuns(RunID)
);



-- Insert data for items
INSERT INTO Items (ItemID, ItemName, ItemLocation)
VALUES  (1, 'Table', 'Kitchen'),
        (2, 'Knife', 'Kitchen'),
        (3, 'Sink', 'Bathroom'),
        (4, 'Toothbrush', 'Bathroom'),
        (5, 'Comb', 'Bathroom'),
        (6, 'Shampoo', 'Bathroom');
       

-- Insert data for execution runs and results
INSERT INTO ExecutionRuns (RunID, RunDate)
VALUES  (1, '2024-03-11 00:00:00'),
        (2, '2024-03-12 00:00:00'),
        (3, '2024-03-13 00:00:00'),
        (4, '2024-03-14 00:00:00'),
        (5, '2024-03-15 00:00:00');

INSERT INTO ExecutionResults (ResultID, ItemID, RunID, CorrectlyAllocated)
VALUES  (1, 1, 1, true),
        (2, 2, 1, false),
        (3, 3, 1, true),
        (4, 4, 1, true),
        (5, 5, 1, false),
        (6, 6, 1, false),
        (7, 1, 2, false),
        (8, 2, 2, true),
        (9, 3, 2, false),
        (10, 4, 2, false),
        (11, 5, 2, true),
        (12, 6, 2, true),
        (13, 1, 3, true),
        (14, 2, 3, false),
        (15, 3, 3, false),
        (16, 4, 3, false),
        (17, 5, 3, true),
        (18, 6, 3, true),
        (19, 1, 4, false),
        (20, 2, 4, true),
        (21, 3, 4, true),
        (22, 4, 4, false),
        (23, 5, 4, true),
        (24, 6, 4, false),
        (25, 1, 5, true),
        (26, 2, 5, false),
        (27, 3, 5, true),
        (28, 4, 5, true),
        (29, 5, 5, false),
        (30, 6, 5, false);


-- Statement that returns per item, how many times it was allocated correctly and incorrectly
SELECT
    Items.ItemID,
    Items.ItemName,
    SUM(CASE WHEN ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS CorrectAllocations,
    SUM(CASE WHEN NOT ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS IncorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
GROUP BY
    Items.ItemID, Items.ItemName;


-- Statement that returns per location, how many times items were allocated correctly and incorrectly
SELECT
    Items.ItemLocation,
    SUM(CASE WHEN ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS CorrectAllocations,
    SUM(CASE WHEN NOT ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS IncorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
GROUP BY
    Items.ItemLocation;


-- Statement that returns per item, how many times it was allocated correctly and incorrectly but only on Mondays
SELECT
    Items.ItemID,
    Items.ItemName,
    SUM(CASE WHEN ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS CorrectAllocations,
    SUM(CASE WHEN NOT ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS IncorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
JOIN
    ExecutionRuns ON ExecutionResults.RunID = ExecutionRuns.RunID
WHERE
    WEEKDAY(ExecutionRuns.RunDate) = 0 -- 0 = Monday
GROUP BY
    Items.ItemID, Items.ItemName;


-- Statement that returns per location, how many times items were allocated correctly and incorrectly but only on Mondays
SELECT
    Items.ItemLocation,
    SUM(CASE WHEN ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS CorrectAllocations,
    SUM(CASE WHEN NOT ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS IncorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
JOIN
    ExecutionRuns ON ExecutionResults.RunID = ExecutionRuns.RunID
WHERE
    WEEKDAY(ExecutionRuns.RunDate) = 0 -- 0 = Monday
GROUP BY
    Items.ItemLocation;



-- Statement that returns per item, how many times it was allocated correctly and incorrectly but only the last 10 executions
SELECT
    Items.ItemID,
    Items.ItemName,
    SUM(CASE WHEN ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS CorrectAllocations,
    SUM(CASE WHEN NOT ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS IncorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
JOIN
	(SELECT RunID
    FROM ExecutionRuns
    ORDER BY RunDate DESC
    LIMIT 10) AS LastTen ON ExecutionResults.RunID = LastTen.RunID
GROUP BY
    Items.ItemID, Items.ItemName;


-- Statement that returns per location, how many times items were allocated correctly and incorrectly but only the last 10 executions
SELECT
    Items.ItemLocation,
    SUM(CASE WHEN ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS CorrectAllocations,
    SUM(CASE WHEN NOT ExecutionResults.CorrectlyAllocated THEN 1 ELSE 0 END) AS IncorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
JOIN
	(SELECT RunID
    FROM ExecutionRuns
    ORDER BY RunDate DESC
    LIMIT 10) AS LastTen ON ExecutionResults.RunID = LastTen.RunID
GROUP BY
    Items.ItemLocation;



-- Statement that returns the item that was allocated correctly most often
SELECT
    Items.ItemID,
    Items.ItemName,
    COUNT(*) AS CorrectAllocations
FROM
    Items
JOIN
    ExecutionResults ON Items.ItemID = ExecutionResults.ItemID
WHERE
    ExecutionResults.CorrectlyAllocated = true
GROUP BY
    Items.ItemID, Items.ItemName
ORDER BY
    CorrectAllocations DESC
LIMIT 1;