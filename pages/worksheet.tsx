import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Cell } from "../components/cell";
import WeekPicker from "../components/week-picker";
import { add, format, startOfWeek } from "date-fns";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Worksheet() {
  const [date, setDate] = useState(startOfWeek(new Date()));
  const dates = [
    date,
    add(date, { days: 1 }),
    add(date, { days: 2 }),
    add(date, { days: 3 }),
    add(date, { days: 4 }),
    add(date, { days: 5 }),
    add(date, { days: 6 }),
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 4, mb: 8 }}>
      <WeekPicker date={date} setDate={setDate} />
      <Grid container spacing={1} columns={7} mt={2}>
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>{format(day, "EEEE - dd/MM")}</Item>
          </Grid>
        ))}
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>
              <Cell date={day} stage="WHITEBOARD" />
            </Item>
          </Grid>
        ))}
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>
              <Cell date={day} stage="GENERAL WARM-UP" />
            </Item>
          </Grid>
        ))}
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>
              <Cell date={day} stage="SPECIFIC WARM-UP" />
            </Item>
          </Grid>
        ))}
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>
              <Cell date={day} stage="BREAK AND LOGISTICS" />
            </Item>
          </Grid>
        ))}
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>
              <Cell date={day} stage="WORKOUT" />
            </Item>
          </Grid>
        ))}
        {dates.map((day) => (
          <Grid xs={1} key={format(day, "ddMM")}>
            <Item>
              <Cell date={day} stage="COOL-DOWN" />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
