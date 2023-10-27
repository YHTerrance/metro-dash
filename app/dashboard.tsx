'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Flex, Title, Select, SelectItem, Grid, BadgeDelta, Card, Text, Metric, AreaChart, BarList, Color } from '@tremor/react';

import Chart from './chart';

function valueFormatter(number: number) {
  return Intl.NumberFormat("us").format(number).toString();
};

const dateToMonth = (date: string) => {
  const [year, month] = date.split('-');
  return `${year}-${month}`;
}

type DashboardProps = {
  totalPassengers: any[];
  popularRoutes: any[];
  popularStations: any[];
  passengersByTimePeriod: any[];
  passengersByWeekday: any[];
  stations: any[];
};

const Dashboard: React.FC<DashboardProps> = ({
  totalPassengers,
  popularRoutes,
  popularStations,
  passengersByTimePeriod,
  passengersByWeekday,
  stations,
}) => {

  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedMonth = searchParams?.get('q') || dateToMonth(totalPassengers[0].month);
  const [select, setSelect] = useState(selectedMonth);

  function handleSelect(term: string) {

    setSelect(term);

    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function stationIdToName(id: number) {
    const result = stations.filter(station => station.station_id == id)[0];
    if (!result) console.error("Invalid station id:", id);
    return result ? result.station_name : '';
  }

  function getPassengers(month: string) {
    return totalPassengers.filter(item => item["月"] == month)[0]["人次"];
  }

  function getPassengerGrowthRate(month: string) {
    const currentPassengers = getPassengers(month);
    const previousPassengers = getPassengers(months.indexOf(month) == months.length - 1 ? month : months[months.indexOf(month) + 1])

    return (currentPassengers - previousPassengers) / previousPassengers * 100;
  }

  function getBadgeDeltaType(growthRate: number) {
    if (growthRate > 5) {
      return "increase";
    }
    else if (growthRate > 1) {
      return "moderateIncrease";
    }
    else if (growthRate > -1) {
      return "unchanged";
    }
    else if (growthRate > -5) {
      return "moderateDecrease";
    }
    else {
      return "decrease";
    }
  }

  const months: string[] = totalPassengers
    .map(item => dateToMonth(item.month))
    .sort((a, b) => b.localeCompare(a));

  totalPassengers = totalPassengers
    .map(item => ({
      "月": dateToMonth(item.month),
      "人次": item.total_passengers,
    }))
    .filter(item => item["月"] <= selectedMonth)
    .sort((a, b) => a["月"].localeCompare(b["月"]));

  popularRoutes = popularRoutes.map(item => ({
    name: `${stationIdToName(item.station_one_id)} - ${stationIdToName(item.station_two_id)}`,
    value: item.passengers
  }));

  popularStations = popularStations.map(item => ({
    name: stationIdToName(item.station_id),
    value: item.passengers
  }));

  passengersByTimePeriod = passengersByTimePeriod
    .map(item => ({
      "時段": item.time_period,
      "人次": item.avg_passengers
    }))
    .sort((a, b) => {
      let hourA = a["時段"];
      let hourB = b["時段"];
      if (hourA < 5) {
        hourA += 24;
      }
      if (hourB < 5) {
        hourB += 24;
      }
      return hourA - hourB;
    });

  passengersByWeekday = passengersByWeekday.map(item => ({
    "星期": item.weekday,
    "人次": item.avg_passengers
  }));

  const populars = [
    {
      category: '熱門路線',
      stat: popularRoutes[0].name,
      data: popularRoutes.slice(0, 5),
      unit: '人次',
      ranking: '熱門路線排行'
    },
    {
      category: '熱門車站',
      stat: popularStations[0].name,
      data: popularStations.slice(0, 5),
      unit: '人次',
      ranking: '熱門車站排行'
    },
  ];

  const monthly_chart = {
    title: "每月總載客量",
    description: "每月載客量變化趨勢",
    data: totalPassengers,
    categories: ["人次"],
    colors: ["amber" as Color],
    index: "月"
  }

  const hourly_chart = {
    title: "每日各時平均載客量",
    description: "比較在一天不同時段的平均載客量",
    data: passengersByTimePeriod,
    categories: ["人次"],
    colors: ["fuchsia" as Color],
    index: "時段"
  }

  const daily_chart = {
    title: "每週各日平均載客量",
    description: "比較在一周不同天的平均載客量",
    data: passengersByWeekday,
    categories: ["人次"],
    colors: ["indigo" as Color],
    index: "星期"
  };

  const currentPassengers = getPassengers(selectedMonth);

  return (
    <div>
      <Flex alignItems='start'>
          <div>
            <Title>總覽</Title>
            <Text>
              台北捷運月數據概況
            </Text>
          </div>
          <Flex className="max-w-fit">
            {isPending && (
              <Flex className="ml-4" alignItems="center" justifyContent="center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </Flex>
            )}
            <Select className="max-w-fit" placeholder={select} enableClear={false} value={select} onValueChange={(term) => {handleSelect(term)}}>
              {months.filter(month => month != selectedMonth).map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </Select>
          </Flex>
        </Flex>

        <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">

          {/* Total Passengers */}
          <Card className="max-w-md mx-auto">
            <Flex alignItems="start">
              <Title>當月總載客量</Title>
              <BadgeDelta deltaType={getBadgeDeltaType(getPassengerGrowthRate(selectedMonth))}>
                {getPassengerGrowthRate(selectedMonth).toFixed(2)}%
              </BadgeDelta>
            </Flex>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-3 truncate">
              <Metric>
                {
                  valueFormatter(currentPassengers)
                }
              </Metric>
              <Text>人次</Text>
            </Flex>
            <AreaChart
              className="mt-10 h-48"
              data={totalPassengers}
              index="月"
              categories={["人次"]}
              colors={["amber"]}
              showYAxis={false}
              showLegend={false}
              startEndOnly={true}
              autoMinValue={true}
              valueFormatter={valueFormatter}
              showAnimation={true}
            />
          </Card>

          {/* Populars */}
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
        <Chart chart_data={daily_chart}/>
        <Chart chart_data={hourly_chart}/>
        <Chart chart_data={monthly_chart}/>
    </div>
  );
}

export default Dashboard;
