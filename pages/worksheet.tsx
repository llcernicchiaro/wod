import React, { useEffect, useState, useCallback } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Cell } from '../components/cell';
import WeekPicker from '../components/week-picker';
import { add, endOfWeek, format, startOfWeek } from 'date-fns';
import { DataStore } from 'aws-amplify';
import { LazyWod, LazyWorkoutSession, Wod, WorkoutSession } from '../models';
import { FormModal } from '../components/form-modal';

type Props = {
  workouts: WorkoutSession[];
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

// export async function getServerSideProps() {
//   const date = startOfWeek(new Date());
//   const start = startOfWeek(date).toISOString();
//   const end = endOfWeek(date).toISOString();

//   const workouts = await DataStore.query(WorkoutSession, (m) =>
//     m.date.between(start, end)
//   );

//   // Pass data to the page via props
//   return { props: { workouts } };
// }

export default function Worksheet() {
  const [date, setDate] = useState(startOfWeek(new Date()));
  const [workouts, setWorkouts] = useState<LazyWorkoutSession[]>([]);
  const [selectedWod, setSelectedWod] = useState<LazyWod>();
  const [selectedWorkout, setSelectedWorkout] = useState<LazyWorkoutSession>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [openForm, setOpenForm] = useState(false);

  const dates = [
    date,
    add(date, { days: 1 }),
    add(date, { days: 2 }),
    add(date, { days: 3 }),
    add(date, { days: 4 }),
    add(date, { days: 5 }),
    add(date, { days: 6 })
  ];

  const fetchWorkouts = useCallback(async () => {
    const start = startOfWeek(date).toISOString();
    const end = endOfWeek(date).toISOString();

    const workouts = await DataStore.query(WorkoutSession, (w) =>
      w.date.between(start, end)
    );

    setWorkouts(workouts);
  }, [date]);

  useEffect(() => {
    fetchWorkouts();
  }, [date, fetchWorkouts]);

  const onCloseForm = async () => {
    await fetchWorkouts();
  };

  const onOpenForm = async (
    workout: WorkoutSession | undefined,
    selectedDate: Date
  ) => {
    console.log(workout, selectedDate);
    if (!workout) {
      const session = await DataStore.save(
        new WorkoutSession({
          date: format(selectedDate, 'yyyy-MM-dd')
        })
      );
      const wod = await DataStore.save(
        new Wod({
          WorkoutSession: session
        })
      );
      await DataStore.save(
        WorkoutSession.copyOf(session, (updated) => {
          updated.Wod = wod;
        })
      );
      setSelectedWod(wod);
      setSelectedWorkout(session);
    } else {
      const wod = await DataStore.query(Wod, (w) =>
        w.wodWorkoutSessionId.eq(workout.id)
      );
      console.log(wod[0]);
      setSelectedWod(wod[0]);
      setSelectedWorkout(workout);
    }
    setSelectedDate(selectedDate);
    setOpenForm(true);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 4, mb: 8 }}>
      <WeekPicker date={date} setDate={setDate} />
      <Grid container spacing={1} mt={2} flexWrap="nowrap">
        {dates.map((day) => {
          const workout = workouts.find(
            (w) => w.date === format(day, 'yyyy-MM-dd')
          );

          return (
            <Grid key={format(day, 'ddMM')}>
              <Grid>
                <Item>{format(day, 'EEEE - dd/MM')}</Item>
              </Grid>
              <Grid>
                <Item>
                  <Cell
                    date={day}
                    stage="WHITEBOARD"
                    workoutSession={workout}
                  />
                </Item>
              </Grid>
              <Grid>
                <Item>
                  <Cell
                    date={day}
                    stage="GENERAL WARM-UP"
                    workoutSession={workout}
                  />
                </Item>
              </Grid>
              <Grid>
                <Item>
                  <Cell
                    date={day}
                    stage="SPECIFIC WARM-UP"
                    workoutSession={workout}
                  />
                </Item>
              </Grid>
              <Grid>
                <Item>
                  <Cell
                    date={day}
                    stage="BREAK AND LOGISTICS"
                    workoutSession={workout}
                  />
                </Item>
              </Grid>
              <Grid>
                <Item>
                  <Cell
                    date={day}
                    stage="WORKOUT"
                    workoutSession={workout}
                    onOpenForm={onOpenForm}
                  />
                </Item>
              </Grid>
              <Grid>
                <Item>
                  <Cell date={day} stage="COOL-DOWN" workoutSession={workout} />
                </Item>
              </Grid>
            </Grid>
          );
        })}
        {selectedWod && (
          <FormModal
            open={openForm}
            setOpen={setOpenForm}
            date={selectedDate!}
            wod={selectedWod}
            workout={selectedWorkout!}
            onClose={onCloseForm}
          />
        )}
      </Grid>
    </Box>
  );
}
