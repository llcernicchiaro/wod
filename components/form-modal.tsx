import React, {
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
} from "react";
import {
  Tabs,
  Tab,
  Autocomplete,
  Dialog,
  TextField,
  Box,
  Stack,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import {
  Group,
  LazyMove,
  LazyMovement,
  LazyWod,
  Move,
  Priority,
  Wod,
  WodType,
  WorkoutSession,
} from "../models";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import { MoveSelect } from "./move-select";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  date: Date;
  wod: Wod;
  onClose: () => void;
};

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

type ForTimeForm = {
  rounds?: number;
  moves?: LazyMovement[];
  priority?: "TASK";
};

type AMRAPForm = {
  priority?: "TIME";
};

type HeavyDayForm = {
  priority?: "WEIGHT";
};

type FormType = (ForTimeForm | AMRAPForm | HeavyDayForm) & { group?: Group };

const prioritiesText = {
  [Priority.TASK]: "FOR TIME",
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
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
}

const CustomAutocomplete = (props: any) => (
  <Autocomplete
    size="small"
    {...props}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="standard"
        size="small"
        placeholder={props.placeholder}
        label={props.label}
      />
    )}
  />
);

const groupsText = {
  [Group.SOLO]: "SOLO",
  [Group.INPAIRS]: "IN PAIRS",
  [Group.INTEAMSOF3]: "IN TEAMS OF 3",
  [Group.INTEAMSOF4]: "IN TEAMS OF 4",
};

const wodTypeText = {
  [WodType.FORTIME]: "FOR TIME",
  [WodType.AMRAP]: "AMRAP",
  [WodType.HEAVYDAY]: "HEAVY DAY",
  [WodType.ONOFF]: "TIME ON/TIME OFF",
  [WodType.EVERYXMIN]: "EVERY X TIME",
  [WodType.FAMOUS]: "FAMOUS(GIRLS, HEROES, OPEN, ETC)",
  [WodType.CUSTOM]: "CUSTOM",
};

export function FormModal({ date, open, setOpen, wod, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [moveOptions, setMoveOptions] = useState<LazyMove[]>([]);
  const [wodMoves, setWodMoves] = useState<LazyMovement[]>([
    { repetitions: "", moveId: "" },
  ]);
  const [rounds, setRounds] = useState(1);
  const [comment, setComment] = useState("");
  const [group, setGroup] = useState<keyof typeof Group>("SOLO");
  const [timeCap, setTimeCap] = useState("");

  useEffect(() => {
    setRounds(wod.rounds || 1);
    setGroup(wod.group || "SOLO");
    setComment(wod.comment || "");
    setTimeCap(wod.time || "");
    setWodMoves(
      (wod.movements as LazyMovement[]) || [{ repetitions: "", moveId: "" }]
    );
  }, [wod]);

  useEffect(() => {
    const getMovements = async () => {
      const moves = await DataStore.query(Move, Predicates.ALL, {
        sort: (s) =>
          s.modality(SortDirection.ASCENDING).name(SortDirection.ASCENDING),
      });
      console.log(moves);
      if (!!moves) setMoveOptions(moves);
    };

    getMovements();
  }, []);

  const handleClose = async () => {
    const roundsChanged = rounds || wod.rounds;
    const groupChanged = group || wod.group;

    const somethingChanged = roundsChanged || groupChanged;
    if (somethingChanged) {
      const changedWod = await DataStore.save(
        Wod.copyOf(wod, (updated) => {
          updated.group = group;
          updated.rounds = rounds;
          updated.comment = comment;
        })
      );
      console.log("Changed wod: ", changedWod);
    }

    await onClose();
    setOpen(false);
  };

  const onChangeMove = (value: LazyMove | string, field: string, i: number) => {
    const newWodMoves = wodMoves.map((move, index) => {
      if (index === i) {
        if (field === "moveId") {
          const { id, modality } = value as LazyMove;
          const weightedModality: any =
            modality === "WEIGHTLIFTING" ? "WEIGHTLIFTINGLIGHT" : modality;
          return { ...move, moveId: id, modality: weightedModality };
        }
        return { ...move, [field]: value };
      } else return move;
    });
    setWodMoves(newWodMoves);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { flexDirection: "row" } }}
    >
      <Box width="80%">
        WOD - {format(date, "EEEE - dd/MM")}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(_e, newValue) => setTab(newValue)}>
            {Object.values(wodTypeText).map((type) => (
              <Tab label={type} key={type} />
            ))}
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <TextField
            variant="standard"
            size="small"
            type="number"
            placeholder="Rounds"
            label="Rounds"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            sx={{ width: 80 }}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
          />

          {wodMoves.map((move, index) => (
            <MoveSelect
              key={index}
              move={move}
              moves={moveOptions}
              onChangeMove={onChangeMove}
              index={index}
            />
          ))}

          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              setWodMoves([
                ...wodMoves,
                {
                  repetitions: "",
                  moveId: "",
                },
              ])
            }
          >
            Add
          </Button>

          <Stack spacing={2}>
            <CustomAutocomplete
              options={Object.values(groupsText)}
              placeholder="Group"
              defaultValue="SOLO"
              label="Group"
              onChange={(_e, newValue) => setGroup(newValue)}
            />

            <TextField
              variant="standard"
              size="small"
              type="number"
              placeholder="Time Cap"
              label="Time Cap"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              sx={{ width: 80 }}
              value={timeCap}
              onChange={(e) => setTimeCap(e.target.value)}
            />

            <TextField
              variant="standard"
              size="small"
              placeholder="Extra comment (Use for strategy or something else)"
              label="Extra Comment"
              onChange={(e) => {}}
            />
          </Stack>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tab} index={2}>
          Item Three
        </TabPanel>
      </Box>
      <Box width="20%" sx={{ backgroundColor: "#e5e5e5" }}>
        <p>Wod Preview</p>
        <p>{rounds && `${rounds} ROUNDS`}</p>
        <p>{groupsText[group]}</p>
      </Box>
    </Dialog>
  );
}
