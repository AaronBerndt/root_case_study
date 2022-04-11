import * as fs from "fs";

// function ParseDriverFile(file: string[]) {}

type Driver = {
  name: string;
  trips: Trip[];
};

type Drivers = Driver[];

type Trip = {
  startTime: Date;
  stopTime: Date;
  milesDriven: number;
};

type TripToAdd = {
  driverName: string;
  startTime: Date;
  stopTime: Date;
  milesDriven: number;
};

type Trips = Trip[];

export function CreateDrivingReport(drivers: Drivers) {
  return drivers;
}

export function CreateNewDriver(driverName: string, drivers: Drivers) {
  console.log(driverName);
  drivers.push({ name: driverName, trips: [] });
}

export function AddTripToDriver(tripToAdd: TripToAdd, drivers: Drivers) {
  const { driverName, ...rest } = tripToAdd;
  const driverIndex: number = drivers.findIndex(
    ({ name }: Driver) => name === driverName
  );

  if (driverIndex === -1) {
    throw new Error(`Driver ${driverName} doesn't exist to add trip to`);
  }
  return drivers[driverIndex].trips.push(rest);
}

export function CreateDriverList(fileOutput: string[]) {
  const drivers: Driver[] = [];

  fileOutput.forEach((line) => {
    const lineContents: string[] = line.split(" ");
    if (lineContents[0] === "Driver") {
      CreateNewDriver(lineContents[1], drivers);
    } else {
      AddTripToDriver(
        {
          driverName: lineContents[1],
          startTime: new Date(lineContents[2]),
          stopTime: new Date(lineContents[3]),
          milesDriven: Number(lineContents[4]),
        },
        drivers
      );
    }
  });

  return drivers;
}

export default async function StartProgram() {
  const args = process.argv;

  if (!args[2]) {
    throw new Error("No input file detected");
  }

  const inputFile = args[2];

  try {
    const data = fs.readFileSync(inputFile, "utf8");
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to Read input file.");
  }
}
