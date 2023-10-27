import { queryBuilder } from '../lib/planetscale';

import Dashboard from './dashboard';

export const dynamic = 'force-dynamic';

const dateToMonth = (date: string) => {
  const [year, month] = date.split('-');
  return `${year}-${month}`;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {

  const totalPassengers = await queryBuilder
  .selectFrom('TotalPassengers')
  .select(['month', 'total_passengers'])
  .execute();

  const months: string[] = totalPassengers.map(item => dateToMonth(item.month));
  const selectedMonth = searchParams.q ?? months[months.length - 1];

  const popularRoutes = await queryBuilder
  .selectFrom('Routes')
  .select(['station_one_id', 'station_two_id', 'passengers'])
  .where('month', '=', `${selectedMonth}-01`)
  .orderBy('passengers', 'desc')
  .limit(10)
  .execute();

  const popularStations = await queryBuilder
  .selectFrom('StationsInfo')
  .select(['station_id', 'passengers'])
  .where('month', '=', `${selectedMonth}-01`)
  .orderBy('passengers', 'desc')
  .limit(10)
  .execute();

  const passengersByTimePeriod = await queryBuilder
  .selectFrom('PassengersByTimePeriod')
  .select(['time_period', 'avg_passengers'])
  .where('month', '=', `${selectedMonth}-01`)
  .orderBy('time_period', 'asc')
  .execute();

  const passengersByWeekday = await queryBuilder
  .selectFrom('PassengersByWeekday')
  .select(['weekday', 'avg_passengers'])
  .where('month', '=', `${selectedMonth}-01`)
  .orderBy('id', 'asc')
  .execute();

  const stations = await queryBuilder
  .selectFrom('Stations')
  .select(['station_id', 'station_name'])
  .execute();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Dashboard
        totalPassengers={totalPassengers}
        popularRoutes={popularRoutes}
        popularStations={popularStations}
        passengersByTimePeriod={passengersByTimePeriod}
        passengersByWeekday={passengersByWeekday}
        stations={stations}
      />
    </main>
  );
}
