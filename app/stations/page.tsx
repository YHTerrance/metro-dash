import { Text, Title, Card, Metric, Flex } from '@tremor/react';
import { queryBuilder } from '../../lib/planetscale';

import StationSelect from './station-select';

export default async function StationsPage({
  searchParams
}: {
  searchParams: { s: string };
}) {

  const stations = await queryBuilder
  .selectFrom('Stations')
  .select(['station_name'])
  .execute();

  const selectedStation = searchParams.s ?? '';

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>捷運站</Title>
      <Text>
        深入了解單一個捷運站
      </Text>
      <StationSelect stations={stations} selectedStation={selectedStation}/>
      <Card className="mt-4 w-full h-96 mx-auto shadow-md">
        <Flex className="h-full" justifyContent='center' alignItems='center'>
          <div>
            <Text>敬請期待...</Text>
          </div>
        </Flex>
      </Card>
    </main>
  );
}
