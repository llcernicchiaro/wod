import {
  Autocomplete,
  AutocompleteProps,
  Container,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Group, Priority } from "../models";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { FormModal } from "./form-modal";
import { useState } from "react";

// import { DataStore } from '@aws-amplify/datastore';
// import { Wod } from './models';

// await DataStore.save(
//     new Wod({
// 		"date": "1970-01-01Z",
// 		"movements": [],
// 		"time": "Lorem ipsum dolor sit amet",
// 		"modality": [],
// 		"totalReps": 1020,
// 		"priority": Priority.TASK,
// 		"scheme": Scheme.SINGLE,
// 		"group": Group.SOLO
// 	})
// );

type Header = {
  name: string;
  duration: number;
  start: number;
  end: number;
};

type Props = {
  date: Date;
  stage:
    | "WHITEBOARD"
    | "GENERAL WARM-UP"
    | "SPECIFIC WARM-UP"
    | "BREAK AND LOGISTICS"
    | "WORKOUT"
    | "COOL-DOWN";
};

export function Cell({ date, stage }: Props) {
  const [openForm, setOpenForm] = useState(false);

  const getData = () => {
    // getDataFromAPI(date, stage);
  };

  const header = {
    duration: 5,
    start: 32,
    end: 37,
  };

  const content = () => {
    switch (stage) {
      case "WHITEBOARD":
        return "Briefing";
      case "GENERAL WARM-UP":
        return "COACH WARM-UP";
      case "SPECIFIC WARM-UP":
        return "";
      case "BREAK AND LOGISTICS":
        return "Bathroom stop";
      case "WORKOUT":
        return (
          <>
            IN TEAMS OF 2<br />
            <br />
            FOR TIME
            <br />
            16 ROUNDS
            <br />
            30 DOUBLE UNDERS
            <br />
            10 2DB CLEAN AND JERK (22,5/15)
            <br />
            <br />
            *ALTERNATING FULL ROUNDS
            <br /> CAP: 20
            <br /> MIN SCORE: TIME
          </>
        );
      case "COOL-DOWN":
        return "Stretching";
    }
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          padding: "4px",
          fontWeight: "bold",
        }}
      >
        {stage} ({header.duration} min) :{header.start}-:{header.end}
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
        <IconButton
          sx={{ position: "absolute", right: 0, top: 0 }}
          onClick={() => setOpenForm(true)}
        >
          <EditIcon />
        </IconButton>

        <p style={{ margin: 0 }}>{content()}</p>
        <FormModal open={openForm} setOpen={setOpenForm} date={date} />
      </Box>
    </Box>
  );
}
