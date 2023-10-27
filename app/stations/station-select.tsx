'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { SearchSelectItem, SearchSelect, Flex } from '@tremor/react';

interface Station {
  station_name: string;
}

export default function StationSelect({ disabled, stations, selectedStation }: { disabled?: boolean, stations: Station[], selectedStation: string }) {

  const [select, setSelect] = useState(selectedStation);
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSelect(term: string) {
    setSelect(term);
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set('s', term);
    } else {
      params.delete('s');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <Flex alignItems="center" justifyContent="start" className="mt-5">
      <SearchSelect
        className="max-w-fit shadow-sm rounded-md"
        value={select}
        onValueChange={handleSelect}
        disabled={disabled}
        placeholder="選擇車站"
        enableClear={false}
      >
        {stations.map((station) => (
          <SearchSelectItem key={station.station_name} value={station.station_name}>
            {station.station_name}
          </SearchSelectItem>
        ))}
      </SearchSelect>
      <Flex alignItems="center" justifyContent="start">
        { isPending && (
          <svg
            className="animate-spin ml-3 mr-3 h-5 w-5 text-gray-700"
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
          )
        }
      </Flex>
    </Flex>
  );
}
