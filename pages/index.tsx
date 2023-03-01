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
import { Modality, Move, Wod, WorkoutSession } from '../models';
import { DataStore } from 'aws-amplify';

type Column = {
  id: 'name' | 'code' | 'population' | 'size' | 'density' | string;
  label: string;
  minWidth?: number;
  align?: 'right';
  colSpan?: number;
};

type Category = {
  id: number;
  group: string;
  name: string;
  groupSize?: number;
  value?: string;
};

type Props = {
  categories: Category[];
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
  const gymnastics = await DataStore.query(Move, (m) =>
    m.modality.eq('GYMNASTICS')
  );
  const weightlifting = await DataStore.query(Move, (m) =>
    m.modality.eq('WEIGHTLIFTING')
  );
  const monostructural = await DataStore.query(Move, (m) =>
    m.modality.eq('MONOSTRUCTURAL')
  );

  const categories: Category[] = [
    {
      id: 1,
      group: 'Modality/Load',
      groupSize: 3,
      name: 'Gymnastics',
      value: 'GYMNASTICS'
    },
    {
      id: 2,
      group: 'Modality/Load',
      name: 'Weightlifting',
      value: 'WEIGHTLIFTING'
    },
    // {
    //   id: 3,
    //   group: 'Modality/Load',
    //   name: 'Weightlifting - Medium'
    // },
    // {
    //   id: 4,
    //   group: 'Modality/Load',
    //   name: 'Weightlifting - Heavy'
    // },
    {
      id: 5,
      group: 'Modality/Load',
      name: 'Monostructural',
      value: 'MONOSTRUCTURAL'
    },
    {
      id: 6,
      group: 'Time',
      groupSize: 5,
      name: 'Heavy Day',
      value: 'HEAVYDAY'
    },
    {
      id: 7,
      group: 'Time',
      name: '< 5 min',
      value: 'LESSTHAN5'
    },
    {
      id: 8,
      group: 'Time',
      name: '5-10 min',
      value: '5TO10'
    },
    {
      id: 9,
      group: 'Time',
      name: '11-20 min',
      value: '11TO20'
    },
    {
      id: 10,
      group: 'Time',
      name: '> 20 min',
      value: 'MORETHAN20'
    },
    {
      id: 11,
      group: 'Total Repetitions',
      groupSize: 3,
      name: 'Low (<50 reps)',
      value: 'LOW'
    },
    {
      id: 12,
      group: 'Total Repetitions',
      name: 'Medium (50-200 reps)',
      value: 'MEDIUM'
    },
    {
      id: 13,
      group: 'Total Repetitions',
      name: 'High (>200 reps)',
      value: 'HIGH'
    },
    { id: 14, group: 'Scheme', groupSize: 4, name: 'Single', value: 'SINGLE' },
    { id: 15, group: 'Scheme', name: 'Couplet', value: 'COUPLET' },
    { id: 16, group: 'Scheme', name: 'Triplet', value: 'TRIPLET' },
    {
      id: 17,
      group: 'Scheme',
      name: '≥ 4 moves & chippers',
      value: 'PLUS4MOVES'
    },
    {
      id: 18,
      group: 'Priority',
      groupSize: 3,
      name: 'Weight',
      value: 'WEIGHT'
    },
    { id: 19, group: 'Priority', name: 'Task', value: 'TASK' },
    { id: 20, group: 'Priority', name: 'Time', value: 'TIME' },
    {
      id: 21,
      group: 'Movements - Gymnastics',
      groupSize: gymnastics.length,
      name: gymnastics[0]?.name || '',
      value: gymnastics[0]?.id || ''
    },
    ...gymnastics.slice(1).map((g, i) => ({
      id: 22 + i,
      group: 'Movements - Gymnastics',
      name: g.name || '',
      value: g.id || ''
    })),
    {
      id: 23 + gymnastics.length,
      group: 'Movements - Weightlifting',
      groupSize: weightlifting.length,
      name: weightlifting[0]?.name || '',
      value: weightlifting[0]?.id || ''
    },
    ...weightlifting.slice(1).map((g, i) => ({
      id: 23 + gymnastics.length + i,
      group: 'Movements - Weightlifting',
      name: g.name || '',
      value: g.id || ''
    })),
    {
      id: 23 + gymnastics.length + weightlifting.length,
      group: 'Movements - Monostructural',
      groupSize: monostructural.length,
      name: monostructural[0]?.name || '',
      value: monostructural[0]?.id || ''
    },
    ...monostructural.slice(1).map((g, i) => ({
      id: 25 + gymnastics.length + weightlifting.length + i,
      group: 'Movements - Monostructural',
      name: g.name || '',
      value: g.id || ''
    }))
  ];

  // Pass data to the page via props
  return { props: { categories } };
}

export default function Page({ categories }: Props) {
  const [date, setDate] = useState(startOfWeek(new Date()));
  const [workouts, setWorkouts] = useState<any[]>([]);

  const fetchWorkouts = useCallback(async () => {
    const start = startOfWeek(date).toISOString();
    const end = endOfWeek(date).toISOString();
    const datesArray = getDates(startOfWeek(date), endOfWeek(date));

    const workouts = await DataStore.query(WorkoutSession, (w) =>
      w.date.between(start, end)
    );

    let wodsArray: any[] = datesArray.map((date) => ({
      date: date,
      session: workouts.find((w) => w.date === format(date, 'yyyy-MM-dd'))
    }));

    wodsArray = await Promise.all(
      wodsArray.map(async (m) => {
        let wod = undefined;
        if (!!m.session) {
          wod = await DataStore.query(Wod, (w) =>
            w.wodWorkoutSessionId.eq(m.session!.id)
          );
          wod = wod[0];
        }
        return { ...m, wod: wod };
      })
    );

    setWorkouts(wodsArray);
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

  const getValue = (category: Category, wod: Wod | undefined) => {
    // console.log(category.group, wod);
    if (!wod) return 0;
    switch (category.group) {
      case 'Modality/Load': {
        if (wod.modalities && wod.modalities.length > 0) {
          return (wod.modalities as Modality[]).reduce(
            (acc, m) => acc + (m === category.value ? 1 : 0),
            0
          );
        } else return 0;
      }
      case 'Time': {
        if (category.value === 'HEAVYDAY' && wod.type === 'HEAVYDAY') return 1;
        else if (
          wod.type !== 'HEAVYDAY' &&
          category.value === 'LESSTHAN5' &&
          Number(wod.time) < 5
        )
          return 1;
        else if (
          wod.type !== 'HEAVYDAY' &&
          category.value === '5TO10' &&
          Number(wod.time) >= 5 &&
          Number(wod.time) <= 10
        )
          return 1;
        else if (
          wod.type !== 'HEAVYDAY' &&
          category.value === '11TO20' &&
          Number(wod.time) >= 11 &&
          Number(wod.time) <= 20
        )
          return 1;
        else if (
          wod.type !== 'HEAVYDAY' &&
          category.value === 'MORETHAN20' &&
          Number(wod.time) > 20
        )
          return 1;
        else return 0;
      }
      case 'Total Repetitions': {
        const totalReps = wod.totalReps || 0;
        if (category.value === 'LOW' && totalReps < 50) return 1;
        else if (
          category.value === 'MEDIUM' &&
          totalReps >= 50 &&
          totalReps < 200
        )
          return 1;
        else if (category.value === 'HIGH' && totalReps >= 200) return 1;
        else return 0;
      }
      case 'Scheme': {
        if (wod.scheme === category.value) return 1;
        else return 0;
      }
      case 'Priority': {
        if (wod.priority === category.value) return 1;
        else return 0;
      }
      case 'Movements - Gymnastics':
      case 'Movements - Weightlifting':
      case 'Movements - Monostructural': {
        const haveMove = wod.movements?.some(
          (move) => move?.moveId === category.value
        );
        return haveMove ? 1 : 0;
      }
    }
    return 0;
  };

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <WeekPicker date={date} setDate={setDate} />
      <TableContainer>
        <Table
          size="small"
          sx={{
            '& .MuiTableCell-root': {
              border: '1px solid rgba(224, 224, 224, 1)'
            }
          }}
        >
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
            {categories?.map((category, index, arr) => {
              const v1 = getValue(
                category,
                workouts.find((w) => w.date.getTime() === date)?.wod
              );
              const v2 = getValue(
                category,
                workouts.find(
                  (w) => w.date.getTime() === add(date, { days: 1 }).getTime()
                )?.wod
              );
              const v3 = getValue(
                category,
                workouts.find(
                  (w) => w.date.getTime() === add(date, { days: 2 }).getTime()
                )?.wod
              );
              const v4 = getValue(
                category,
                workouts.find(
                  (w) => w.date.getTime() === add(date, { days: 3 }).getTime()
                )?.wod
              );
              const v5 = getValue(
                category,
                workouts.find(
                  (w) => w.date.getTime() === add(date, { days: 4 }).getTime()
                )?.wod
              );
              const v6 = getValue(
                category,
                workouts.find(
                  (w) => w.date.getTime() === add(date, { days: 5 }).getTime()
                )?.wod
              );
              const v7 = getValue(
                category,
                workouts.find(
                  (w) => w.date.getTime() === add(date, { days: 6 }).getTime()
                )?.wod
              );
              const total = v1 + v2 + v3 + v4 + v5 + v6 + v7;

              return (
                <TableRow key={category.id}>
                  {category.group !== arr[index - 1]?.group && (
                    <TableCell rowSpan={category.groupSize}>
                      {category.group}
                    </TableCell>
                  )}
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="center">{v1 || ''}</TableCell>
                  <TableCell align="center">{v2 || ''}</TableCell>
                  <TableCell align="center">{v3 || ''}</TableCell>
                  <TableCell align="center">{v4 || ''}</TableCell>
                  <TableCell align="center">{v5 || ''}</TableCell>
                  <TableCell align="center">{v6 || ''}</TableCell>
                  <TableCell align="center">{v7 || ''}</TableCell>
                  <TableCell align="center">{total || ''}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
