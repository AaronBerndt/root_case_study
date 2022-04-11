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
  it("AddTripToDriver", () => {
    expect(
      CreateDriverList(["Driver John", "Trip John 07:15 07:45 17.3"])
    ).toStrictEqual("");
  });

  it("AddTripToDriver: Throw Error", () => {
    CreateDriverList(["Trip Dan 07:15 07:45 17.3"]);
    expect(CreateDriverList(["Trip Dan 07:15 07:45 17.3"])).toThrowError("");
  });
});
