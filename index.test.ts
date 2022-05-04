import * as fs from "fs";
import StartProgram, {
  AddTripToDriver,
  CreateNewDriver,
  CreateDriverList,
  CreateDrivingReport,
  CreatePrintReportMessage,
  createDateObject,
  PrintReport,
} from ".";
import { Drivers } from "./types";
jest.mock("fs");

const mockedReadFileSync = jest.mocked(fs.readFileSync, true);

const inputFileContents = [
  "Driver Dan",
  "Driver Lauren",
  "Driver Kumi",
  "Trip Dan 07:15 07:45 17.3",
  "Trip Dan 06:12 06:32 21.8",
  "Trip Lauren 12:01 13:16 42.0",
];

let drivers: Drivers = [
  {
    name: "John",
    trips: [
      { milesDriven: 10, mph: 10, onHighway: false },
      { milesDriven: 10, mph: 5, onHighway: false },
    ],
    invalidTripCount: 0,
  },
];

const drivingReports = [
  {
    milesDriven: 20,
    milesDrivenOnHighway: 0,
    mphAvg: 8,
    invalidTripCount: 0,
    name: "John",
  },
  {
    milesDriven: 0,
    milesDrivenOnHighway: 0,
    mphAvg: 0,
    invalidTripCount: 0,
    name: "Sarah",
  },
];

const createTripToAdd = (driverName: string, milesDriven: number) => ({
  driverName,
  startTime: createDateObject("04:00"),
  stopTime: createDateObject("05:00"),
  milesDriven,
});

describe("End to End", () => {
  afterEach(() => jest.clearAllMocks());
  it("Should Print Report", () => {
    const consoleSpy = jest.spyOn(console, "log");
    process.argv = ["", "", "input.txt", "false"];
    mockedReadFileSync.mockReturnValue(`Driver Dan
Driver Lauren
Driver Kumi
Trip Dan 07:15 07:45 17.3
Trip Dan 06:12 06:32 21.8
Trip Lauren 12:01 13:16 42.0
`);

    StartProgram();
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });

  it("Throw Error: No Input File", () => {
    process.argv = ["", ""];
    expect(StartProgram).toThrow("No input file detected");
  });
  it("Throw Error: File isn't a input file", () => {
    process.argv = ["", "", "test.txt"];

    expect(StartProgram).toThrow("File isn't in the proper format.");
  });

  it("Throw Error: input file is empty", () => {
    process.argv = ["", "", "input.txt"];
    mockedReadFileSync.mockReturnValue("");
    expect(StartProgram).toThrow("Input file is empty.");
  });
});

describe("CreatePrintReportMessage", () => {
  it("Report is invalid driving report", () => {
    const reportContent = CreatePrintReportMessage(drivingReports[0], false);

    expect(reportContent).toBe("John: 20 miles driven @ 8 mph Invalid trips 0");
  });
  it("Report is highway report", () => {
    const reportContent = CreatePrintReportMessage(drivingReports[0], true);

    expect(reportContent).toBe(
      "John: 20 miles driven @ 8 mph percent on highway 0%"
    );
  });
});

describe("PrintReport", () => {
  it("Report Printed", () => {
    const consoleSpy = jest.spyOn(console, "log");

    PrintReport(drivingReports, false);

    expect(consoleSpy).toHaveBeenCalledTimes(drivingReports.length);
  });
});

describe("CreateDrivingReport", () => {
  it("Create Report", () => {
    expect(
      CreateDrivingReport([
        ...drivers,
        { name: "Sarah", trips: [], invalidTripCount: 0 },
      ])
    ).toStrictEqual(drivingReports);
  });
});

describe("CreateDriverList", () => {
  it("Create Driver List", () => {
    expect(CreateDriverList(inputFileContents)).toStrictEqual([
      {
        name: "Dan",
        trips: [
          { milesDriven: 17.3, mph: 34.6, onHighway: false },
          { milesDriven: 21.8, mph: 65.4, onHighway: true },
        ],
        invalidTripCount: 0,
      },
      {
        name: "Lauren",
        trips: [{ milesDriven: 42, mph: 33.6, onHighway: false }],
        invalidTripCount: 0,
      },
      {
        name: "Kumi",
        trips: [],
        invalidTripCount: 0,
      },
    ]);
  });

  it("Throw Error: Invalid Command", () => {
    expect(() => CreateDriverList(["Trips Dan Dan 07:45 17.3"])).toThrow(
      "Invalid Command"
    );
  });
  it("Throw Error: Driver's name missing", () => {
    expect(() => CreateDriverList(["Driver "])).toThrow("");
  });
  it("Throw Error: TripToAdd object is invalid", () => {
    expect(() => CreateDriverList(["Trip Dan Dan 07:45 17.3"])).toThrow(
      "Trip to Add Object is invalid."
    );
  });
  it("Throw Error: milesDriven is negative", () => {
    expect(() => CreateDriverList(["Trip Dan 07:30 07:45 -1"])).toThrow(
      "Miles driven is a negative number."
    );
  });
});

describe("AddTripToDriver", () => {
  beforeEach(() => {
    drivers = [
      {
        name: "John",
        trips: [],
        invalidTripCount: 0,
      },
    ];
  });

  it("Add trip to driver: Not on Highway", () => {
    AddTripToDriver(createTripToAdd("John", 10), drivers);
    expect(drivers[0].trips).toHaveLength(1);
    console.log(drivers[0].trips[0].onHighway);
    expect(drivers[0].trips[0].onHighway).toBeFalsy();
  });

  it("Add trip to driver: On Highway", () => {
    AddTripToDriver(createTripToAdd("John", 50), drivers);
    expect(drivers[0].trips).toHaveLength(1);
    expect(drivers[0].trips[0].onHighway).toBeTruthy();
  });

  it("Add trip to driver: Increase Invalid Count", () => {
    AddTripToDriver(createTripToAdd("John", 1), drivers);
    expect(drivers[0].trips).toHaveLength(0);
    expect(drivers[0].invalidTripCount).toBe(1);
  });

  it("Throw Error: Driver doesn't exist", () => {
    expect(() => AddTripToDriver(createTripToAdd("Dan", 17), drivers)).toThrow(
      "Driver Dan doesn't exist to add trip to."
    );
  });
});

describe("CreateNewDriver", () => {
  beforeEach(() => {
    drivers = [];
  });

  it("Creates new driver", () => {
    CreateNewDriver("John", drivers);
    expect(drivers).toStrictEqual([
      {
        name: "John",
        trips: [],
        invalidTripCount: 0,
      },
    ]);
  });

  it("Throw Error: Driver Exists", () => {
    drivers = [
      {
        name: "John",
        trips: [],
        invalidTripCount: 0,
      },
    ];

    expect(() => CreateNewDriver("John", drivers)).toThrow(
      "Driver John already exists."
    );
  });
});
