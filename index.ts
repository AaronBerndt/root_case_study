import { readFileSync } from "fs";
import {
  Drivers,
  TripToAdd,
  Driver,
  DrivingReport,
  DrivingReports,
} from "./types";
import { orderBy, round, sumBy } from "lodash";

export const createDateObject = (dateString: string) => {
  const today = new Date();
  const [hours, minutes] = dateString.split(":");
  return new Date(today.setHours(Number(hours), Number(minutes), 0, 0));
};

export function PrintReport(
  drivingReports: DrivingReports,
  highwayReportFlag: boolean
) {
  orderBy(drivingReports, ["milesDrivenAvg"], ["desc"]).map((report) => {
    console.log(CreatePrintReportMessage(report, highwayReportFlag));
  });
}

export function CreatePrintReportMessage(
  report: DrivingReport,
  highwayReportFlag: boolean
) {
  const { name, milesDriven, mphAvg, milesDrivenOnHighway, invalidTripCount } =
    report;
  if (milesDriven === 0) {
    return `${name}: 0 miles`;
  } else {
    const mainReportContent = `${name}: ${milesDriven} miles driven @ ${mphAvg} mph`;
    const highwayReportContent = `percent on highway ${
      (milesDrivenOnHighway / milesDriven) * 100
    }%`;
    const invalidReportContent = `Invalid trips ${invalidTripCount}`;

    return `${mainReportContent} ${
      highwayReportFlag ? highwayReportContent : invalidReportContent
    }`;
  }
}

export function CreateDrivingReport(drivers: Drivers) {
  const drivingReport: DrivingReports = drivers.map(
    ({ name, trips, invalidTripCount }) => ({
      name,
      milesDriven: trips.length === 0 ? 0 : round(sumBy(trips, "milesDriven")),
      milesDrivenOnHighway: round(
        sumBy(
          trips.filter(({ onHighway }) => onHighway),
          "milesDriven"
        )
      ),
      invalidTripCount,
      mphAvg:
        trips.length === 0 ? 0 : round(sumBy(trips, "mph") / trips.length),
    })
  );

  return drivingReport;
}

export function CreateNewDriver(driverName: string, drivers: Drivers) {
  if (drivers.find(({ name }) => name === driverName)) {
    throw new Error(`Driver ${driverName} already exists.`);
  }

  drivers.push({
    name: driverName,
    trips: [],

    invalidTripCount: 0,
  });
}

export function AddTripToDriver(tripToAdd: TripToAdd, drivers: Drivers) {
  const { driverName, milesDriven, stopTime, startTime } = tripToAdd;

  const driverIndex: number = drivers.findIndex(
    ({ name }: Driver) => name === driverName
  );

  if (driverIndex === -1) {
    throw new Error(`Driver ${driverName} doesn't exist to add trip to.`);
  }

  const timeDifference = stopTime.getTime() - startTime.getTime();

  const mph = milesDriven / (timeDifference / 1000 / 60 / 60);
  const milesDrivenOnHighway = milesDriven / (timeDifference / 1000 / 60 / 60);

  if (mph > 5 || mph > 100) {
    const isOnHighway = mph >= 50;

    return drivers[driverIndex].trips.push({
      milesDriven,
      mph,
      onHighway: isOnHighway,
    });
  } else {
    const { invalidTripCount, ...rest } = drivers[driverIndex];

    drivers[driverIndex] = { ...rest, invalidTripCount: invalidTripCount + 1 };
  }
}

export function CreateDriverList(fileOutput: string[]): Drivers {
  const drivers: Driver[] = [];

  fileOutput.forEach((line) => {
    const lineContents: string[] = line.split(" ");

    const action = lineContents[0];
    const driverName = lineContents[1];

    if (action !== "Driver" && action !== "Trip") {
      throw new Error(`Invalid Command`);
    }

    if (action === "Driver") {
      if (!/^[a-zA-Z]+$/.test(driverName)) {
        throw new Error(`Driver ${driverName} name is invalid.`);
      }

      return CreateNewDriver(driverName, drivers);
    } else if (action === "Trip") {
      const startTime = createDateObject(lineContents[2]);
      const stopTime = createDateObject(lineContents[3]);
      const milesDriven = Number(lineContents[4]);

      const tripToAdd: TripToAdd = {
        driverName,
        startTime,
        stopTime,
        milesDriven,
      };

      if (
        !/^[a-zA-Z]+$/.test(driverName) ||
        startTime.toString() === "Invalid Date" ||
        stopTime.toString() === "Invalid Date" ||
        typeof milesDriven !== "number"
      ) {
        throw new Error(`Trip to Add Object is invalid.`);
      }

      if (Math.sign(milesDriven) === -1) {
        throw new Error(`Miles driven is a negative number.`);
      }

      return AddTripToDriver(tripToAdd, drivers);
    }
  });

  return drivers;
}

export default function StartProgram() {
  const args = process.argv;

  if (!args[2]) {
    throw new Error("No input file detected");
  }

  const inputFile = args[2];
  const highwayFlag = args[3];

  if (inputFile !== "input.txt") {
    throw new Error("File isn't in the proper format.");
  }

  try {
    const data = readFileSync(inputFile, "utf8")
      .split("\n")
      .filter((line) => line !== "");

    if (data.length === 0) {
      throw new Error(`Input file is empty.`);
    }

    const driverList = CreateDriverList(data);
    const drivingReport = CreateDrivingReport(driverList);
    PrintReport(drivingReport, highwayFlag === "false");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

if (process.env.EXECUTE_PROGRAM) {
  StartProgram();
}
