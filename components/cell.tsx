import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Wod, WorkoutSession } from '../models';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { DataStore } from 'aws-amplify';
import { format } from 'date-fns';

type Header = {
  name: string;
  duration: number;
  start: number;
  end: number;
};

type Props = {
  onOpenForm?: (workoutSession: WorkoutSession | undefined, date: Date) => void;
  workoutSession?: WorkoutSession;
  date: Date;
  stage:
    | 'WHITEBOARD'
    | 'GENERAL WARM-UP'
    | 'SPECIFIC WARM-UP'
    | 'BREAK AND LOGISTICS'
    | 'WORKOUT'
    | 'COOL-DOWN';
};

type Stages = {
  WHITEBOARD: 'whiteboard';
  'GENERAL WARM-UP': 'generalwu';
  'SPECIFIC WARM-UP': 'specificwu';
  'BREAK AND LOGISTICS': 'break';
  WORKOUT: 'workout';
  'COOL-DOWN': 'cooldown';
};
const stages: Stages = {
  WHITEBOARD: 'whiteboard',
  'GENERAL WARM-UP': 'generalwu',
  'SPECIFIC WARM-UP': 'specificwu',
  'BREAK AND LOGISTICS': 'break',
  WORKOUT: 'workout',
  'COOL-DOWN': 'cooldown'
};

export function Cell({ date, stage, workoutSession, onOpenForm }: Props) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (workoutSession) setText(workoutSession[stages[stage]] || '');
  }, [stage, workoutSession]);

  const debounced = useDebouncedCallback(async function (value) {
    setText(value);
    if (workoutSession) {
      const result = await DataStore.save(
        WorkoutSession.copyOf(workoutSession, (updated) => {
          updated[stages[stage]] = value;
        })
      );
      console.log('Edit ', result);
    } else {
      const session = await DataStore.save(
        new WorkoutSession({
          [stages[stage]]: value,
          date: format(date, 'yyyy-MM-dd')
        })
      );
      const wod = await DataStore.save(
        new Wod({
          WorkoutSession: session
        })
      );

      const session2 = await DataStore.save(
        WorkoutSession.copyOf(session, (updated) => {
          updated.Wod = wod;
        })
      );
      console.log('Create WodSession and Wod', session2, wod);
    }
  }, 1000);

  // const header = {
  //   duration: 5,
  //   start: 32,
  //   end: 37
  // };

  const backgroundColor = {
    WHITEBOARD: 'primary.dark',
    'GENERAL WARM-UP': 'primary.main',
    'SPECIFIC WARM-UP': 'secondary.dark',
    'BREAK AND LOGISTICS': 'secondary.main',
    WORKOUT: 'success.dark',
    'COOL-DOWN': 'success.main'
  };

  return (
    <Box>
      <Box
        p={0.5}
        sx={{
          backgroundColor: backgroundColor[stage],
          color: 'white',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px'
        }}
      >
        <Typography>{stage}</Typography>
        {/* ({header.duration} min) :{header.start}-:{header.end} */}
      </Box>
      <Box
        padding={1}
        alignItems="center"
        minHeight={50}
        display="flex"
        justifyContent="center"
        textAlign="left"
        position="relative"
      >
        {stage === 'WORKOUT' ? (
          <>
            <IconButton
              sx={{ position: 'absolute', right: 0, top: 0 }}
              onClick={() => onOpenForm!(workoutSession, date)}
            >
              {workoutSession?.workout ? <EditIcon /> : <AddIcon />}
            </IconButton>
            <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
          </>
        ) : (
          <TextField
            multiline
            minRows={1}
            defaultValue={text}
            variant="standard"
            size="small"
            placeholder="Edit here"
            InputProps={{ disableUnderline: true }}
            onChange={(e) => debounced(e.target.value)}
          />
        )}
      </Box>
    </Box>
  );
}
