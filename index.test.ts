import * as fs from "fs";
import {
  StartProgram,
  AddTripToDriver,
  CreateNewDriver,
  CreateDriverList,
  CreateDrivingReport,
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
      { milesDriven: 10, mph: 10 },
      { milesDriven: 10, mph: 5 },
    ],
  },
];

const drivingReport = [
  {
    milesDrivenAvg: 10,
    mphAvg: 7.5,
    name: "John",
  },
  {
    milesDrivenAvg: 0,
    mphAvg: 0,
    name: "Sarah",
  },
];

const createTripToAdd = (driverName: string, milesDriven: number) => ({
  driverName,
  startTime: createDateObject("03:10"),
  stopTime: createDateObject("03:15"),
  milesDriven,
});

const createDateObject = (dateString: string) => {
  const today = new Date();
  const [hours, minutes] = dateString.split(":");
  return new Date(today.setHours(Number(hours), Number(minutes), 0, 0));
};

describe("End to End", () => {
  afterEach(() => jest.clearAllMocks());
  it("Should Print Report", () => {
    const consoleSpy = jest.spyOn(console, "log");
    process.argv = ["", "", "input.txt"];
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

describe("PrintReport", () => {
  it("Report Printed", () => {
    const consoleSpy = jest.spyOn(console, "log");

    PrintReport(drivingReport);

    expect(consoleSpy).toHaveBeenCalledTimes(drivingReport.length);
  });
});

describe("CreateDrivingReport", () => {
  it("Create Report", () => {
    expect(
      CreateDrivingReport([...drivers, { name: "Sarah", trips: [] }])
    ).toStrictEqual(drivingReport);
  });
});

describe("CreateDriverList", () => {
  it("Create Driver List", () => {
    expect(CreateDriverList(inputFileContents)).toStrictEqual([
      {
        name: "Dan",
        trips: [
          { milesDriven: 17.3, mph: 34.6 },
          { milesDriven: 21.8, mph: 65.4 },
        ],
      },
      { name: "Lauren", trips: [{ milesDriven: 42, mph: 33.6 }] },
      { name: "Kumi", trips: [] },
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
      },
    ];
  });

  it("Add trip to driver", () => {
    AddTripToDriver(createTripToAdd("John", 17), drivers);
    expect(drivers[0].trips).toHaveLength(1);
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
    expect(drivers).toStrictEqual([{ name: "John", trips: [] }]);
  });

  it("Throw Error: Driver Exists", () => {
    drivers = [
      {
        name: "John",
        trips: [],
      },
    ];

    expect(() => CreateNewDriver("John", drivers)).toThrow(
      "Driver John already exists."
    );
  });
});
