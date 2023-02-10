import React, { useState, ComponentType } from "react";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameDay,
  getWeek,
  format,
  setDefaultOptions,
  add,
  sub,
} from "date-fns";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

setDefaultOptions({ weekStartsOn: 1 });

interface CustomPickerDayProps extends PickersDayProps<Date> {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
})) as ComponentType<CustomPickerDayProps>;

type WeekPickerProps = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

export default function WeekPicker({ date, setDate }: WeekPickerProps) {
  const start = startOfWeek(date);
  const end = endOfWeek(date);

  const goToNextWeek = () => {
    setDate(add(end, { days: 1 }));
  };

  const goToPreviousWeek = () => {
    setDate(sub(start, { days: 7 }));
  };

  const renderWeekPickerDay = (
    dateParam: Date,
    selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ) => {
    if (!date) {
      return <PickersDay {...pickersDayProps} />;
    }

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(dateParam, start);
    const isLastDay = isSameDay(dateParam, end);

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <IconButton onClick={goToPreviousWeek}>
        <ChevronLeftIcon />
      </IconButton>
      <DatePicker
        value={date}
        onChange={(newValue) => setDate(startOfWeek(newValue!))}
        renderDay={renderWeekPickerDay}
        renderInput={(params) => <TextField {...params} size="small" />}
        inputFormat={`'Week ${getWeek(date)}:' ${format(
          start,
          "dd/MM"
        )} - ${format(end, "dd/MM")}`}
      />
      <IconButton onClick={goToNextWeek}>
        <ChevronRightIcon />
      </IconButton>
    </LocalizationProvider>
  );
}
