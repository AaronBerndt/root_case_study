export type Driver = {
  name: string;
  trips: Trip[];
};

export type Drivers = Driver[];

export type Trip = {
  startTime: Date;
  stopTime: Date;
  milesDriven: number;
};

export type TripToAdd = {
  driverName: string;
  startTime: Date;
  stopTime: Date;
  milesDriven: number;
};

export type Trips = Trip[];
