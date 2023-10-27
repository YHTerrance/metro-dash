'use client';

import { Card, AreaChart, Title, Text, Color } from '@tremor/react';
interface ChartData {
  title: string,
  description: string,
  data: any[],
  index: string,
  categories: string[],
  colors: Color[]
}

export default function Chart({ chart_data }: { chart_data: ChartData }) {
  return (
    <Card className="mt-6">
      <Title>{chart_data.title}</Title>
      <Text>{chart_data.description}</Text>
      <AreaChart
        className="mt-4 h-80"
        data={chart_data.data}
        index={chart_data.index}
        categories={chart_data.categories}
        colors={chart_data.colors}
        valueFormatter={(number: number) =>
          `${Intl.NumberFormat('us').format(number).toString()}`
        }
        yAxisWidth={80}
        autoMinValue={true}
        showAnimation={true}
      />
    </Card>
  );
}
