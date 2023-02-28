import { IconButton, TextField } from "@mui/material";
import { Wod, WorkoutSession } from "../models";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DataStore } from "aws-amplify";
import { format } from "date-fns";

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
    | "WHITEBOARD"
    | "GENERAL WARM-UP"
    | "SPECIFIC WARM-UP"
    | "BREAK AND LOGISTICS"
    | "WORKOUT"
    | "COOL-DOWN";
};

const stages = {
  WHITEBOARD: "whiteboard",
  "GENERAL WARM-UP": "generalwu",
  "SPECIFIC WARM-UP": "specificwu",
  "BREAK AND LOGISTICS": "break",
  WORKOUT: "workout",
  "COOL-DOWN": "cooldown",
};

export function Cell({ date, stage, workoutSession, onOpenForm }: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (workoutSession) setText(workoutSession[stages[stage]]);
  }, [stage, workoutSession]);

  const debounced = useDebouncedCallback(async function (value) {
    setText(value);
    if (workoutSession) {
      const result = await DataStore.save(
        WorkoutSession.copyOf(workoutSession, (updated) => {
          updated[stages[stage]] = value;
        })
      );
      console.log("Edit ", result);
    } else {
      const session = await DataStore.save(
        new WorkoutSession({
          [stages[stage]]: value,
          date: format(date, "yyyy-MM-dd"),
        })
      );
      const wod = await DataStore.save(
        new Wod({
          WorkoutSession: session,
        })
      );

      const session2 = await DataStore.save(
        WorkoutSession.copyOf(session, (updated) => {
          updated.Wod = wod;
        })
      );
      console.log("Create WodSession and Wod", session2, wod);
    }
  }, 1000);

  const header = {
    duration: 5,
    start: 32,
    end: 37,
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
        {stage === "WORKOUT" ? (
          <>
            <IconButton
              sx={{ position: "absolute", right: 0, top: 0 }}
              onClick={() => onOpenForm!(workoutSession, date)}
            >
              <EditIcon />
            </IconButton>
            <p style={{ whiteSpace: "pre-line" }}>{text}</p>
          </>
        ) : (
          <TextField
            multiline
            minRows={3}
            defaultValue={text}
            variant="standard"
            size="small"
            placeholder="Click here to start editing"
            InputProps={{ disableUnderline: true }}
            onChange={(e) => debounced(e.target.value)}
          />
        )}
      </Box>
    </Box>
  );
}
