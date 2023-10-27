import 'server-only';
import { Generated, Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

interface User {
  id: Generated<number>;
  name: string;
  username: string;
  email: string;
}

interface TotalPassengers {
  id: Generated<number>;
  month: string;
  total_passengers: number;
}

interface Routes {
  id: Generated<number>;
  month: string;
  station_one_id: number;
  station_two_id: number;
  passengers: number;
}

interface Stations {
  station_id: Generated<number>;
  station_name: string;
}

interface StationsInfo {
  id: Generated<number>;
  month: string;
  station_id: number;
  passengers: number;
}

interface PassengersByTimePeriod {
  id: Generated<number>;
  month: string;
  time_period: number;
  avg_passengers: number;
}

interface PassengersByWeekday {
  id: Generated<number>;
  month: string;
  weekday: string;
  avg_passengers: number;
}

interface Database {
  users: User;
  TotalPassengers: TotalPassengers;
  Routes: Routes;
  StationsInfo: StationsInfo;
  PassengersByTimePeriod: PassengersByTimePeriod;
  PassengersByWeekday: PassengersByWeekday;
  Stations: Stations;
  // https://github.com/nextauthjs/next-auth/issues/4922
}

export const queryBuilder = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL
  })
});
