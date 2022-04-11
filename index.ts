import * as fs from "fs";
import { Drivers, TripToAdd, Driver } from "./types";

// function ParseDriverFile(file: string[]) {}

export function CalculateMPH(time: number, miles: number) {
  return miles / time;
}

export function CreateDrivingReport(drivers: Drivers) {
  // TODO Check Create Report
  return drivers;
}

export function CreateNewDriver(driverName: string, drivers: Drivers) {
  if (typeof driverName !== "string") {
    throw new Error(`${driverName} is not a string`);
  }

  if (drivers.find(({ name }) => name === driverName)) {
    throw new Error(`Driver ${driverName} already exists.`);
  }
  drivers.push({ name: driverName, trips: [] });
}

export function AddTripToDriver(tripToAdd: TripToAdd, drivers: Drivers) {
  // TODO Check if Trip props before adding
  const { driverName, ...rest } = tripToAdd;

  if (typeof driverName !== "string") {
    throw new Error(`${driverName} is not a string`);
  }

  const driverIndex: number = drivers.findIndex(
    ({ name }: Driver) => name === driverName
  );

  if (driverIndex === -1) {
    throw new Error(`Driver ${driverName} doesn't exist to add trip to`);
  }

  const mph = CalculateMPH(100, tripToAdd.milesDriven);

  if (mph < 5 && mph < 100) {
    throw new Error(`Speed`);
  }

  return drivers[driverIndex].trips.push(rest);
}

export function CreateDriverList(fileOutput: string[]) {
  const drivers: Driver[] = [];
  // TODO Check if driver/trip values exists

  fileOutput.forEach((line) => {
    const lineContents: string[] = line.split(" ");
    if (lineContents[0] === "Driver") {
      if (!lineContents[1]) {
        throw new Error(`driver name is missing from action.`);
      }

      CreateNewDriver(lineContents[1], drivers);
    } else {
      if (!lineContents[1]) {
        throw new Error(`driver name is missing from action.`);
      }

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
