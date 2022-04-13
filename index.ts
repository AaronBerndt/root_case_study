import * as fs from "fs";
import { Drivers, TripToAdd, Driver, DrivingReport } from "./types";
import { orderBy, sumBy } from "lodash";

export function PrintReport(drivingReport: DrivingReport) {
  orderBy(drivingReport, ["milesDrivenAvg"], ["desc"]).map(
    ({ name, milesDrivenAvg, mphAvg }) => {
      if (milesDrivenAvg === 0) {
        console.log(`${name}: 0 miles`);
      } else {
        console.log(`${name}: ${milesDrivenAvg} miles @ ${mphAvg} mph`);
      }
    }
  );
}

export function CreateDrivingReport(drivers: Drivers) {
  const drivingReport: DrivingReport = drivers.map(({ name, trips }) => ({
    name,
    milesDrivenAvg:
      trips.length === 0 ? 0 : sumBy(trips, "milesDriven") / trips.length,
    mphAvg: trips.length === 0 ? 0 : sumBy(trips, "mph") / trips.length,
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
    throw new Error(`Driver ${driverName} doesn't exist to add trip to.`);
  }

  const mph =
    tripToAdd.milesDriven /
    (tripToAdd.stopTime.getMilliseconds() -
      tripToAdd.startTime.getMilliseconds());

  if (mph > 5 || mph > 100) {
    return drivers[driverIndex].trips.push({ milesDriven, mph });
  }
}

export function CreateDriverList(fileOutput: string[]): Drivers {
  const drivers: Driver[] = [];

  const createDateObject = (dateString: string) => {
    const today = new Date();
    const [hours, minutes] = dateString.split(":");
    return new Date(today.setHours(Number(hours), Number(minutes)));
  };

  fileOutput.forEach((line) => {
    const lineContents: string[] = line.split(" ");
    const action = lineContents[0];
    const driverName = lineContents[1];
    const startTime = createDateObject(lineContents[2]);
    const stopTime = createDateObject(lineContents[3]);
    const milesDriven = Number(lineContents[4]);

    try {
      if (action === "Driver") {
        if (typeof driverName !== "string") {
          throw new Error(`Driver ${driverName} name is invalid.`);
        }

        CreateNewDriver(driverName, drivers);
      } else if (action === "Trip") {
        const tripToAdd: TripToAdd = {
          driverName,
          startTime,
          stopTime,
          milesDriven,
        };

        if (
          typeof driverName !== "string" ||
          startTime.toString() === "Invalid Date" ||
          stopTime.toString() === "Invalid Date" ||
          typeof milesDriven !== "number"
        ) {
          throw new Error(`Trip to Add Object is invalid.`);
        }

        if (Math.sign(milesDriven) === -1) {
          throw new Error(`Miles driven is a negative number.`);
        }

        AddTripToDriver(tripToAdd, drivers);
      } else {
        throw new Error(`Invalid Command`);
      }
    } catch (error) {
      throw error;
    }
  });

  return drivers;
}

export function StartProgram() {
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
  } catch (error) {
    throw error;
  }
}
