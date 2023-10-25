import {
  Card,
  Title,
  Text,
  Grid,
  Flex,
  BarList,
  Metric,
  BadgeDelta,
  AreaChart,
  Select,
  SelectItem,
} from '@tremor/react';

import { queryBuilder } from '../lib/planetscale';
import Search from './search';
import UsersTable from './table';
import Chart from './chart';

const datasets = [
  { year: "2023", month: "8" },
  { year: "2023", month: "9" },
  { year: "2023", month: "10" },
]

const trips = [
  { name: '台北車站 - 西門站', value: 1230 },
  { name: '石牌站 - 圓山站', value: 751 },
  { name: '淡水站 - 中正紀念堂站', value: 471 },
  { name: '復興崗站 - 北投站', value: 280 },
  { name: '台北 101 站 - 板橋站', value: 78 }
];

const stations = [
  { name: '台北車站', value: 1230 },
  { name: '石牌站', value: 751 },
  { name: '淡水站', value: 471 },
  { name: '復興崗站', value: 280 },
  { name: '台北 101 站', value: 78 }
];

const populars = [
  {
    category: '熱門路線',
    stat: '台北車站 - 西門站',
    data: trips,
    unit: '人次',
    ranking: '熱門路線排行'
  },
  {
    category: '熱門車站',
    stat: '台北車站',
    data: stations,
    unit: '人次',
    ranking: '熱門車站排行'
  },

];

const passengers = [
  {
    Month: "Jan 21",
    Count: 2890,
  },
  {
    Month: "Feb 21",
    Count: 1890,
  },
  {
    Month: "Mar 21",
    Count: 1724,
  },
  {
    Month: "Apr 21",
    Count: 1098,
  },
  {
    Month: "May 21",
    Count: 5432,
  },
  {
    Month: "Jun 21",
    Count: 3987,
  }
];

export const dynamic = 'force-dynamic';

function valueFormatter(number: number) {
  return Intl.NumberFormat("us").format(number).toString();
};

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {

  // const search = searchParams.q ?? '';
  // const users = await queryBuilder
  //   .selectFrom('users')
  //   .select(['id', 'name', 'username', 'email'])
  //   .where('name', 'like', `%${search}%`)
  //   .execute();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">

      <Flex alignItems='start'>
        <div>
          <Title>總覽</Title>
          <Text>
            台北捷運月數據概況
          </Text>
        </div>
        <Select className="max-w-fit" enableClear={false}>
          {datasets.map((item) => (
            <SelectItem key={item.year + item.month} value={item.month}>{item.year} 年 {item.month} 月</SelectItem>
          ))}
        </Select>
      </Flex>

      <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">

        <Card className="max-w-md mx-auto">
          <Flex alignItems="start">
            <Title>月載客量</Title>
            <BadgeDelta deltaType="moderateIncrease">5.1%</BadgeDelta>
          </Flex>
          <Flex justifyContent="start" alignItems="baseline" className="space-x-3 truncate">
            <Metric>442,276</Metric>
            <Text>人次</Text>
          </Flex>
          <AreaChart
            className="mt-10 h-48"
            data={passengers}
            index="Month"
            categories={["Count"]}
            colors={["blue"]}
            showYAxis={true}
            showLegend={false}
            startEndOnly={true}
          />
        </Card>

        {populars.map((item) => (
          <Card key={item.category}>
            <Title>{item.category}</Title>
            <Flex
              justifyContent="start"
              alignItems="baseline"
              className="space-x-2"
            >
              <Metric>{item.stat}</Metric>
            </Flex>
            <Flex className="mt-6">
              <Text>{item.ranking}</Text>
              <Text className="text-right">{item.unit}</Text>
            </Flex>
            <BarList
              data={item.data}
              valueFormatter={valueFormatter}
              className="mt-2"
            />
          </Card>
        ))}
      </Grid>
      <Chart />

      {/* <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card> */}

    </main>
  );
}
