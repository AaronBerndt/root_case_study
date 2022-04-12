import * as fs from "fs";
import { Drivers, TripToAdd, Driver, DrivingReport } from "./types";
import { sumBy } from "lodash";

export function PrintReport(drivingReport: DrivingReport) {
  drivingReport.map(({ name, milesDrivenAvg, mphAvg }) => {
    if (isNaN(milesDrivenAvg)) {
      console.log(`${name}: 0 miles`);
    }

    console.log(`${name}: ${milesDrivenAvg} miles @ ${mphAvg} mph`);
  });
}

export function CreateDrivingReport(drivers: Drivers) {
  const drivingReport: DrivingReport = drivers.map(({ name, trips }) => ({
    name,
    milesDrivenAvg: sumBy(trips, "milesDriven") / trips.length,
    mphAvg: sumBy(trips, "mph") / trips.length,
  }));

  return drivingReport;
}

export function CreateNewDriver(driverName: string, drivers: Drivers) {
  if (drivers.find(({ name }) => name === driverName)) {
    throw new Error(`Driver ${driverName} already exists.`);
  }

  drivers.push({ name: driverName, trips: [] });
}

export function AddTripToDriver(tripToAdd: TripToAdd, drivers: Drivers) {
  const { driverName, milesDriven } = tripToAdd;

  const driverIndex: number = drivers.findIndex(
    ({ name }: Driver) => name === driverName
  );

  if (driverIndex === -1) {
    throw new Error(`Driver ${driverName} doesn't exist to add trip to`);
  }

  const mph =
    tripToAdd.milesDriven /
    (tripToAdd.stopTime.getMilliseconds() -
      tripToAdd.startTime.getMilliseconds());

  if (mph < 5 && mph < 100) {
    throw new Error(`MPH is too fast/slow`);
  }

  return drivers[driverIndex].trips.push({ milesDriven, mph });
}

export function CreateDriverList(fileOutput: string[]): Drivers {
  const drivers: Driver[] = [];
  // TODO Check if driver/trip values exists

  const createDateObject = (dateString: string) => {
    const today = new Date();
    const [hours, minutes] = dateString.split(":");
    return new Date(today.setHours(Number(hours), Number(minutes)));
  };

  fileOutput.forEach((line) => {
    const lineContents: string[] = line.split(" ");
    const action = lineContents[0];

    try {
      if (action === "Driver") {
        if (!lineContents[1]) {
          throw new Error(`Driver's name is missing from the action.`);
        }

        CreateNewDriver(lineContents[1], drivers);
      } else if (action === "Trip") {
        //TODO covert to Temporal
        const tripToAdd: TripToAdd = {
          driverName: lineContents[1],
          startTime: createDateObject(lineContents[2]),
          stopTime: createDateObject(lineContents[3]),
          milesDriven: Number(lineContents[4]),
        };

        if (tripToAdd) {
          // TODO Check if tripToAdd is proper
          throw new Error(`Trip to Add Object is invalid`);
        }

        // if (Math.sign(tripToAdd?.milesDriven) === -1) {
        //   throw new Error(`Miles driven is a negative number.`);
        // }

        AddTripToDriver(tripToAdd, drivers);
      } else {
        throw new Error(`Invalid Command`);
      }
    } catch (ex) {
      console.error(ex);
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

  if (inputFile !== "input.txt") {
    throw new Error("File isn't in the proper format.");
  }

  try {
    const data = fs.readFileSync(inputFile, "utf8").split("\n");
    const driverList = CreateDriverList(data);
    const drivingReport = CreateDrivingReport(driverList);
    PrintReport(drivingReport);
  } catch (ex) {
    console.error(ex);
  }
}
