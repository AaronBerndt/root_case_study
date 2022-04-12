import StartProgram, {
  AddTripToDriver,
  CreateNewDriver,
  CreateDriverList,
} from ".";
import { Drivers } from "./types";

const createDateObject = (dateString: string) => {
  const today = new Date();
  const [hours, minutes] = dateString.split(":");
  return new Date(today.setHours(Number(hours), Number(minutes)));
};

// describe("End to End", () => {
//   it("Should Create Report", () => {
//     process.argv = ["", "", "input.txt"];

//     expect(StartProgram).toBe("");
//   });

//   it("Throw Error: No Input File", () => {
//     process.argv = ["", ""];
//     expect(StartProgram).toThrowError();
//   });

//   it("Throw Error: Failed to Read input file", () => {
//     process.argv = ["", ""];
//     expect(StartProgram).toThrowError();
//   });

//   it("Throw Error: File isn't a input file", () => {
//     process.argv = ["", ""];
//     expect(StartProgram).toThrowError();
//   });
// });

describe("CreateDriverList", () => {
  it("Throw Error: Driver's name missing", () => {
    expect(CreateDriverList(["Trips Dan Dan 07:45 17.3"])).toThrow(
      "Invalid Command"
    );
  });
  it("Throw Error: Driver's name missing", () => {
    expect(CreateDriverList(["Driver "])).toThrow("");
  });
  it("Throw Error: TripToAdd is wrong", () => {
    expect(CreateDriverList(["Trip Dan Dan 07:45 17.3"])).toThrow(
      "TripToAdd is wrong"
    );
  });
  it("Throw Error: milesDriven is negative", () => {
    expect(CreateDriverList(["Trip Dan 07:30 07:45 -1"])).toThrow(
      "TripToAdd is wrong"
    );
  });
});

describe("AddTripToDriver", () => {
  const createTripToAdd = (driverName: string, milesDriven: number) => ({
    driverName,
    startTime: createDateObject("03:10"),
    stopTime: createDateObject("03:15"),
    milesDriven,
  });

  let drivers = [
    {
      name: "John",
      trips: [],
    },
  ];

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
    expect(AddTripToDriver(createTripToAdd("Dan", 17), drivers)).toThrow(
      "Driver Dan doesn't exist to add trip to."
    );
  });
  it("Throw Error: Driving Too Fast/Slow", () => {
    expect(AddTripToDriver(createTripToAdd("John", 17), drivers)).toThrow(
      "Driver Dan doesn't exist to add trip to."
    );
  });
});

describe("CreateNewDriver", () => {
  let drivers: Drivers = [];
  beforeEach(() => {
    drivers = [];
  });

  it("Creates new driver", () => {
    CreateDriverList(["Driver John"]);
    expect(drivers).toStrictEqual([{ name: "John", trips: [] }]);
  });

  it("Throw Error: Driver Exists", () => {
    drivers = [
      {
        name: "John",
        trips: [],
      },
    ];

    expect(CreateNewDriver("John", drivers)).toThrowError(
      "Driver John already exists."
    );
  });
});
