import React, { useState, Dispatch, SetStateAction, ReactNode } from "react";
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
import { Group, Priority } from "../models";
import { FieldArray, Form, Formik, getIn } from "formik";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  date: Date;
};

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
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
      />
    )}
  />
);

export function FormModal({ date, open, setOpen }: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
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
          <Tabs value={value} onChange={handleChange}>
            <Tab label="For Time" />
            <Tab label="AMRAP" />
            <Tab label="Heavy Day" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Formik
            initialValues={{
              people: [
                {
                  id: Math.random(),
                  firstName: "",
                  lastName: "",
                },
              ],
            }}
            // validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("onSubmit", JSON.stringify(values, null, 2));
            }}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              isValid,
            }) => (
              <Form noValidate autoComplete="off">
                <FieldArray name="people">
                  {({ push, remove }) => (
                    <>
                      {values.people.map((p, index) => (
                        <Stack spacing={2} direction="row" key={index}>
                          <TextField
                            variant="standard"
                            size="small"
                            type="number"
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                            onChange={(e) => {}}
                          />
                          <CustomAutocomplete
                            options={Object.values(Group)}
                            placeholder="Movement"
                          />
                        </Stack>
                      ))}

                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() =>
                          push({
                            id: Math.random(),
                            firstName: "",
                            lastName: "",
                          })
                        }
                      >
                        Add
                      </Button>
                    </>
                  )}
                </FieldArray>
                <Stack spacing={2}>
                  <CustomAutocomplete
                    options={Object.values(Group)}
                    placeholder="Group"
                    defaultValue="SOLO"
                  />

                  <CustomAutocomplete
                    options={Object.values(Group)}
                    placeholder="Time"
                  />
                  <CustomAutocomplete
                    options={Object.values(Group)}
                    placeholder="Score"
                  />
                </Stack>
              </Form>
            )}
          </Formik>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>
      <Box width="20%" sx={{ backgroundColor: "#e5e5e5" }}>
        Wod Preview
      </Box>
    </Dialog>
  );
}
