import React, { useCallback, useEffect, useState } from 'react';
import { add, endOfWeek, format, startOfWeek } from 'date-fns';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import WeekPicker from '../components/week-picker';
import {
  Modality,
  ModalityWeighted,
  Move,
  Wod,
  WorkoutSession
} from '../models';
import { DataStore, API, graphqlOperation } from 'aws-amplify';

type Column = {
  id: 'name' | 'code' | 'population' | 'size' | 'density' | string;
  label: string;
  minWidth?: number;
  align?: 'right';
  colSpan?: number;
};

type Props = {
  categories: {
    id: number;
    group: string;
    name: string;
    groupSize?: number;
  }[];
};

function getDates(startDate: Date, stopDate: Date) {
  const dateArray = new Array<Date>();
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = add(currentDate, { days: 1 });
  }

  return dateArray;
}

export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await fetch(`https://.../data`);
  // const data = await res.json();

  const gymnastics = await DataStore.query(Move, (m) =>
    m.modality.eq('GYMNASTICS')
  );
  const weightlifting = await DataStore.query(Move, (m) =>
    m.modality.eq('WEIGHTLIFTING')
  );
  const monostructural = await DataStore.query(Move, (m) =>
    m.modality.eq('MONOSTRUCTURAL')
  );

  const categories = [
    {
      id: 1,
      group: 'Modality/Load',
      groupSize: Object.values(ModalityWeighted).length,
      name: 'Gymnastics'
    },
    {
      id: 2,
      group: 'Modality/Load',
      name: 'Weightlifting - Light'
    },
    {
      id: 3,
      group: 'Modality/Load',
      name: 'Weightlifting - Medium'
    },
    {
      id: 4,
      group: 'Modality/Load',
      name: 'Weightlifting - Heavy'
    },
    {
      id: 5,
      group: 'Modality/Load',
      name: 'Monostructural'
    },
    {
      id: 6,
      group: 'Time',
      groupSize: 5,
      name: 'Heavy Day'
    },
    {
      id: 7,
      group: 'Time',
      name: '< 5 min'
    },
    {
      id: 8,
      group: 'Time',
      name: '5-10 min'
    },
    {
      id: 9,
      group: 'Time',
      name: '11-20 min'
    },
    {
      id: 10,
      group: 'Time',
      name: '> 20 min'
    },
    {
      id: 11,
      group: 'Total Repetitions',
      groupSize: 3,
      name: 'Low (<50 reps)'
    },
    { id: 12, group: 'Total Repetitions', name: 'Medium (50-200 reps)' },
    { id: 13, group: 'Total Repetitions', name: 'High (>200 reps)' },
    { id: 14, group: 'Scheme', groupSize: 4, name: 'Single' },
    { id: 15, group: 'Scheme', name: 'Couplet' },
    { id: 16, group: 'Scheme', name: 'Triplet' },
    { id: 17, group: 'Scheme', name: '≥ 4 moves & chippers' },
    { id: 18, group: 'Priority', groupSize: 3, name: 'Weight' },
    { id: 19, group: 'Priority', name: 'Task' },
    { id: 20, group: 'Priority', name: 'Time' },
    {
      id: 21,
      group: 'Movements - Gymnastics',
      groupSize: gymnastics.length,
      name: gymnastics[0]?.name || ''
    },
    ...gymnastics.slice(1).map((g, i) => ({
      id: 22 + i,
      group: 'Movements - Gymnastics',
      name: g.name || ''
    })),
    {
      id: 22 + gymnastics.length,
      group: 'Movements - Weightlifting',
      groupSize: weightlifting.length,
      name: weightlifting[0]?.name || ''
    },
    ...weightlifting.slice(1).map((g, i) => ({
      id: 22 + gymnastics.length + i,
      group: 'Movements - Weightlifting',
      name: g.name || ''
    })),
    {
      id: 22 + gymnastics.length + weightlifting.length,
      group: 'Movements - Monostructural',
      groupSize: monostructural.length,
      name: monostructural[0]?.name || ''
    },
    ...monostructural.slice(1).map((g, i) => ({
      id: 22 + gymnastics.length + weightlifting.length + i,
      group: 'Movements - Monostructural',
      name: g.name || ''
    }))
  ];

  // Pass data to the page via props
  return { props: { categories } };
}

export default function Page({ categories }: Props) {
  const [date, setDate] = useState(startOfWeek(new Date()));

  const fetchWorkouts = useCallback(async () => {
    const start = startOfWeek(date).toISOString();
    const end = endOfWeek(date).toISOString();
    const datesArray = getDates(startOfWeek(date), endOfWeek(date));

    const workouts = await DataStore.query(WorkoutSession, (w) =>
      w.date.between(start, end)
    );
    if (workouts.length > 0)
      console.log(workouts, workouts[0].date, new Date().toISOString());
    let wodsArray: any[] = datesArray.map((date) => ({
      date: date,
      session: workouts.find((w) => w.date === format(date, 'yyyy-MM-dd'))
    }));
    // FIX THIS ARRAY OF PROMISES
    console.log(wodsArray);
    wodsArray = wodsArray.map(async (m) => {
      let wod = undefined;
      if (!!m.session) {
        wod = await DataStore.query(Wod, (w) =>
          w.wodWorkoutSessionId.eq(m.session!.id)
        );
      }
      return { ...m, wod };
    });
    console.log('2', wodsArray);
    // setWorkouts(workouts);
  }, [date]);

  useEffect(() => {
    fetchWorkouts();
  }, [date, fetchWorkouts]);

  const columns: Column[] = [
    { id: 'col0', label: 'Workout Descriptor', colSpan: 2 },
    { id: 'col1', label: format(date, 'EEE - dd/MM') },
    {
      id: 'col2',

      label: format(add(date, { days: 1 }), 'EEE - dd/MM')
    },
    {
      id: 'col3',

      label: format(add(date, { days: 2 }), 'EEE - dd/MM')
    },
    {
      id: 'col4',

      label: format(add(date, { days: 3 }), 'EEE - dd/MM')
    },
    {
      id: 'col5',

      label: format(add(date, { days: 4 }), 'EEE - dd/MM')
    },
    {
      id: 'col6',

      label: format(add(date, { days: 5 }), 'EEE - dd/MM')
    },
    {
      id: 'col7',

      label: format(add(date, { days: 6 }), 'EEE - dd/MM')
    },
    {
      id: 'col8',
      label: 'Total'
    }
  ];

  const getValue = (name: string, date: Date) => {
    return 1;
  };

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <WeekPicker date={date} setDate={setDate} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell colSpan={column.colSpan} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map(({ id, name, group, groupSize }, index, arr) => {
              const v1 = getValue(name, date);
              const v2 = getValue(name, add(date, { days: 1 }));
              const v3 = getValue(name, add(date, { days: 2 }));
              const v4 = getValue(name, add(date, { days: 3 }));
              const v5 = getValue(name, add(date, { days: 4 }));
              const v6 = getValue(name, add(date, { days: 5 }));
              const v7 = getValue(name, add(date, { days: 6 }));
              const total = v1 + v2 + v3 + v4 + v5 + v6 + v7;

              return (
                <TableRow key={id}>
                  {group !== arr[index - 1]?.group && (
                    <TableCell rowSpan={groupSize}>{group}</TableCell>
                  )}
                  <TableCell>{name}</TableCell>
                  <TableCell align="center">{v1}</TableCell>
                  <TableCell align="center">{v2}</TableCell>
                  <TableCell align="center">{v3}</TableCell>
                  <TableCell align="center">{v4}</TableCell>
                  <TableCell align="center">{v5}</TableCell>
                  <TableCell align="center">{v6}</TableCell>
                  <TableCell align="center">{v7}</TableCell>
                  <TableCell align="center">{total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
