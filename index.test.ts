import StartProgram, {
  AddTripToDriver,
  CreateNewDriver,
  CreateDriverList,
} from ".";

// describe("End to End", () => {
//   it("Should Create Report", () => {
//     process.argv = ["", "", "testFile.txt"];

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
// });

describe("CreateDriverList", () => {
  it("CreateNewDriver", () => {
    expect(CreateDriverList(["Driver John"])).toStrictEqual([
      { name: "John", trips: [] },
    ]);
  });
  it("CreateNewDriver: Throw Error", () => {
    expect(CreateNewDriver("John", [{ name: "John", trips: [] }])).toThrowError(
      "Driver John already exists."
    );
  });

  it("AddTripToDriver", () => {
    expect(
      CreateDriverList(["Driver John", "Trip John 07:15 07:45 17.3"])
    ).toStrictEqual("");
  });

  it("CreateDriverList: Driving Too Fast/Slow", () => {
    CreateDriverList(["Trip Dan 07:15 07:45 17.3"]);
    expect(CreateDriverList(["Trip Dan 07:15 07:45 17.3"])).toThrow(
      "Driver Dan doesn't exist to add trip to."
    );
  });

  it("AddTripToDriver: Throw Error", () => {
    CreateDriverList(["Trip Dan 07:15 07:45 17.3"]);
    expect(CreateDriverList(["Trip Dan 07:15 07:45 17.3"])).toThrow(
      "Driver Dan doesn't exist to add trip to."
    );
  });
  it("CreateDriverList: Driving Too Fast/Slow", () => {
    CreateDriverList(["Trip Dan 07:15 07:45 17.3"]);
    expect(CreateDriverList(["Trip Dan 07:15 07:45 17.3"])).toThrow(
      "Driver Dan doesn't exist to add trip to."
    );
  });
});
