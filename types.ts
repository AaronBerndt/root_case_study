export type Driver = {
  name: string;
  trips: Trip[];
  invalidTripCount: number;
};

export type Drivers = Driver[];

export type DrivingReport = {
  name: string;
  milesDriven: number;
  milesDrivenOnHighway: number;
  mphAvg: number;
  invalidTripCount: number;
};

export type DrivingReports = DrivingReport[];

export type Trip = {
  milesDriven: number;
  mph: number;
  onHighway: boolean;
};

export type TripToAdd = {
  driverName: string;
  startTime: Date;
  stopTime: Date;
  milesDriven: number;
};

export type Trips = Trip[];
