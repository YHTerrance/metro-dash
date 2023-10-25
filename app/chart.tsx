'use client';

import { Card, AreaChart, Title, Text } from '@tremor/react';

const week_data = [
  {
    Day: 'Mon',
    "人次": 2890,
  },
  {
    Day: 'Tue',
    "人次": 2478,
  },
  {
    Day: 'Web',
    "人次": 2642,
  },
  {
    Day: 'Thu',
    "人次": 2178,
  },
  {
    Day: 'Fri',
    "人次": 2678,
  },
  {
    Day: 'Sat',
    "人次": 1435,
  },
  {
    Day: 'Sun',
    "人次": 1089,
  },
];

export default function Chart() {
  return (
    <Card className="mt-8">
      <Title>每週各日平均載客量</Title>
      <Text>比較在一周不同天的平均日載客量</Text>
      <AreaChart
        className="mt-4 h-80"
        data={week_data}
        categories={['人次']}
        index="Day"
        colors={['indigo', 'fuchsia']}
        valueFormatter={(number: number) =>
          `${Intl.NumberFormat('us').format(number).toString()}`
        }
        yAxisWidth={60}
      />
    </Card>
  );
}
