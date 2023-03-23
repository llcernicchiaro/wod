import React, {
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect
} from 'react';
import {
  Tabs,
  Tab,
  Autocomplete,
  Dialog,
  TextField,
  Box,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Group,
  LazyMove,
  LazyMovement,
  LazyMoveVariation,
  Move,
  Modality,
  MoveVariation,
  Wod,
  WodType,
  WorkoutSession
} from '../models';
import { MoveSelect } from './move-select';
import Divider from '@mui/material/Divider';

// type TabValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type TabValue = 0 | 1 | 2;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  date: Date;
  wod: Wod;
  workout: WorkoutSession;
  onClose: () => void;
};

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

const groupsOptions = [
  { label: 'SOLO', value: Group.SOLO },
  { label: 'IN PAIRS', value: Group.INPAIRS },
  { label: 'IN TEAMS OF 3', value: Group.INTEAMSOF3 },
  { label: 'IN TEAMS OF 4', value: Group.INTEAMSOF4 }
];

const wodTypeText = {
  [WodType.FORTIME]: 'FOR TIME',
  [WodType.AMRAP]: 'AMRAP',
  [WodType.HEAVYDAY]: 'HEAVY DAY'
  // [WodType.ONOFF]: "TIME ON/TIME OFF",
  // [WodType.EVERYXMIN]: "EVERY X TIME",
  // [WodType.FAMOUS]: "FAMOUS(GIRLS, HEROES, OPEN, ETC)",
  // [WodType.CUSTOM]: "CUSTOM",
};

const wodTypeEnum = {
  0: WodType.FORTIME,
  1: WodType.AMRAP,
  2: WodType.HEAVYDAY
  // 3: WodType.ONOFF,
  // 4: WodType.EVERYXMIN,
  // 5: WodType.FAMOUS,
  // 6: WodType.CUSTOM,
};

const priorityByType = {
  0: 'TASK',
  1: 'TIME',
  2: 'WEIGHT'
  //   3: null,
  //   4: null,
  //   5: null,
  //   6: null
};

const getTabValue = (tab: WodType) => {
  switch (tab) {
    case 'AMRAP':
      return 1;
    case 'HEAVYDAY':
      return 2;
    // case "ONOFF":
    //   return 3;
    // case "EVERYXMIN":
    //   return 4;
    // case "FAMOUS":
    //   return 5;
    // case "CUSTOM":
    //   return 6;
    case 'FORTIME':
    default:
      return 0;
  }
};

const getScheme = (size: number) => {
  if (size === 1) return 'SINGLE';
  if (size === 2) return 'COUPLET';
  if (size === 3) return 'TRIPLET';
  if (size >= 4) return 'PLUS4_MOVES';
  else return null;
};

// const getWeightedModality = (move: Movement) => {
//   if (move.modality !== "WEIGHTLIFTING")
//     return move.modality as "GYMNASTICS" | "MONOSTRUTURAL";
//   // NEEDS WORK TO CHANGE FROM LIGHT TO HEAVY WITH THE MOVE AND WEIGHT
//   return "WEIGHTLIFTINGMEDIUM";
// };

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export function FormModal({
  date,
  open,
  setOpen,
  wod,
  onClose,
  workout
}: Props) {
  const [selectedWodType, setSelectedWodType] = useState<TabValue>(0);
  const [moveOptions, setMoveOptions] = useState<LazyMove[]>([]);
  const [wodMoves, setWodMoves] = useState<LazyMovement[]>([{ moveId: '' }]);
  const [rounds, setRounds] = useState(1);
  const [comment, setComment] = useState('');
  const [group, setGroup] = useState<keyof typeof Group>('SOLO');
  const [timeCap, setTimeCap] = useState('');
  const [workoutText, setWorkoutText] = useState('');
  const [allVariants, setAllVariants] = useState<LazyMoveVariation[]>([]);
  // const [isSequence, setIsSequence] = useState(false);

  useEffect(() => {
    const changeWorkoutText = () => {
      let text = '';
      switch (wodTypeEnum[selectedWodType]) {
        case 'FORTIME': {
          console.log('for time\n');
          text = text.concat('', 'FOR TIME');
          if (group && group !== 'SOLO')
            text = text.concat(
              '\n',
              groupsOptions.find((g) => g.value === group)!.label
            );
          if (rounds > 1) text = text.concat('\n', `${rounds} ROUNDS`);
          const moveTexts = wodMoves
            .map((move) => {
              let moveName = '';
              const movement = moveOptions.find((m) => m.id === move.moveId!);
              if (movement && movement.name) {
                moveName = movement?.name;
                if (move.variationId) {
                  const variant = allVariants.find(
                    (v) => v.id === move.variationId
                  );
                  moveName = variant?.name || "";
                }
                let moveText = `${move.repetitions || ''} ${moveName}`;
                if (move.menWeight)
                  moveText = moveText.concat('(', move.menWeight.toString());
                if (move.womenWeight)
                  moveText = moveText.concat('/', move.womenWeight.toString());
                if (move.menWeight || move.womenWeight)
                  moveText = moveText.concat('', 'kg )');
                return moveText;
              }
            })
            .join('\n');
          text = text.concat('\n', moveTexts);
          if (timeCap) text = text.concat('\n', `CAP ${timeCap}'`);
          if (comment) text = text.concat('\n', comment);
          text = text.concat('\n', 'SCORE: TIME');
          break;
        }
        case 'AMRAP': {
          console.log('amrap\n');
          text = text.concat(
            '',
            `COMPLETE AS MANY REPS AS POSSIBLE IN ${timeCap}\' OF:`
          );
          const moveTexts = wodMoves
            .map((move) => {
              let moveName = '';
              const movement = moveOptions.find((m) => m.id === move.moveId!);
              if (movement && movement.name) {
                moveName = movement?.name || "";
                if (move.variationId) {
                  const variant = allVariants.find(
                    (v) => v.id === move.variationId
                  );
                  moveName = variant?.name || "";
                }
                let moveText = `${move.repetitions || ''} ${moveName}`;
                if (move.menWeight)
                  moveText = moveText.concat('(', move.menWeight.toString());
                if (move.womenWeight)
                  moveText = moveText.concat('/', move.womenWeight.toString());
                if (move.menWeight || move.womenWeight)
                  moveText = moveText.concat('', 'kg)');
                return moveText;
              }
            })
            .join('\n');
          text = text.concat('\n', moveTexts);
          if (comment) text = text.concat('\n', comment);
          text = text.concat('\n', 'SCORE: TOTAL REPS');
          break;
        }
        case 'HEAVYDAY': {
          console.log('heavy day\n');
          text = text.concat('', 'FOR LOAD');
          const moveTexts = wodMoves
            .map((move) => {
              let moveName = '';
              const movement = moveOptions.find((m) => m.id === move.moveId!);
              if (movement && movement.name) {
                moveName = movement?.name || "";
                if (move.variationId) {
                  const variant = allVariants.find(
                    (v) => v.id === move.variationId
                  );
                  moveName = variant?.name || "";
                }
                let moveText = moveName.concat(
                  '\n',
                  move?.sequence?.filter((item) => item).join(' - ') || ''
                );

                return moveText;
              }
            })
            .join('\n');
          text = text.concat('\n', moveTexts);
          if (timeCap) text = text.concat('\n', `CAP ${timeCap}'`);
          if (comment) text = text.concat('\n', comment);
          text = text.concat('\n', 'SCORE: HEAVIEST LOAD');
          break;
        }
      }
      console.log(text);
      setWorkoutText(text);
    };

    changeWorkoutText();
  }, [
    allVariants,
    comment,
    group,
    moveOptions,
    rounds,
    selectedWodType,
    timeCap,
    wodMoves
  ]);

  useEffect(() => {
    setSelectedWodType(getTabValue(wod.type as WodType));
    setRounds(wod.rounds || 1);
    setGroup(wod.group || 'SOLO');
    setComment(wod.comment || '');
    setTimeCap(wod.time || '');
    console.log(wod);
    if (wod.movements)
      setWodMoves(
        wod.movements.length > 0
          ? (wod.movements as LazyMovement[])
          : [{ moveId: '' }]
      );
    else setWodMoves([{ moveId: '' }]);
  }, [wod]);

  useEffect(() => setWorkoutText(workout?.workout! || ''), [workout]);

  useEffect(() => {
    const getMovements = async () => {
      const moves = await DataStore.query(Move, Predicates.ALL, {
        sort: (s) =>
          s.modality(SortDirection.ASCENDING).name(SortDirection.ASCENDING)
      });
      if (!!moves) setMoveOptions(moves);
    };
    if (moveOptions.length === 0) getMovements();
  }, [moveOptions]);

  useEffect(() => {
    const getVariants = async () => {
      const variants = await DataStore.query(MoveVariation, Predicates.ALL, {
        sort: (s) => s.name(SortDirection.ASCENDING)
      });
      if (!!variants) setAllVariants(variants);
    };
    if (moveOptions.length === 0) getVariants();
  }, [moveOptions]);

  const handleClose = async () => {
    const groupChanged = group !== wod.group;
    const roundsChanged = rounds !== wod.rounds;
    const commentChanged = comment !== wod.comment;
    const movementsChanged =
      JSON.stringify(wodMoves) !== JSON.stringify(wod.movements);
    const timeChanged = timeCap !== wod.time;
    const typeChanged = wodTypeEnum[selectedWodType] !== wod.type;

    const somethingChanged =
      roundsChanged ||
      groupChanged ||
      commentChanged ||
      movementsChanged ||
      typeChanged ||
      timeChanged;

    if (somethingChanged) {
      const filteredWodMoves = wodMoves.filter((move) => !!move.moveId);
      const modalities: Modality[] = wodMoves.map(
        (m) => m.modality as Modality
      );
      // NEED IMPROVEMENT FOR AMRAP
      let totalReps = 0;
      if (selectedWodType === 0 || selectedWodType === 1) {
        totalReps = filteredWodMoves.reduce(
          (acc, m) => acc + parseInt(m.repetitions || '0'),
          0
        );
      } else if (selectedWodType === 2) {
        totalReps = filteredWodMoves.reduce(
          (acc, m) =>
            acc + m.sequence!.reduce((ac, v) => ac + parseInt(v || '0'), 0),
          0
        );
      }

      const changedWod = await DataStore.save(
        Wod.copyOf(wod, (updated) => {
          updated.group = group;
          updated.rounds = rounds;
          updated.comment = comment;
          updated.movements = filteredWodMoves;
          updated.time = timeCap;
          updated.type = wodTypeEnum[selectedWodType];
          updated.modalities = modalities;
          updated.totalReps = totalReps * rounds;
          updated.priority = priorityByType[selectedWodType] as
            | 'TIME'
            | 'TASK'
            | 'WEIGHT'
            | null;
          updated.scheme = getScheme(wodMoves.length);
        })
      );
      console.log('Changed wod: ', changedWod);

      const changedWorkout = await DataStore.save(
        WorkoutSession.copyOf(workout, (updated) => {
          updated.workout = workoutText;
        })
      );
      console.log('Changed WorkoutSession.workout: ', changedWorkout);
    }

    await onClose();
    setOpen(false);
  };

  const onChangeMove = (
    value: LazyMove | string | string[],
    field: string,
    i: number
  ) => {
    const newWodMoves = wodMoves.map((move, index) => {
      if (index === i) {
        if (field === 'moveId') {
          const { id, modality } = value as LazyMove;
          // Removed WeightedModality for v1
          // const weightedModality: ModalityWeighted =
          //   modality === 'WEIGHTLIFTING'
          //     ? 'WEIGHTLIFTINGLIGHT'
          //     : (modality as any);
          return { ...move, moveId: id, modality };
        }
        return { ...move, [field]: value };
      } else return move;
    });
    setWodMoves(newWodMoves);
  };

  const onAddMoreMoves = () => setWodMoves([...wodMoves, { moveId: '' }]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { flexDirection: 'row' } }}
    >
      <Box width="80%" p={2}>
        <Stack direction="row" spacing={2} mb={2}>
          <Typography variant="h5">{format(date, 'EEEE - dd/MM')}</Typography>
        </Stack>
        <Divider />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedWodType}
            onChange={(_e, newValue) => setSelectedWodType(newValue)}
          >
            {Object.values(wodTypeText).map((type) => (
              <Tab label={type} key={type} />
            ))}
          </Tabs>
        </Box>
        <TabPanel value={selectedWodType} index={0}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={4}>
              {/* <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSequence}
                      onChange={(e) => setIsSequence(e.target.checked)}
                    />
                  }
                  label={<span>Sequence</span>}
                  labelPlacement="start"
                />
              </FormGroup> */}
              {/* {!isSequence && ( */}
              <TextField
                variant="standard"
                type="number"
                placeholder="Rounds"
                label="Rounds"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ width: 100 }}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
              {/* )} */}
              <Autocomplete
                disableClearable
                options={groupsOptions}
                value={groupsOptions.find((g) => g.value === group)}
                onChange={(_e, newValue) => setGroup(newValue?.value!)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Group"
                    label="Group"
                    sx={{ width: 200 }}
                  />
                )}
              />
              <TextField
                variant="standard"
                type="number"
                placeholder="Time Cap"
                label="Time Cap"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ width: 100 }}
                value={timeCap}
                onChange={(e) => setTimeCap(e.target.value)}
              />
              <TextField
                variant="standard"
                placeholder="Extra comment (Use for strategy or something else)"
                label="Extra Comment"
                onChange={(e) => setComment(e.target.value)}
                sx={{ width: 400 }}
              />
            </Stack>
            <Typography>Movements List</Typography>
            {wodMoves.map((move, index) => (
              <MoveSelect
                key={index}
                move={move}
                index={index}
                isHeavyDay={false}
                moves={moveOptions}
                // isSequence={isSequence}
                onChangeMove={onChangeMove}
                onAddMoreMoves={onAddMoreMoves}
                itsLast={index === wodMoves.length - 1}
              />
            ))}
          </Stack>
        </TabPanel>
        <TabPanel value={selectedWodType} index={1}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={4}>
              <TextField
                variant="standard"
                type="number"
                placeholder="Time Cap"
                label="Time Cap"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ width: 100 }}
                value={timeCap}
                onChange={(e) => setTimeCap(e.target.value)}
              />
              <TextField
                variant="standard"
                placeholder="Extra comment (Use for strategy or something else)"
                label="Extra Comment"
                onChange={(e) => setComment(e.target.value)}
                sx={{ width: 400 }}
              />
            </Stack>
            <Typography>Movements List</Typography>
            {wodMoves.map((move, index) => (
              <MoveSelect
                key={index}
                move={move}
                index={index}
                isHeavyDay={false}
                moves={moveOptions}
                // isSequence={isSequence}
                onChangeMove={onChangeMove}
                onAddMoreMoves={onAddMoreMoves}
                itsLast={index === wodMoves.length - 1}
              />
            ))}
          </Stack>
        </TabPanel>
        <TabPanel value={selectedWodType} index={2}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={4}>
              <TextField
                variant="standard"
                type="number"
                placeholder="Time Cap"
                label="Time Cap"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ width: 100 }}
                value={timeCap}
                onChange={(e) => setTimeCap(e.target.value)}
              />
              <TextField
                variant="standard"
                placeholder="Extra comment (Use for strategy or something else)"
                label="Extra Comment"
                onChange={(e) => setComment(e.target.value)}
                sx={{ width: 400 }}
              />
            </Stack>
            <Typography>Movements List</Typography>
            {wodMoves.map((move, index) => (
              <MoveSelect
                // isSequence
                isHeavyDay
                key={index}
                index={index}
                move={move}
                moves={moveOptions}
                onChangeMove={onChangeMove}
                onAddMoreMoves={onAddMoreMoves}
                itsLast={index === wodMoves.length - 1}
              />
            ))}
          </Stack>
        </TabPanel>
        <Button variant="contained" onClick={handleClose}>
          Fechar
        </Button>
      </Box>
      <Box width="20%" p={2} sx={{ backgroundColor: 'primary.main' }}>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <Typography variant="h6">Wod Preview</Typography>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {workoutText}
            </Typography>
            <Tooltip title="Copy Wod Text">
              <IconButton
                onClick={() => navigator.clipboard.writeText(workoutText)}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}
