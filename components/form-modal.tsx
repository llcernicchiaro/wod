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
  WorkoutSession,
} from "../models";
import { DataStore } from "aws-amplify";

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

type Movement = {
  reps: number;
  name: string;
};

type ForTimeForm = {
  rounds?: number;
  moves?: Movement[];
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

export function FormModal({ date, open, setOpen, wod, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [movesOptions, setMovesOptions] = useState<LazyMove[]>([]);
  const [wodMoves, setWodMoves] = useState<LazyMovement[]>([]);
  const [rounds, setRounds] = useState(1);
  const [comment, setComment] = useState("");
  const [group, setGroup] = useState<keyof typeof Group>("SOLO");
  const [movements, setMovements] = useState([{ reps: "", name: "" }]);
  const groupsText = {
    [Group.SOLO]: "",
    [Group.INPAIRS]: "IN PAIRS",
    [Group.INTEAMSOF3]: "IN TEAMS OF 3",
    [Group.INTEAMSOF4]: "IN TEAMS OF 4",
  };

  useEffect(() => {
    setRounds(wod.rounds || 1);
    setGroup(wod.group || "SOLO");
    setComment(wod.comment || "");
  }, [wod]);

  useEffect(() => {
    const getMovements = async () => {
      const moves = await DataStore.query(Move);
      console.log(moves);
      if (!!moves) setMovesOptions(moves);
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
            <Tab label="For Time" />
            <Tab label="AMRAP" />
            <Tab label="Heavy Day" />
            <Tab label="Time ON / Time OFF" />
            <Tab label="Famous (Girls, Heroes, Open, etc)" />
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
            onChange={(e) => setRounds(e.target.value)}
          />

          {movements.map((p, index) => (
            <Stack spacing={2} direction="row" key={index} width="100%">
              <TextField
                variant="standard"
                size="small"
                type="number"
                placeholder="Reps"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={{ width: 80 }}
              />
              <CustomAutocomplete
                options={movesOptions}
                placeholder="Movement"
                sx={{ width: "100%" }}
                getOptionLabel={(option) => option.name}
              />
            </Stack>
          ))}

          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              setMovements([
                ...movements,
                {
                  reps: "",
                  name: "",
                },
              ])
            }
          >
            Add
          </Button>

          <Stack spacing={2}>
            <CustomAutocomplete
              options={Object.values(Group)}
              placeholder="Group"
              defaultValue="SOLO"
              label="Group"
              onChange={(_e, newValue) => setGroup(newValue)}
            />

            <CustomAutocomplete
              options={Object.values(Group)}
              placeholder="Time Cap"
              label="Time Cap"
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
