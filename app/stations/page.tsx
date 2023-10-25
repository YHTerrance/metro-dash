'use client';

import { Text, Title } from '@tremor/react';
import StationSelect from './station-select';

export default function StationsPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Stations</Title>
      <Text>
        Learn about your favorite stations.
      </Text>
      <StationSelect/>
    </main>
  );
}
